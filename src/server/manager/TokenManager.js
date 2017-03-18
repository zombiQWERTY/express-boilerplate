import jwt              from 'jsonwebtoken';
import _values          from 'lodash/values';
import moment           from 'moment';
import { ExtractJwt }   from 'passport-jwt';

import UserManager      from '../manager/UserManager';
import TokenModel       from '../models/Token';
import tokenTypeEnum    from '../enums/tokenType';
import TokenError       from '../errors/TokenError';
import secrets          from '../auth/secrets';
import {
    CREDITIANS_REFRESH_LIFETIME_DAYS,
    PASSWORD_RESET_TOKEN_LIFETIME,
    CREDITIANS_LIFETIME_DAYS
} from '../consts';

const tokenTypes = _values(tokenTypeEnum);

class TokenManager {
    static extractConfig = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey:    secrets.jwt
    };

    static async saveToken({ token, user, fingerprint, type }) {
        if (!tokenTypes.includes(type)) { throw new TokenError('Unknown token type.', { type: 'SaveToken' }); }
        if (!user) { throw new TokenError('User is not provided.', { type: 'SaveToken' }); }
        if (!token) { throw new TokenError('Token is not provided.', { type: 'SaveToken' }); }

        const Token = new TokenModel({ token, user, fingerprint, type });
        try {
            await Token.save();
        } catch (reason) {
            throw new TokenError('Can not save token.', { type: 'SaveToken', reason });
        }
    }

    static async disablePreviousTokens({ newToken, user, fingerprint, type }) {
        if (!tokenTypes.includes(type)) { throw new TokenError('Unknown token type.', { type: 'TokenDisableError' }); }
        if (!fingerprint && type !== tokenTypeEnum.PASSWORD_RESET) {
            throw new TokenError('Device fingerprint is not provided.', { type: 'TokenDisableError' });
        }
        if (!user) { throw new TokenError('User is not provided.', { type: 'TokenDisableError' }); }
        if (!newToken) { throw new TokenError('Token is not provided.', { type: 'TokenDisableError' }); }

        newToken = this.splitToken(newToken);

        const conditions = { token: { $ne: newToken }, user, type, active: true };
        if (type !== tokenTypeEnum.PASSWORD_RESET) { conditions.fingerprint = fingerprint; }
        try {
            await TokenModel.update(conditions, {
                $set: { active: false }
            }, { multi: true });
        } catch (reason) {
            throw new TokenError('Can not disable previous token.', { type: 'TokenDisableError', reason });
        }
    }

    static async disableToken({ token, user, fingerprint, type }) {
        if (!tokenTypes.includes(type)) { throw new TokenError('Unknown token type.', { type: 'TokenDisableError' }); }
        if (!fingerprint && type !== tokenTypeEnum.PASSWORD_RESET) {
            throw new TokenError('Device fingerprint is not provided.', { type: 'TokenDisableError' });
        }
        if (!user) { throw new TokenError('User is not provided.', { type: 'TokenDisableError' }); }
        if (!token) { throw new TokenError('Token is not provided.', { type: 'TokenDisableError' }); }

        token = this.splitToken(token);

        const conditions = { token, fingerprint, user, type };
        try {
            await TokenModel.update(conditions, {
                $set: { active: false }
            });
        } catch (reason) {
            throw new TokenError('Can not disable access token.', { type: 'TokenDisableError', reason });
        }
    }

    static generateToken(id, type = tokenTypeEnum.ACCESS) {
        if (!tokenTypes.includes(type)) { throw new TokenError('Unknown token type.', { type: 'GenerateTokenError' }); }
        if (!id) { throw new TokenError('User id is not provided.', { type: 'GenerateTokenError' }); }

        let days;
        let data;
        if (type === tokenTypeEnum.ACCESS) {
            days = CREDITIANS_LIFETIME_DAYS;
            data = { id };
        }
        if (type === tokenTypeEnum.REFRESH) {
            days = CREDITIANS_REFRESH_LIFETIME_DAYS;
        }
        if (type === tokenTypeEnum.PASSWORD_RESET) {
            days = PASSWORD_RESET_TOKEN_LIFETIME;
        }
        if (type !== tokenTypeEnum.ACCESS) {
            data = { info: new Buffer('Cool hacker, gracio!', 'utf8').toString('hex') };
        }

        const generatedToken = jwt.sign(data, secrets.jwt, { expiresIn: `${days}d` });
        const token          = `JWT ${generatedToken}`;

        return { token, generatedToken };
    }

    static async getUser(token) {
        if (!token) { throw new TokenError('Token is not provided.', { type: 'UserGetError' }); }

        token = this.splitToken(token);

        const payload = jwt.verify(token, secrets.jwt);
        if (!payload.id) { throw new TokenError('Can not get user.', { type: 'UserGetError' }); }

        const expiration = moment.unix(payload.exp);
        if (expiration < moment.utc()) { throw new TokenError('Token expired.', { type: 'UserGetError' }); }

        let tokenInfo;
        try {
            tokenInfo = await TokenModel.findOne({ token }).lean();
        } catch (reason) {
            throw new TokenError('Token find error.', { type: 'UserGetError', reason });
        }

        if (!tokenInfo) { throw new TokenError('Token not found.', { type: 'UserGetError' }); }
        if (!tokenInfo.active) { throw new TokenError('Token is disabled.', { type: 'UserGetError' }); }

        let user;
        try {
            user = await UserManager.getUserModelById(payload.id);
        } catch (reason) {
            throw new TokenError('Can not get user.', { type: 'UserGetError', reason });
        }

        return user;
    }

    static async provideToken(user, type, fingerprint = null) {
        if (!tokenTypes.includes(type)) { throw new TokenError('Unknown token type.', { type: 'ProvideToken' }); }
        if (!fingerprint && type !== tokenTypeEnum.PASSWORD_RESET) {
            throw new TokenError('Device fingerprint is not provided.', { type: 'ProvideToken' });
        }
        if (!user) { throw new TokenError('User is not provided.', { type: 'ProvideToken' }); }

        const userId = user.id || user;
        const { token, generatedToken } = this.generateToken(userId, type);

        try {
            await this.saveToken({ token: generatedToken, user: userId, fingerprint, type });
            await this.disablePreviousTokens({ newToken: generatedToken, user: userId, fingerprint, type });
        } catch (error) {
            throw error;
        }

        if (type !== tokenTypeEnum.ACCESS) { return token; }

        return {
            token: { accessToken: token },
            user
        };
    }

    static async updateAccessToken(refreshToken, user, fingerprint) {
        if (!fingerprint) { throw new TokenError('Device fingerprint is not provided.', { type: 'updateAccessToken' }); }
        if (!user) { throw new TokenError('User is not provided.', { type: 'updateAccessToken' }); }
        if (!refreshToken) { throw new TokenError('Refresh token is not provided.', { type: 'updateAccessToken' }); }

        try {
            await this.checkToken(refreshToken, tokenTypeEnum.REFRESH, user);
        } catch (error) {
            throw error;
        }

        let data;
        try {
            data = await this.provideToken(user, tokenTypeEnum.ACCESS, fingerprint);
        } catch (error) {
            throw error;
        }

        return { token: data.token };
    }

    static async checkToken(token, type, user = null) {
        if (!tokenTypes.includes(type)) { throw new TokenError('Unknown token type.', { type: 'TokenDisableError' }); }
        const normalType = this.normalizeType(type);
        if (!token) { throw new TokenError(`${normalType} token is not provided.`, { type: 'checkToken' }); }

        let tokenInfo;
        try {
            const conditions = { token: this.splitToken(token), type };
            if (user) { conditions.user = user.id; }
            tokenInfo = await TokenModel.findOne(conditions).lean();
        } catch (reason) {
            throw new TokenError(`${normalType} token not found.`, { type: 'checkToken', reason });
        }

        if (!tokenInfo) { throw new TokenError(`${normalType} token not found.`, { type: 'checkToken' }); }
        if (!tokenInfo.active) { throw new TokenError(`${normalType} token disabled.`, { type: 'checkToken' }); }

        return tokenInfo;
    }

    static splitToken(token) {
        return token.includes(' ') ? token.split(' ')[1] : token;
    }

    static normalizeType(type) {
        type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        type = type.replace(/_/g, ' ');
        return type;
    }
}

export default TokenManager;

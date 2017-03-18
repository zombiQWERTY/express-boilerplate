import passport      from 'passport';
import _values       from 'lodash/values';

import TokenManager  from '../manager/TokenManager';
import tokenTypeEnum from '../enums/tokenType';

export default (req, res, next) => {
    if (req.headers.authorization) {
        passport.authenticate('jwt', { session: false }, async (error, decryptToken, jwtError) => {
            if (error)    { return next(error);    }
            if (jwtError) { return next(jwtError); }

            const tokenTypes = _values(tokenTypeEnum);

            try {
                await TokenManager.checkToken(req.header('Authorization'), tokenTypes[0]);
            } catch (error) {
                return next(error);
            }

            req.user = decryptToken;
            return next();
        })(req, res, next);
    } else {
        passport.authenticate('session')(req, res, next);
    }
};

export const authLocal = (req, res, next) => {
    const rules = { session: false };
    if (!req.xhr) {
        rules.session         = true;
        rules.successRedirect = '/account';
        rules.failureRedirect = '/';
    }

    passport.authenticate('local', rules)(req, res, next);
};

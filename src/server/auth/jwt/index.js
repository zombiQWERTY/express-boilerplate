import { Strategy }  from 'passport-jwt';
import moment        from 'moment';

import UserManager   from '../../manager/UserManager';
import TokenManager  from '../../manager/TokenManager';

export default function jwtStrategy() {
    return new Strategy(TokenManager.extractConfig, async (jwtPayload, done) => {
        const expirationDate = moment.unix(jwtPayload.exp);
        if (expirationDate < moment.utc()) { return done(new Error('Token expired.'), null); }

        try {
            const user = await UserManager.getUserModelById(jwtPayload.id);
            return done(null, user || null);
        } catch (error) {
            return done(error, null);
        }
    });
}

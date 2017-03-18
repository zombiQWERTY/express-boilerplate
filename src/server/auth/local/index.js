import Strategy               from 'passport-local';
import moment                 from 'moment';

import UserModel              from '../../models/User';
import { hashPasswordBySalt } from '../../manager/passwordUtils';

export default function localStrategy() {
    const options = {
        usernameField: 'email'
    };
    return new Strategy(options, async (email, password, done) => {
        const genError = message => {
            const error  = new Error(message);
            error.name   = 'AuthenticationError';
            error.status = 401;
            return done(error, null);
        };

        let user;
        try {
            user = await UserModel
                .findOne({ email })
                .select('+password +salt')
                .populate('avatar');
        } catch (error) {
            return done(error, null);
        }

        if (!user) { return genError('Password or email are incorrect.'); }
        if (!user.password || !user.salt) { return genError('Authentication not possible. No salt value stored.'); }

        let hashedPassword;
        try {
            hashedPassword = await hashPasswordBySalt(password, user.salt);
        } catch (error) {
            return done(error, null);
        }

        if (hashedPassword === user.password) {
            user.lastLogin = moment.utc();
            await user.save();
            return done(null, user);
        }

        return genError('Password or email are incorrect.');
    });
}

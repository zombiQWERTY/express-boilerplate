import passport    from 'passport';

import UserManager from '../manager/UserManager';

export default () => {
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserManager.getUserModelById(id);
            done(null, user || null);
        } catch (error) {
            done(error, null);
        }
    });
};

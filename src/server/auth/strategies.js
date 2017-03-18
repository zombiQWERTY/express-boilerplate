import passport      from 'passport';

import jwtStrategy   from '../auth/jwt';
import localStrategy from '../auth/local';

export default () => {
    passport.use('local', localStrategy());
    passport.use('jwt', jwtStrategy());
};

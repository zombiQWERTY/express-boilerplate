import express                  from 'express';

import { needsGroup, forAnon }  from '../auth';
import { authLocal }            from '../auth/auth';

import index                    from './Account/index';
import login                    from './Account/login';
import register                 from './Account/register';
import logout                   from './Account/logout';
import updateData               from './Account/updateData';
import updateToken              from './Account/updateToken';

const router = express.Router();

export default app => {
    router
        .get   ('/', needsGroup(['USER']), index)
        .post  ('/update/data', needsGroup(['USER']), updateData)

        .post  ('/login', forAnon(), authLocal, login)
        .post  ('/register', forAnon(), register)
        .get   ('/logout', needsGroup(['USER']), logout)
        .put   ('/token', needsGroup(['USER']), updateToken);

    app.use(`/account`, router);
};

import express from 'express';

import profile from './User/profile';
import auth    from '../auth/auth';

const router = express.Router();

export default app => {
    router
        .get   ('/:userId', auth, profile);

    app.use(`/user`, router);
};

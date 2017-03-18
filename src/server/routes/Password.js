import express     from 'express';

import { forAnon,
    needsGroup }   from '../auth';
import restore     from './Password/restore';
import confirm     from './Password/confirm';
import reset       from './Password/reset';
import update      from './Password/update';

const router = express.Router();

export default app => {
    router
        .post   ('/restore', forAnon(), restore)
        .get    ('/confirm/:token', forAnon(), confirm)
        .post   ('/reset', forAnon(), reset)
        .post   ('/update', needsGroup(['USER']), update);

    app.use(`/password`, router);
};

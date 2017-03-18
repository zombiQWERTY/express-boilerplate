import express from 'express';

import welcome from './Welcome/Index';

const router = express.Router();

export default app => {
    router
        .get('/', welcome);

    app.use('', router);
};

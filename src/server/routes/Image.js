import express        from 'express';

import { needsGroup } from '../auth';
import FileManager    from '../manager/FileManager';

import updateAvatar   from './Image/updateAvatar';
import deleteAvatar   from './Image/deleteAvatar';

const router = express.Router();

export default app => {
    router
        .post  ('/avatar', needsGroup(['USER']), FileManager.uploader().single('avatar'), updateAvatar)
        .delete('/avatar', needsGroup(['USER']), deleteAvatar);

    app.use(`/image`, router);
};

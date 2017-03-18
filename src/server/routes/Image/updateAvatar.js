import wrap         from 'express-async-wrap';

import UserManager  from '../../manager/UserManager';
import ImageManager from '../../manager/ImageManager';

/**
 * @api {post} /image/avatar Update user avatar
 * @apiName UpdateAvatar
 * @apiGroup Image
 *
 * @apiParam {File} avatar file
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    if (!req.file) {
        return res.setRes.fail({
            type:    'json',
            status:   400,
            message:  'Avatar is not provided.',
            needUser: false
        });
    }
    try {
        const fileId = await ImageManager.saveImage(req.file);
        await UserManager.update(req.user, {
            avatar: fileId
        });
    } catch (error) {
        return res.setRes.fail({
            type:    'json',
            status:   400,
            errors:   error.detail,
            message:  error.message,
            needUser: false
        });
    }

    return res.setRes.success({
        type:    'json',
        status:   200,
        needUser: false
    });
});

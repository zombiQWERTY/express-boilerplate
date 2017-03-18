import wrap        from 'express-async-wrap';

import UserManager from '../../manager/UserManager';

/**
 * @api {delete} /image/avatar Delete user avatar
 * @apiName DeleteAvatar
 * @apiGroup Image
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    try {
        await UserManager.deleteImage(req.user, 'avatar');
    } catch (e) {
        return res.setRes.fail({
            type:    'json',
            status:   400,
            errors:   e.detail,
            message:  e.message,
            needUser: false
        });
    }

    return res.setRes.success({
        type:    'json',
        status:   200,
        needUser: false
    });
});

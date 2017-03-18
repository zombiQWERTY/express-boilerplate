import wrap            from 'express-async-wrap';

import PasswordManager from '../../manager/PasswordManager';

/**
 * @api {post} /password/restore Password restore action
 * @apiName PasswordRestore
 * @apiGroup Password
 *
 * @apiPermission Unauthorized users
 *
 * @apiDescription Send email to user with restore token, etc.
 *
 * @apiParam {String} email User email
 *
 * @apiSuccess {Object} data
 * @apiSuccess {Number} status Status code
 *
 * @apiError 400 Bad Request (if no data provided or other errors)
 * @apiError 400 Bad Request Object with errors and message
 *
 * @apiVersion 1.0.0
 */

export default wrap(async(req, res, next) => {
    let token;
    try {
        token = await PasswordManager.sendRestoreLink(req.body.email);
    } catch (error) {
        return next(error);
    }

    return res.setRes.success({
        type:     'both',
        status:   200,
        template: 'Password/restoreLinkSent',
        data:     { token }
    });
});

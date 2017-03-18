import wrap            from 'express-async-wrap';

import PasswordManager from '../../manager/PasswordManager';

/**
 * @api {post} /password/update Password update
 * @apiName PasswordUpdate
 * @apiGroup Password
 *
 * @apiPermission Authorized users
 *
 * @apiParam {String} oldPassword - old password
 * @apiParam {String} password - new password
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
    try {
        await PasswordManager.checkOldPassword(req.user.id, req.body.oldPassword);
    } catch (error) {
        return next(error);
    }

    try {
        await PasswordManager.saveNewPassword(req.user.id, req.body.password);
    } catch (error) {
        return next(error);
    }

    if (!req.xhr) {
        return res.setRes.success({
            type:           'redirect',
            redirectUrl:    '/account',
            redirectStatus: 302
        });
    }

    return res.setRes.success({
        type:     'json',
        status:   200,
        needUser: false
    });
});

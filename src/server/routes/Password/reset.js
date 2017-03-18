import wrap            from 'express-async-wrap';

import PasswordManager from '../../manager/PasswordManager';
import TokenManager    from '../../manager/TokenManager';
import tokenTypes      from '../../enums/tokenType';

/**
 * @api {post} /password/reset Password reset
 * @apiName PasswordReset
 * @apiGroup Password
 *
 * @apiPermission Unauthorized users
 *
 * @apiDescription Form with field for token
 *
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
    let token;
    try {
        token = await TokenManager.checkToken(req.session.token, tokenTypes.PASSWORD_RESET);
        await TokenManager.disableToken({
            token:       req.session.token,
            user:        token.user,
            fingerprint: null,
            type:        tokenTypes.PASSWORD_RESET
        });
    } catch (error) {
        return next(error);
    }

    try {
        await PasswordManager.saveNewPassword(token.user, req.body.password);
    } catch (error) {
        return next(error);
    }

    delete req.session.token;
    req.session.destroy(error => {
        return next(error);
    });

    return res.setRes.success({
        type:           'redirect',
        redirectUrl:    '/',
        redirectStatus: 302
    });
});

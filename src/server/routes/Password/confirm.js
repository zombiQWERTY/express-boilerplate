import wrap         from 'express-async-wrap';

import TokenManager from '../../manager/TokenManager';
import tokenTypes   from '../../enums/tokenType';

/**
 * @api {get} /password/confirm/:token Password confirm form (for token) or redirect to reset password page (if
 * token exists)
 * @apiName PasswordConfirm
 * @apiGroup Password
 *
 * @apiPermission Unauthorized users
 *
 * @apiDescription Form with field for token
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
        await TokenManager.checkToken(req.params.token, tokenTypes.PASSWORD_RESET);
    } catch (error) {
        return next(error);
    }

    req.session.token = req.params.token;

    return res.setRes.success({
        type:     'page',
        status:   200,
        template: 'Password/reset'
    });
});

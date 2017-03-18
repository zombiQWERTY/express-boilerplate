import wrap          from 'express-async-wrap';

import TokenManager  from '../../manager/TokenManager';
import tokenTypeEnum from '../../enums/tokenType';

/**
 * @api {get} /account/logout Logout
 * @apiName AccountLogout
 * @apiGroup Account
 *
 * @apiHeader {String=XMLHttpRequest} [X-Requested-With=XMLHttpRequest] Managing result type: page (without this header) or JSON
 *
 * @apiParam {String} device_fingerprint Device fingerprint (as query string) (only for API queries)
 *
 * @apiPermission Authorized users
 *
 * @apiDescription Redirect to / (or JSON with info)
 *
 * @apiSuccess {Redirect} 302 to '/'
 * @apiSuccess {Data} Data status information
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if no data provided or other errors)
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    if (req.xhr) {
        try {
            const token = req.header('Authorization');
            await TokenManager.disableToken({
                token,
                user:        req.user.id,
                fingerprint: req.query.device_fingerprint,
                type:        tokenTypeEnum.ACCESS
            });
        } catch (error) {
            return next(error);
        }
    }

    req.logout();

    if (req.xhr) {
        return res.setRes.success({
            status:   200,
            type:     'json',
            data:     { message: 'Successful logout.' },
            needUser: false
        });
    }
    return res.setRes.success({
        type:           'redirect',
        redirectUrl:    '/',
        redirectStatus: 302
    });
});

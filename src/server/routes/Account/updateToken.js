import wrap         from 'express-async-wrap';

import TokenManager from '../../manager/TokenManager';

/**
 * @api {put} /account/token Update user access token
 * @apiName AccountUpdateAccessToken
 * @apiGroup Account
 *
 * @apiPermission Authorized users
 *
 * @apiDescription Update user access token
 *
 * @apiParam {String} refreshToken Refresh token
 * @apiParam {String} deviceFingerprint Device fingerprint
 *
 * @apiSuccess {Status} 200
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if errors)
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    let data;
    try {
        data = await TokenManager.updateAccessToken(req.body.refreshToken, req.user, req.body.deviceFingerprint);
    } catch (error) {
        return next(error);
    }

    return res.setRes.success({
        type:     'json',
        status:   200,
        needUser: false,
        data
    });
});

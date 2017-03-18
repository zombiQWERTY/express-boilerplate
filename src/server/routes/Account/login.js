import wrap          from 'express-async-wrap';
import _values       from 'lodash/values';

import TokenManager  from '../../manager/TokenManager';
import tokenTypeEnum from '../../enums/tokenType';

/**
 * @api {post} /account/login Login
 * @apiName AccountLogin
 * @apiGroup Account
 *
 * @apiHeader {String=XMLHttpRequest} [X-Requested-With=XMLHttpRequest] Managing result type: page (without this header) or JSON
 *
 * @apiPermission Unauthorized users
 *
 * @apiDescription Login to system
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 * @apiParam {String} deviceFingerprint Device fingerprint (for API requests only)
 *
 * @apiSuccess {Object} user User info (if wanted json) or redirect to account page
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if no data provided)
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    if (!req.xhr) { return next(); }

    const tokenTypes = _values(tokenTypeEnum);
    let data;
    try {
        data = await TokenManager.provideToken(req.user, tokenTypes[0], req.body.deviceFingerprint);
        data.token.refreshToken = await TokenManager.provideToken(req.user, tokenTypes[1], req.body.deviceFingerprint);
    } catch (error) {
        return next(error);
    }

    return res.setRes.success({
        type:   'json',
        status: 200,
        data
    });
});

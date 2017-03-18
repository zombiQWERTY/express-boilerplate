import wrap        from 'express-async-wrap';

import UserManager from '../../manager/UserManager';

/**
 * @api {post} /account/update/data Update user data
 * @apiName AccountUpdateData
 * @apiGroup Account
 *
 * @apiHeader {String=XMLHttpRequest} [X-Requested-With=XMLHttpRequest] Managing result type: page (without this header) or JSON
 *
 * @apiPermission Authorized users
 *
 * @apiDescription Update logged user data
 *
 * @apiParam {String} name User name
 * @apiParam {String} lastName User last name
 * @apiParam {Date} birthdate User birthdate
 * @apiParam {String} about About user
 * @apiParam {String} phone User phone
 *
 * @apiSuccess {Redirect} 302 '/account'
 * @apiSuccess {Status} 200
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if no data provided)
 * @apiError {Object} data errors and message
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    if (!Object.keys(req.body).length) {
        if (req.xhr) {
            const error  = new Error('Formdata is empty.');
            error.status = 400;
            return next(error);
        }
        return res.setRes.fail({
            type:        'redirect',
            redirectUrl: '/account'
        });
    }

    try {
        req.user = await UserManager.update(req.user, req.body);
    } catch (error) {
        if (req.xhr) { return next(error); }
        return res.setRes.fail({
            type:        'redirect',
            redirectUrl: '/account'
        });
    }

    if (req.xhr) {
        return res.setRes.success({
            status: 200,
            type:   'json'
        });
    }
    return res.setRes.success({
        type:        'redirect',
        redirectUrl: '/account'
    });
});

import wrap         from 'express-async-wrap';

import UserManager  from '../../manager/UserManager';

/**
 * @api {post} /account/register Registration
 * @apiName AccountRegistration
 * @apiGroup Account
 *
 * @apiHeader {String=XMLHttpRequest} [X-Requested-With=XMLHttpRequest] Managing result type: page (without this header) or JSON
 *
 * @apiPermission Unauthorized users
 *
 * @apiDescription Register to system
 *
 * @apiParam {Object} data User necessary data
 *
 * @apiSuccess {Redirect} 302 '/'
 * @apiSuccess {Status} 200
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if no data provided)
 * @apiError {Object} data errors and message
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    let user;
    try {
        user = await UserManager.register(req.body);
    } catch (error) {
        return res.setRes.fail({
            type:    'both',
            status:  400,
            errors:  error.detail,
            message: error.message
        });
    }

    if (req.xhr) {
        return res.setRes.success({
            type:     'json',
            status:   200,
            data:     { user },
            needUser: false
        });
    }

    user.authenticate(req.body.password, error => {
        if (error) { return next(error); }

        req.logIn(user, error => {
            if (error) { return next(error); }

            return res.setRes.success({
                type:           'redirect',
                redirectUrl:    '/account',
                redirectStatus: 302
            });
        });
    });
});

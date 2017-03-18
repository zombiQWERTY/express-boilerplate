import wrap from 'express-async-wrap';

/**
 * @api {get} /account User page
 * @apiName AccountPage
 * @apiGroup Account
 *
 * @apiHeader {String=XMLHttpRequest} [X-Requested-With=XMLHttpRequest] Managing result type: page (without this header) or JSON
 *
 * @apiPermission Authorized users
 *
 * @apiDescription Page (or JSON) with full user info
 *
 * @apiSuccess {Object} user Full user info
 *
 * @apiError 401 Unauthorized
 * @apiError 400 Bad Request (if no data provided or other errors)
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    return res.setRes.success({
        status:   200,
        type:     'page',
        template: 'Account/index',
    });
});

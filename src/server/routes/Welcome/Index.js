import wrap from 'express-async-wrap';

/**
 * @api {get} / Welcome page
 * @apiName Home
 * @apiGroup Home
 *
 * @apiVersion 1.0.0
 */

export default wrap(async (req, res, next) => {
    return res.setRes.success({
        type:        'both',
        template:    'Home/welcome',
        status:      200
    });
});

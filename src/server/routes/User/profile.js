import wrap                  from 'express-async-wrap';

import UserManager           from '../../manager/UserManager';

/**
 * @api {get} /user/:userId Get user profile
 * @apiName Profile
 * @apiGroup User
 *
 * @apiParam {ObjectId} userId User id
 *
 * @apiVersion 1.0.0
 */
export default wrap(async (req, res, next) => {
    let user;
    try {
        user = await UserManager.getUserModelById(req.params.userId);
    } catch (e) {
        return next(e);
    }

    return res.setRes.success({
        status:   200,
        type:     'both',
        template: 'User/profile',
        data:     { userInfo: user }
    });
});

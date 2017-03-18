import compose   from 'compose-middleware';

import auth      from './auth';
import { ROLES } from '../consts';

export function needsGroup(group = [ROLES.USER]) {
    return compose.compose([
        auth,
        async function(req, res, next) {
            if (!req.user) {
                if (!req.xhr) {
                    return res.setRes.fail({ type: 'redirect' });
                }
                return res.setRes.fail({
                    type:    'both',
                    status:  401,
                    message: 'Unauthorized.'
                });
            }

            if (!group.includes(req.user.role)) {
                return res.setRes.fail({
                    type:    'json',
                    status:  403,
                    message: 'Access denied.'
                });
            }

            await next();
        }
    ]);
}

export function forAnon() {
    return compose.compose([
        auth,
        async function(req, res, next) {
            if (req.user) {
                if (req.xhr) {
                    return res.setRes.fail({
                        message:  'Restricted for authorized users.',
                        status:   400,
                        type:     'json',
                        template: 'error'
                    });
                }
                if (!req.xhr) {
                    return res.setRes.fail({
                        redirectStatus: 302,
                        type:           'redirect',
                        redirectUrl:    '/account'
                    });
                }
            }
            await next();
        }
    ]);
}

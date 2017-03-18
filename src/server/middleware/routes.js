import importDir        from 'import-dir';

import ApplicationError from '../errors/ApplicationError';
import ResponseManager  from '../manager/ResponseManager';
import getRequestUri    from '../utils/getRequestUri';
import NODE_ENV         from '../utils/NODE_ENV';

export default (app) => {
    const routes = importDir('../routes');

    app.use((req, res, next) => {
        res.setRes = new ResponseManager(req, res);
        next();
    });

    Object.keys(routes).forEach(name => routes[name](app));

    app.use((req, res, next) => {
        const error = new ApplicationError('Not Found', {
            detail:       'Unknown route.',
            extendedInfo: `Request url: ${getRequestUri(req)}`,
            status:       404
        });
        next(error);
    });

    app.use((error, req, res, next) => {
        res.setRes.fail({
            message:    error.message,
            status:     error.status || 500,
            type:       'both',
            template:   'error',
            errors:     error.type || (error.detail || []),
            data:       { isProduction: NODE_ENV === 'production' }
        });
    });
};

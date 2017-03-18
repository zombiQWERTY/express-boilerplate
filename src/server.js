import http                    from 'http';

import app                     from './server/index';
import initApp                 from './init';
import { BASE_URI, URIConfig } from './server/consts';
import NODE_ENV                from './server/utils/NODE_ENV';
import winston                 from './server/utils/logger';

export default () => {
    const genericLogger = winston.loggers.get('generic');

    const httpServer  = http.createServer(app);

    httpServer.listen(URIConfig.startport, async () => {
        try {
            await Promise.all(initApp({ server: httpServer, app }));
            genericLogger.info(`\nServer started on port ${URIConfig.startport}.\nEnvironment: ${NODE_ENV}.\nApplication base URI: ${BASE_URI}.`);
        } catch (error) {
            genericLogger.error(`Unable to init application.`, error);
            process.exit(1);
        }
    });

    httpServer.on('error', error => {
        if (error.syscall !== 'listen') {
            genericLogger.error('Unknown error on start up.');
            throw error;
        }
        if (error.code === 'EACCES') { genericLogger.error('Port requires elevated privileges.'); }
        if (error.code === 'EADDRINUSE') { genericLogger.error('Port is already in use.'); }
        process.exit(1);
    });
};

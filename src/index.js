import 'babel-polyfill';

import initServer          from './server.js';
import { connectDatabase } from './server/db';
import { DBConfig }        from './server/db/config';
import winston             from './server/utils/logger';
import memwatch            from './server/utils/memwatch';

memwatch();

(async () => {
    const genericLogger = winston.loggers.get('generic');

    try {
        const info = await connectDatabase(DBConfig);
        genericLogger.info(`Connected to ${info.host}:${info.port}/${info.name} database.`);
    } catch (error) {
        genericLogger.error(`Unable to connect to database.`, error);
        process.exit(1);
    }

    initServer();
})();

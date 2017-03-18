import 'colors';
import memwatch from 'memwatch-next';

import winston  from './logger';

const genericLogger = winston.loggers.get('generic');
const memoryLogger  = winston.loggers.get('memory');

export default () => {
    memwatch.on('leak', info => memoryLogger.warn(info));
    memwatch.on('stats', info => memoryLogger.info(info));
    genericLogger.info(`Memwatch is watching...`);
};

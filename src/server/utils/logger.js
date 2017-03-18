import winston  from 'winston';
import fs       from 'fs';

import NODE_ENV from './NODE_ENV';

const dir = 'log';

/**
 * error:   0
 * warn:    1
 * info:    2
 * verbose: 3
 * debug:   4
 * silly:   5
 */

if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }

let levels = { generic: {}, memory: {} };

switch (NODE_ENV) {
    case 'production':
        levels.generic.console  = -1;
        levels.generic.file     = 'info';

        levels.memory.console   = -1;
        levels.memory.file      = 'info';
        break;

    case 'development':
        levels.generic.console  = 'silly';
        levels.generic.file     = 'debug';

        levels.memory.console   = 'warn';
        levels.memory.file      = 'info';
        break;

    default:
        levels.generic.console  = -1;
        levels.generic.file     = -1;

        levels.memory.console   = -1;
        levels.memory.file      = -1;
        break;
}

winston.loggers.add('generic', {
    console: {
        level:    levels.generic.console,
        colorize: true,
        label:    'generic'
    },
    file: {
        level:     levels.generic.file,
        timestamp: true,
        json:      true,
        filename:  `${dir}/generic.log`
    }
});

winston.loggers.add('memory', {
    console: {
        level:    levels.memory.console,
        colorize: true,
        label:    'memory'
    },
    file: {
        level:     levels.memory.file,
        timestamp: true,
        json:      true,
        filename:  `${dir}/memory.log`
    }
});

export default winston;

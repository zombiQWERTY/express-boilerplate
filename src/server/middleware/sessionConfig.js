import connectMongo     from 'connect-mongo';
import expressSession   from 'express-session';

import NODE_ENV         from '../utils/NODE_ENV';
import secrets          from '../auth/secrets';
import {
    development,
    production,
    testing }           from '../db/config';
import {
    CREDITIANS_LIFETIME
} from '../consts';

const MongoStore = connectMongo(expressSession);

let databaseConfig;
if (NODE_ENV === 'production')  { databaseConfig = production; }
if (NODE_ENV === 'development') { databaseConfig = development; }
if (NODE_ENV === 'test')        { databaseConfig = testing; }

export default {
    key:               'application.sid',
    secret:            secrets.session,
    saveUninitialized: false,
    resave:            false,
    store:             new MongoStore({
        url:        databaseConfig,
        touchAfter: CREDITIANS_LIFETIME
    })
};

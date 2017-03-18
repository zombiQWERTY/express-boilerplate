import compose          from 'compose-middleware';
import logger           from 'express-log';
import cors             from 'cors';
import bodyParser       from 'body-parser';
import qs               from 'express-qs-parser';
import serveStatic      from 'serve-static';
import cookieParser     from 'cookie-parser';
import expressSession   from 'express-session';
import passport         from 'passport';
import helmet           from 'helmet';
import compression      from 'compression';

import corsConfig       from './corsConfig';
import sessionConfig    from './sessionConfig';
import {
    PUBLIC_DIR,
    PUBLIC_UPLOADS }    from '../consts';

export default function middleware(app) {
    app.set('views', `./frontend/views`);
    app.set('view engine', 'pug');

    return compose.compose([
        compression(),
        helmet(),
        logger(),
        bodyParser.json({ limit: '50mb' }),
        bodyParser.urlencoded({ extended: false, limit: '50mb' }),
        cors(corsConfig),
        cookieParser(),
        expressSession(sessionConfig),
        passport.initialize(),
        passport.session(),
        qs({}),
        serveStatic(PUBLIC_DIR),
        serveStatic(PUBLIC_UPLOADS)
    ]);
}

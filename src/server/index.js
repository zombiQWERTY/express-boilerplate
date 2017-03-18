import express     from 'express';

import middleware  from './middleware';
import serializers from './auth/serializers';
import strategies  from './auth/strategies';

const app = express();

app.use(middleware(app));

strategies();
serializers();

export default app;

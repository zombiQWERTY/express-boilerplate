import importDir           from 'import-dir';
import supertest           from 'supertest-as-promised';
import mongoose            from 'mongoose';
import chai                from 'chai';
import chaiAsPromised      from 'chai-as-promised';

import app                 from '../../src/server';
import { connectDatabase } from '../../src/server/db';
import { testing }         from '../../src/server/db/config';
import initApp             from '../../src/init';

const routes    = importDir('./routes');
const integrate = importDir('./integrate');
const sockets   = importDir('./sockets');

const server    = app.listen();
const request   = supertest.agent(server);

chai.use(chaiAsPromised);

describe('Init', () => {
    before(async () => {
        Object.keys(mongoose.models).forEach(async name => await mongoose.model(name).remove());
        try {
            const info = await connectDatabase(testing);
            console.log(`Connected to ${info.host}:${info.port}/${info.name} database`);
        } catch (error) {
            console.log(`Unable to connect to database: \n${error}`);
            process.exit(1);
        }
        try {
            await Promise.all(initApp({ server, app }));
            console.log(`App initialized. Enviroment: test`);
        } catch (error) {
            console.log(`Unable to init application`);
            process.exit(1);
        }
    });

    routes.auth(request);
    routes.authAPI(request);
    integrate.userManager();
});

import routes from './server/middleware/routes';

function init({ server, app }) {
    return [
        routes(app)
    ];
}

export default init;

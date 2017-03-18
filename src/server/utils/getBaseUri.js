import yargs from 'yargs';

const defaultURIConfig = {
    port:      3000,
    startport: 3000,
    protocol:  'http',
    domain:    'localhost'
};

export const URIConfig = Object.assign(defaultURIConfig, {
    port:      yargs.argv.port,
    startport: yargs.argv.startport,
    protocol:  yargs.argv.protocol,
    domain:    yargs.argv.domain
});

const port = URIConfig.port !== 80 ? `:${URIConfig.port}` : '';
export default `${URIConfig.protocol}://${URIConfig.domain}${port}`;

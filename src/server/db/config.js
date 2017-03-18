import NODE_ENV from '../utils/NODE_ENV';

const setup = type => `mongodb://localhost:27017/application_${type}`;

export const development = setup('development');
export const production  = setup('production');
export const testing     = setup('testing');

export const DBConfig = NODE_ENV === 'production' ? production : development;

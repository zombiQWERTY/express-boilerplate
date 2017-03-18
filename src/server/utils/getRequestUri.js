import getBaseUri from './getBaseUri';

export default req => getBaseUri + req.originalUrl;

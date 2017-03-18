import { images as mimesImages } from './helpers/mimes';
import NODE_ENV                  from './utils/NODE_ENV';
import getBaseUri, { URIConfig } from './utils/getBaseUri';

export const UPLOADS = NODE_ENV === 'production' ? 'uploads' : `uploads_${NODE_ENV}`;

export const BASE_URI = getBaseUri;
export { URIConfig };

export const PUBLIC_DIR     = './frontend/public';
export const PUBLIC_UPLOADS = './public';
export const UPLOADS_DIR    = `./${PUBLIC_UPLOADS}/${UPLOADS}`;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; /** Bytes */

export const MIMETYPES = {
    images: mimesImages
};

export const date = {
    pattern: 'DD/MM/YYYY',
    regexp:  /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}$/
};

export const ROLES = {
    USER:  'USER',
    ADMIN: 'ADMIN'
};

export const ONLINE_OFFSET  = 15; /** MINUTES */

export const SMTP_CONFIG = {
    host:      'host',
    port:      25,
    ignoreTLS: true,
    auth: {
        user: 'user@domain.name',
        pass: 'password'
    }
};

export const CREDITIANS_REFRESH_LIFETIME_DAYS = 30; /** DAYS */
export const CREDITIANS_LIFETIME_DAYS         = 7; /** DAYS */
export const CREDITIANS_LIFETIME              = CREDITIANS_LIFETIME_DAYS * 24 * 60 * 60; /** SECONDS */
export const PASSWORD_RESET_TOKEN_LIFETIME    = 1; /** DAYS */

export const CROPSIZES = {
    small:      [200, 200],
    preview:    [400, 400],
    main:       [640, 480],
    fullscreen: [1920, 1080]
};

export const PBKDF2 = {
    salten:          32,
    iterations:      25000,
    keylen:          512,
    encoding:        'hex',
    digestAlgorithm: 'sha256'
};

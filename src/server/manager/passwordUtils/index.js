import crypto     from 'crypto';

import { PBKDF2 } from '../../consts';

export const hashPasswordBySalt = (password, salt) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, PBKDF2.iterations, PBKDF2.keylen, PBKDF2.digestAlgorithm, (pbkdf2Err, hashRaw) => {
            if (pbkdf2Err) { return reject(pbkdf2Err); }

            const hashedPassword = new Buffer(hashRaw, 'binary').toString(PBKDF2.encoding);
            return resolve(hashedPassword);
        });
    });
};

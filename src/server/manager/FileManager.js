import multer     from 'multer';
import mkdirp     from 'mkdirp';
import jsonfile   from 'jsonfile';
import del        from 'node-delete';
import moment     from 'moment';
import fs         from 'fs';
import md5        from 'md5';
import path       from 'path';
import JSON       from 'json3';

import FileError  from '../errors/FileError';
import {
    MIMETYPES
} from '../consts';

class FileManager {
    static generateFilename(filename) {
        const extname = path.extname(filename);
        const hash    = this.generateHash(filename);
        return { hash, extname };
    }

    static generateHash(str) {
        const hrTime    = process.hrtime();
        const microtime = hrTime[0] * 1000000 + hrTime[1] / 1000;

        return md5(moment.utc() + str + microtime);
    }

    static saveFile({ type, file, content }) {
        return new Promise((resolve, reject) => {
            if (type === 'json') {
                return jsonfile.writeFile(file, content, { spaces: 2 }, error => {
                    if (error) { return reject(error); }
                    return resolve();
                });
            }
            return reject();
        });
    }

    static readFile(filename) {
        return new Promise((resolve, reject) => {
            return fs.readFile(filename, (error, contents) => {
                if (error) { return reject(error); }
                return resolve(contents);
            });
        });
    }

    static fileExists(file) {
        return new Promise((resolve, reject) => {
            return fs.stat(file, function(error, stats) {
                if (!error) { return resolve(true); }
                if (error.code === 'ENOENT') { return resolve(false); }
                return reject(error);
            });
        });
    }

    static async appendJSON(file, record) {
        let prevContent;
        try {
            prevContent = await this.readFile(file);
        } catch (error) {
            throw new FileError('Can not get file content.', { type: 'AppendJSON', reason: error });
        }

        let contents;
        try {
            contents = JSON.parse(prevContent);
            contents.push(record);
        } catch (error) {
            throw new FileError('Invalid JSON.', { type: 'AppendJSON', reason: error });
        }
        try {
            await this.saveFile({
                file,
                type:    'json',
                content: contents
            });
        } catch (error) {
            throw new FileError('Can not save file.', { type: 'AppendJSON', reason: error });
        }
    }

    static createDir(dir) {
        return new Promise((resolve, reject) => {
            return mkdirp(dir, error => {
                if (error) { return reject(error); }
                return resolve();
            });
        });
    }

    static async deleteFiles(files = []) {
        try {
            return await del(files, { force: true });
        } catch (error) {
            throw error;
        }
    }

    static uploader() {
        const multerConfig = {
            storage: multer.memoryStorage(),
            fileFilter(req, { originalname, mimetype }, cb) {
                if (!originalname) {
                    return cb(new FileError('Invalid file.', {
                        type: 'FileUpload'
                    }));
                }
                if (MIMETYPES.images.includes(mimetype)) { return cb(null, true); }

                return cb(new FileError(`File ${originalname} invalid by mimetype.`, {
                    type: 'FileUpload'
                }));
            }
        };
        return multer(multerConfig);
    }
}

export default FileManager;

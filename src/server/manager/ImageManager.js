import gm          from 'gm';
import fs          from 'fs';

import Image       from '../models/Image';
import ImageError  from '../errors/ImageError';
import FileManager from './FileManager';
import {
    UPLOADS_DIR,
    MAX_IMAGE_SIZE,
    CROPSIZES
} from '../consts';

class ImageManager extends FileManager {
    static async saveImage({ originalname, buffer, size }) {
        const name   = this.generateFilename(originalname);
        const folder = this.generateHash(originalname);

        if (!(size && size <= MAX_IMAGE_SIZE)) {
            throw new ImageError(`Imagesize is out of range: must be > 0B and < ${MAX_IMAGE_SIZE}B.`,
                { type: 'ImageSaveError' }
            );
        }

        try {
            await this.createDir(`${UPLOADS_DIR}/${folder}`);
        } catch (reason) {
            throw new ImageError('Can not create image directory.', { type: 'ImageSaveError', reason });
        }

        let dimensions;
        try {
            dimensions = await this.getImageDimensions(buffer);
        } catch (reason) {
            throw new ImageError('Can not get image dimensions', { type: 'ImageSaveError', reason });
        }

        await this.saveImagesPack({ folder, dimensions, buffer, name });
        buffer = null;

        let imageId;
        try {
            imageId = await this.saveImageToDB({ folder, dimensions, name });
        } catch (reason) {
            const errors = ['Can not save image record to DB.'];
            let extendedInfo;
            try {
                await this.deleteFiles([`${UPLOADS_DIR}/${folder}`]);
            } catch (error) {
                extendedInfo = error;
                errors.push('Can not delete image caused error.');
            }

            throw new ImageError(errors.join(', '), { type: 'ImageSaveError', reason, extendedInfo });
        }

        return imageId;
    }

    static async saveImagesPack({ name, folder, dimensions, buffer }) {
        try {
            await Promise.all([
                this.saveOriginalImage({ buffer, folder, name }),
                ...this.cropImagePromises({ name, folder, dimensions, buffer })
            ]);
            buffer = null;
        } catch (error) {
            throw new ImageError('Can not save image.',
                { type: 'ImageSaveError', reason: error }
            );
        }
    }

    static saveOriginalImage({ buffer, folder, name }) {
        const type    = 'original';
        const dstPath = this._generateTypedImageFile({ type, name, folder });
        return this.saveImageToFS({ buffer, dstPath });
    }

    static cropImage({ folder, name, dimensions, type, buffer }) {
        return new Promise(async (resolve, reject) => {
            if (this._isSmallImage(type, dimensions)) {
                buffer = null;
                return resolve();
            }

            const dstPath = this._generateTypedImageFile({ folder, name, type });
            const [width, height] = CROPSIZES[type];

            return gm(buffer)
                .autoOrient()
                .strip()
                .quality(80)
                .resize(width, height, '^')
                .gravity('Center')
                .crop(width, height)
                .compress('Zip')
                .write(dstPath, error => {
                    if (error) { return reject(error); }
                    buffer = null;
                    return resolve();
                });
        });
    }

    static cropImagePromises({ name, folder, dimensions, buffer }) {
        return Object.keys(CROPSIZES).map(type => this.cropImage({ name, folder, dimensions, buffer, type }));
    }

    static getImageDimensions(buffer) {
        return new Promise(async (resolve, reject) => {
            return gm(buffer)
                .size((error, size) => {
                    buffer = null;
                    if (error) { return reject(error); }
                    return resolve(size);
                });
        });
    }

    static async saveImageToDB({ name, folder, dimensions }) {
        const extname = name.extname;
        name = name.hash;
        const types = Object.keys(CROPSIZES).reduce((acc, size) => {
            if (!this._isSmallImage(size, dimensions)) { acc.push(size); }
            return acc;
        }, ['original']);

        try {
            const image = new Image({ name, folder, extname, types });
            await image.save();
            return image._id;
        } catch (error) {
            throw error;
        }
    }

    static saveImageToFS({ buffer, dstPath }) {
        return new Promise((resolve, reject) => {
            fs.writeFile(dstPath, buffer, 'binary', error => {
                buffer = null;
                if (error) { return reject(error); }
                return resolve();
            });
        });
    }

    static _generateTypedImageFile({ folder, type, name }) {
        return `${UPLOADS_DIR}/${folder}/${type}_${name.hash}${name.extname}`;
    }

    static _isSmallImage(cropSize, { width, height }) {
        return width < CROPSIZES[cropSize][0] || height < CROPSIZES[cropSize][1];
    }
}

export default ImageManager;

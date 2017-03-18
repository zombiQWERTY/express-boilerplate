import ApplicationError from './ApplicationError';

class ImageError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'Image.init';
    }
}

export default ImageError;

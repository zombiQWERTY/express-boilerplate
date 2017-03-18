import ApplicationError from './ApplicationError';

class FileError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'File.init';
    }
}

export default FileError;

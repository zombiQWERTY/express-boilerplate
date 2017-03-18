import ApplicationError from './ApplicationError';

class PasswordError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'Password.init';
    }
}

export default PasswordError;

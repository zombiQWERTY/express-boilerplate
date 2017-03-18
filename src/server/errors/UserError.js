import ApplicationError from './ApplicationError';

class UserError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'User.init';
    }
}

export default UserError;

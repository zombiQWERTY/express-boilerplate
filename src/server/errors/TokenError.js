import ApplicationError from './ApplicationError';

class TokenError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'Token.init';
    }
}

export default TokenError;

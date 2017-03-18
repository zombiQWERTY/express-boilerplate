import ApplicationError from './ApplicationError';

class ResponseError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'Response.init';
    }
}

export default ResponseError;

import ApplicationError from './ApplicationError';

class LogError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'Log.init';
    }
}

export default LogError;

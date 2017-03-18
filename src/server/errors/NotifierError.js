import ApplicationError from './ApplicationError';

class NotifierError extends ApplicationError {
    constructor(message, params = {}) {
        super(message, params);

        this.type = params.type || 'Notifier.init';
    }
}

export default NotifierError;

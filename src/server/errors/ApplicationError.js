import winston from '../utils/logger';

const logger = winston.loggers.get('generic');

class ApplicationError extends Error {
    constructor(message, params = {}) {
        super(message, params);

        const defaultParams = {
            name:         'App',
            type:         'App.init',
            message:      'An error occurred.',
            detail:       '',
            extendedInfo: '',
            reason:       {},
            status:       400
        };

        params.message = message;
        params.name    = this.constructor.name;

        if (params.reason instanceof Error) {
            try {
                params.reason = JSON.stringify(params.reason);
            } catch (error) {
                throw new ApplicationError('Could not stringify reason object.', { type: 'AppError' });
            }
        }

        Object.assign(this, defaultParams, params);
        Error.captureStackTrace(this, this.constructor);

        this.log();
    }

    log() {
        logger.error(this);
    }
}

export default ApplicationError;

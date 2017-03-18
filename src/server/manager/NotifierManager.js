import Send          from './notifierUtils/SendMethods';
import NotifierError from '../errors/NotifierError';

class Notifier {
    constructor(params = {}) {
        this.params = params;
    }

    set params(params) {
        this.method          = params.method          || null;
        this.receiver        = params.receiver        || '';
        this.receiverNumbers = params.receiverNumbers || null;
        this.subject         = params.subject         || 'New message';
        this.message         = params.message         || '';
        this.isHTML          = params.isHTML          || true;
    }

    async send() {
        try {
            if (this.method === 'email') {
                return await Send.email(this.receiver, this.subject, this.message, this.isHTML);
            }
            if (this.method === 'sms') {
                return await Send.sms(this.receiverNumbers, this.message);
            }
            if (this.method === 'both') {
                return await Promise.all([
                    Send.sms(this.receiverNumbers, this.message),
                    Send.email(this.receiver, this.subject, this.message, this.isHTML)
                ]);
            }
        } catch (reason) {
            throw new NotifierError('Can not send notification.', { type: 'SendNotification', reason });
        }
    }
}

export default Notifier;

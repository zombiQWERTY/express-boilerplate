import nodemailer      from 'nodemailer';
import smtpTransport   from 'nodemailer-smtp-transport';

import NotifierError   from '../../errors/NotifierError';
import { SMTP_CONFIG } from '../../consts';

class Send {
    static async email(to, subject, message, isHTML) {
        if (Array.isArray(to)) { to = to.join(', '); }
        try {
            await this.transporter().verify();
        } catch (reason) {
            throw new NotifierError('Invalid SMTP transporter config.', { type: 'SendEmail', reason });
        }

        const from = '"Admin" <admin@productiondomain.com>';
        const mailOptions = { from, to, subject };

        mailOptions[isHTML ? 'html' : 'text'] = message;

        let result;
        try {
            result = await this.transporter().sendMail(mailOptions);
        } catch (reason) {
            throw new NotifierError('Cen not send email.', { type: 'SendEmail', reason });
        }
        return result;
    }

    static sms(to, text) {
        return { success: true, message: 'gag' };
    }

    static transporter() {
        return nodemailer.createTransport(smtpTransport(SMTP_CONFIG));
    }
}

export default Send;

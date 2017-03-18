import mongoose               from 'mongoose-fill';

import UserModel              from '../models/User';
import NotifierManager        from '../manager/NotifierManager';
import TokenManager           from '../manager/TokenManager';
import UserManager            from '../manager/UserManager';
import PasswordError          from '../errors/PasswordError';
import tokenTypes             from '../enums/tokenType';
import { hashPasswordBySalt } from './passwordUtils';

const ObjectId = mongoose.Types.ObjectId;

class PasswordManager {
    static async sendRestoreLink(email) {
        if (!email) { throw new PasswordError('Email is not provided.', { type: 'CheckEmailExists' }); }

        email = email.toLowerCase();
        let userId;
        try {
            userId = await UserManager.getUserModelByEmail(email);
        } catch (reason) {
            throw new PasswordError('Can not check if email exists.', { type: 'CheckEmailExists', reason });
        }

        let token = await this.generateRestoreToken(userId);
        token = TokenManager.splitToken(token);

        const Notifier = new NotifierManager({
            method:   'email',
            receiver: email,
            subject:  'Reset password',
            message:  'Message with token-link. ' + token
        });

        try {
            await Notifier.send();
        } catch (reason) {
            throw new PasswordError('Can not send email.', { type: 'CheckEmailExists', reason });
        }

        return token;
    }

    static async generateRestoreToken(userId) {
        let token;
        try {
            token = await TokenManager.provideToken(userId, tokenTypes.PASSWORD_RESET);
        } catch (reason) {
            throw new PasswordError('Can not send email.', { type: 'CheckEmailExists', reason });
        }

        return token;
    }

    static async saveNewPassword(userId, password) {
        if (!ObjectId.isValid(userId)) { throw new PasswordError('Invalid user id.', { type: 'saveNewPassword' }); }
        if (!password) { throw new PasswordError('New password is not provided.', { type: 'saveNewPassword' }); }

        let user;
        try {
            user = await UserManager.getUserModelById(userId);
        } catch (reason) {
            throw new PasswordError('Can not find user.', { type: 'saveNewPassword', reason });
        }

        try {
            await this._setPassword(user, password);
        } catch (reason) {
            throw new PasswordError('Can not set new password.', { type: 'saveNewPassword', reason });
        }

    }

    static async checkOldPassword(userId, oldPassword) {
        if (!ObjectId.isValid(userId)) { throw new PasswordError('Invalid user id.', { type: 'checkOldPassword' }); }
        if (!oldPassword) { throw new PasswordError('Old password is not provided.', { type: 'checkOldPassword' }); }

        let user;
        try {
            user = await UserModel.findById(userId).select('password salt').exec();
        } catch (reason) {
            throw new PasswordError('Can not find user.', { type: 'checkOldPassword', reason });
        }

        try {
            await this._comparePasswords(user, oldPassword);
        } catch (reason) {
            throw reason;
        }
    }

    static async _comparePasswords(userModel, oldPassword) {
        let hashedPassword;
        try {
            hashedPassword = await hashPasswordBySalt(oldPassword, userModel.salt);
        } catch (reason) {
            throw new PasswordError('Can not hash password.', { type: 'comparePasswords', reason });
        }

        if (userModel.password !== hashedPassword) {
            throw new PasswordError('Incorrect old password.', { type: 'comparePasswords' });
        }
    }

    static _setPassword(userModel, password) {
        return new Promise((resolve, reject) => {
            if (!UserManager.validatePassword(password)) {
                return reject(new PasswordError('Invalid password format.', { type: 'setPassword' }));
            }

            return userModel.setPassword(password, async (reason, user) => {
                if (reason) { return reject(reason); }

                try {
                    await user.save();
                } catch (reason) {
                    return reject(new PasswordError('Can not save new password.', { type: 'setPassword', reason }));
                }

                return resolve();
            });
        });
    }
}

export default PasswordManager;

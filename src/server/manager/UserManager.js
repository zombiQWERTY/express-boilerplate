import mongoose         from 'mongoose-fill';
import passportLocal    from 'passport-local-mongoose';
import ValidationError  from 'mongoose/lib/error/validation';
import _forEach         from 'lodash/forEach';
import _includes        from 'lodash/includes';
import moment           from 'moment';

import UserModel        from '../models/User';
import winston          from '../utils/logger';
import UserError        from '../errors/UserError';

import {
    date as dateConfig
} from '../consts';

const logger = winston.loggers.get('generic');
const AuthenticationError = passportLocal.errors.AuthenticationError;

class UserManager {
    static validatePassword(value = '') {
        return /^[a-zA-Z0-9]{6,}$/.test(value);
    }

    static validateBirthdate(value) {
        return dateConfig.regexp.test(value) && moment().diff(moment(value, 'DD/MM/YYYY'), 'years') >= 18;
    }

    static prepareBirthdate(formValue) {
        if (formValue.includes('-')) { formValue = formValue.split('-').reverse().join('/'); }
        return this.validateBirthdate(formValue) ? moment(formValue, dateConfig.pattern).utc() : null;
    }

    static async prepareModel(formData) {
        // All thrown errors will be processed in the "register" method
        formData.birthdate = this.prepareBirthdate(formData.birthdate);
        formData.isMale    = formData.sex === 'male';
        const user = new UserModel(formData);

        await user.validate();
        return user;
    }

    static async register(formData) {
        const save = user => {
            return new Promise((resolve, reject) => {
                UserModel.register(user, user.password, (error, user) => {
                    if (error) { return reject(error); }
                    resolve(user);
                });
            });
        };

        let user;
        try {
            user = await this.prepareModel(formData);
            if (!this.validatePassword(user.password)) {
                throw new UserError('Can\'t register user.', {
                    type: 'register',
                    detail: [{
                        type:    'password',
                        message: 'Invalid format'
                    }]
                });
            }

            await save(user);
        } catch (e) {
            if (e instanceof ValidationError) {
                throw new UserError('Can\'t register user.', {
                    type:  'register',
                    detail: this.validationErrorsMapper(e)
                });
            } else if (e instanceof AuthenticationError) {
                throw new UserError(e.message, {
                    type: 'register'
                });
            } else {
                throw e;
            }
        }

        return user;
    }

    static async update(user, formData) {
        const availableFields = ['name', 'about', 'birthdate', 'lastName', 'phone', 'avatar'];

        function isAvailableField(fieldName) {
            return _includes(availableFields, fieldName);
        }

        // TODO refactor this if else hell
        for (let key in formData) {
            if (!isAvailableField(key)) {
                // just ignore an attempt
                logger.warn(
                    `User "${user.id}" tried to update the "${key}" field.`,
                    `An attempt has been ignored.`,
                    `Reason: field isn't exist or readonly.`
                );
            } else {
                if (key === 'birthdate') {
                    let birthdate = formData[key];
                    user.birthdate = this.prepareBirthdate(birthdate);
                } else {
                    if (typeof formData[key] !== 'undefined' && user[key] !== formData[key]) {
                        user[key] = formData[key];
                    }
                }
            }
        }

        try {
            await user.validate();
        } catch (e) {
            throw new UserError(e.message, {
                type: 'update',
                detail: this.validationErrorsMapper(e)
            });
        }

        try {
            await user.save();
        } catch (reason) {
            throw new UserError('Can not save user.', { type: 'update', reason });
        }

        try {
            user = await this.getUserModelById(user.id);
        } catch (reason) {
            throw new UserError('Can not get new user info.', { type: 'update', reason });
        }

        return user;
    }

    static async deleteImage(user, purpose, id) {
        switch (purpose) {
            case 'avatar':
                if (!user.avatar) { throw new UserError('User does not have avatar', { type: 'deleteImage' }); }
                user.avatar = null;
                break;

            case 'gallery':
                user.images = user.images.reduce((acc, image) => {
                    if (image.id !== id) { acc.push(image.id); }
                    return acc;
                }, []);
                break;
            default:
                throw new UserError('Invalid image purpose.', { type: 'deleteImage' });
        }

        try {
            await user.save();
        } catch (e) {
            if (e instanceof UserError) {
                throw e;
            } else {
                throw new UserError(e.message, {
                    type:   'deleteImage',
                    detail: this.validationErrorsMapper(e)
                });
            }
        }
    }

    static validationErrorsMapper(items) {
        const errors = [];
        _forEach(items.errors, item => {
            errors.push({
                type:    item.path,
                message: item.message
            });
        });
        return errors;
    }

    static async getUserModelById(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new UserError('Invalid userId', { type: 'getUserModelById' });
        }

        let user;
        try {
            user = await UserModel
                .findById(userId)
                .select('-updatedAt -createdAt')
                .populate('avatar', '-updatedAt -createdAt')
                .exec();
        } catch (reason) {
            throw new UserError('User model find error.', { type: 'getUserModelById', reason });
        }

        if (!user) { throw new UserError('User model not found.', { type: 'UserFindError' }); }
        return user;
    }

    static async getUserModelByEmail(email) {
        if (!email) { throw new UserError('Invalid email.', { type: 'getUserModelById' }); }

        let user;
        try {
            user = await UserModel
                .findOne({ email })
                .select('id')
                .exec();
        } catch (reason) {
            throw new UserError('User model find error.', { type: 'getUserModelByEmail', reason });
        }

        if (!user) { throw new UserError('User model not found.', { type: 'UserFindError' }); }
        return user;
    }

    static async getUserModelByUsername(username) {
        if (!username) { throw new UserError('Invalid username.', { type: 'getUserModelByUsername' }); }

        let user;
        try {
            user = await UserModel
                .findOne({ username })
                .select('id')
                .exec();
        } catch (reason) {
            throw new UserError('User model find error.', { type: 'getUserModelByEmail', reason });
        }

        if (!user) { throw new UserError('User model not found.', { type: 'UserFindError' }); }
        return user;
    }

    static isValidUser(user) {
        return user instanceof UserModel;
    }

    static async isUserOnline(userId) {
        try {
            return !!(await UserModel.findById(userId).exec());
        } catch (error) {
            return false;
        }
    }

    static async setUserOnline(userId) {
        try {
            await UserModel.update(
                { _id:        userId },
                { lastAccess: moment.utc() },
                { multi:      false }
            );
        } catch (reason) {
            throw new UserError('Can not set user online.', { type: 'SetUserOnline', reason });
        }
    }
}

export default UserManager;

import mongoose              from 'mongoose-fill';
import passportLocalMongoose from 'passport-local-mongoose';
import moment                from 'moment';

import { modelCleaner }      from '../db/utils';
import { ROLES,
    ONLINE_OFFSET, PBKDF2 }  from '../consts';

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    email: {
        type:      String,
        lowercase: true,
        trim:      true,
        unique:    true,
        required:  [true, 'Email missing or invalid.'],
        validate: {
            validator(v) {
                return /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,8}$/.test(v);
            },
            message: '"{VALUE}" is not a valid email!'
        }
    },
    lastAccess: {
        type:    Date,
        default: moment.utc()
    },
    lastLogin: {
        type: Date
    },
    password: {
        type:     String,
        trim:     true,
        required: [true, 'Password missing or invalid.']
    },
    salt: {
        type:     String,
        trim:     true,
        required: true
    },
    isMale: {
        type:     Boolean,
        required: true
    },
    about: {
        type:    String,
        trim:    true,
        default: ''
    },
    birthdate: {
        type:     Date,
        required: [true, 'Birthdate missing or invalid ("{VALUE}").']
    },
    name: {
        type:     String,
        trim:     true,
        required: [true, 'Name missing or invalid.']
    },
    lastName: {
        type:    String,
        trim:    true,
        default: ''
    },
    phone: {
        type:    String,
        default: ''
    },
    role: {
        type:    String,
        trim:    true,
        default: ROLES.USER
    },
    avatar: {
        type:    ObjectId,
        ref:     'Image',
        default: null
    }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField:     'email',
    salten:            PBKDF2.salten,
    iterations:        PBKDF2.iterations,
    keylen:            PBKDF2.keylen,
    digestAlgorithm:   PBKDF2.digestAlgorithm,
    encoding:          PBKDF2.encoding,
    saltField:         'salt',
    hashField:         'password',
    lastLoginField:    'lastLogin',
    usernameLowerCase: true,
    populateFields:    'avatar'
});

UserSchema.pre('save', function(next) {
    this.lastAccess = moment.utc();
    next();
});

UserSchema.virtual('isOnline').get(function () {
    return moment(this.lastAccess) > moment.utc().add(-1 * ONLINE_OFFSET, 'minutes');
});
UserSchema.virtual('age').get(function () {
    return moment().diff(this.birthdate, 'years');
});

modelCleaner(UserSchema);
export default mongoose.model('User', UserSchema);

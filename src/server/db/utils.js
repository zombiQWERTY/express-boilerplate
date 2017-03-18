import autoIncrement from 'mongoose-auto-increment';

const mongooseHidden    = require('mongoose-hidden')();
const deepPopulate      = require('mongoose-deep-populate');

export const modelCleaner = Schema => {
    Schema.set('toJSON', {
        virtuals: true,
        transform(doc, ret) {
            delete ret.__v;
            delete ret.password;
            delete ret.salt;
            if (ret.avatar) {
                delete ret.avatar.extname;
                delete ret.avatar.folder;
                delete ret.avatar.name;
                delete ret.avatar.types;
            }

            return ret;
        }
    });
    Schema.set('toObject', {
        virtuals: true,
        transform(doc, ret) {
            delete ret.__v;
            if (ret.avatar) {
                delete ret.avatar.extname;
                delete ret.avatar.folder;
                delete ret.avatar.name;
                delete ret.avatar.types;
            }

            return ret;
        }
    });
    Schema.plugin(mongooseHidden);
};

export const enableDeepPopulate = (Schema, mongoose) => {
    Schema.plugin(deepPopulate(mongoose));
};

export const enableAutoIncrement = (Schema, mongoose, config) => {
    autoIncrement.initialize(mongoose.connection);
    Schema.plugin(autoIncrement.plugin, config);
};

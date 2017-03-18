import mongoose         from 'mongoose-fill';
import _values          from 'lodash/values';

import { modelCleaner } from '../db/utils';
import enums            from '../enums';

const TokenTypes = _values(enums.tokenType);
const ObjectId   = mongoose.Schema.Types.ObjectId;

const TokenSchema = new mongoose.Schema({
    user: {
        type:     ObjectId,
        ref:      'User',
        required: true
    },
    token: {
        type:     String,
        required: true
    },
    fingerprint: {
        type:     String
    },
    active: {
        type:     Boolean,
        required: true,
        default:  true
    },
    type: {
        type:     String,
        enum:     TokenTypes,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

modelCleaner(TokenSchema);
export default mongoose.model('Token', TokenSchema);

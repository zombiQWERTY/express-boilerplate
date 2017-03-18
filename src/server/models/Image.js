import mongoose         from 'mongoose-fill';

import { modelCleaner } from '../db/utils';
import { BASE_URI }     from '../consts';
import {
    UPLOADS,
    CROPSIZES
} from '../consts';

const ObjectId = mongoose.Schema.Types.ObjectId;

const types = Object.keys(CROPSIZES);

const ImageSchema = new mongoose.Schema({
    name: {
        type:      String,
        trim:      true,
        required: [true, 'missing or invalid.']
    },
    folder: {
        type:      String,
        trim:      true,
        required: [true, 'missing or invalid.']
    },
    extname: {
        type:      String,
        trim:      true,
        required: [true, 'missing or invalid.']
    },
    types: {
        type:     [String],
        enum:     types,
        required: [true, 'missing or invalid.']
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

ImageSchema.virtual('urls').get(function () {
    const obj = {};

    let allTypes       = ['original', ...Object.keys(CROPSIZES)];
    let lastValidIndex = null;

    allTypes.map((type, index) => {
        if (this.types.indexOf(type) + 1) { lastValidIndex = index; }
        obj[type] = `${BASE_URI}/${UPLOADS}/${this.folder}/${allTypes[lastValidIndex]}_${this.name}${this.extname}`;
    });
    return obj;
});

modelCleaner(ImageSchema);
export default mongoose.model('Image', ImageSchema);

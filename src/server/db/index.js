import mongoose from 'mongoose';

export function connectDatabase(uri) {
    return new Promise((resolve, reject) => {
        mongoose.Promise = Promise;
        mongoose.connect(uri);
        mongoose.connection
            .on('error', error => reject(error))
            .on('close',  ()   => console.log('Database connection closed.'))
            .once('open', ()   => resolve(mongoose.connections[0]));
    });
}

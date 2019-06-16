const mongoose = require('mongoose');
const config = require('../config');
const sanitizerPlugin = require('mongoose-sanitizer');

mongoose.plugin(sanitizerPlugin);
mongoose.Promise = Promise;

const db = mongoose.connection;

// CONNECTION EVENTS
// When successfully connected

db.on('connecting',
    () => console.log('Mongoose connecting open to ' + config.database.uri)
);

// If the connection throws an error
db.on('error',
    err => {
        console.error('Mongoose connection error: ' + err);
        db.removeAllListeners();
    }
);

// When the connection is disconnected
db.on('disconnected',
    () => {
        console.warn('Mongoose connection disconnected');
        db.removeAllListeners();
    }
);

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.warn('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


mongoose.connection.openUri(config.database.uri, {useMongoClient: true}, function(err, db) {
    if (err) {
        console.error('Unable to connect to the server. Please start the server. Error: ' + err);
    } else {
        console.log('Connected to DB successfully! URL: ' + config.database.uri);
    }
});

module.exports = mongoose;

// ================
// PORT
// ================

process.env.PORT = process.env.PORT || 3000;

// ================
// Enviroment
// ================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// Database
// ================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ================
// authentication SEED
// ================

process.env.SEED = process.env.SEED || 'development-seed';

// ================
// Google client ID
// ================

process.env.CLIENT_ID = process.env.CLIENT_ID || '892678547391-0n34dnb76sh74chunjtqrba5285pp8u4.apps.googleusercontent.com';

// ================
// Token expiration
// ================
// 60 sec
// 60 min
// 24 hrs
// 30 days

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;
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
    urlDB = 'mongodb://coffee-user:A123456@ds257564.mlab.com:57564/coffee';
}

process.env.URLDB = urlDB;
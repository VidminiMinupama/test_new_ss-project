// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yourUsername:yourPassword@yourCluster.mongodb.net/music_website_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;

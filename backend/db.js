// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://vidmini_minupama:9pGiTN8UMNssQUBt@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/musicWebsite?ssl=true&replicaSet=atlas-1lvzx6-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;

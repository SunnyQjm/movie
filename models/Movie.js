const db = require('../db');

const Movie = db.defineModel('movies', {
    movieName: {type: db.STRING(500), defaultValue: ''},
    translationName: {type: db.STRING(500), defaultValue: ''},
    releaseTime: {type: db.STRING(500), defaultValue: ''},
    producePlace: {type: db.STRING(500), defaultValue: ''},
    subtitle: {type: db.STRING(500), defaultValue: ''},
    category: {type: db.STRING(500), defaultValue: ''},
    introduction: {type: db.STRING(2000), defaultValue: ''},
    cover: {type: db.STRING(500), defaultValue: ''},
    magnet: {type: db.STRING(500), defaultValue: ''},
    isDownload: {
        type: db.BOOLEAN,
        defaultValue: 0,
    },
    size: {
        type: db.BIGINT,
        defaultValue: 0
    },
    downloadPath: {type: db.STRING(200), defaultValue: ''},
    originUrl: {
        type: db.STRING(200),
        unique: true,
        defaultValue: ''
    },
    failedTime: {
        type: db.INTEGER,
        defaultValue: 0
    }
});
Movie.sync({ alter: true });
module.exports = Movie;
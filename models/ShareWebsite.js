const db = require('../db');

const ShareWebsite = db.defineModel("share_website", {
    title: {
        type: db.STRING(100),
        defaultValue: '',
    },
    website: {
        type: db.STRING(200),
        defaultValue: '',
        unique: true,
    },
    description: {
        type: db.STRING(1000),
        defaultValue: '',
    },
    cover: {
        type: db.STRING(200),
        defaultValue: '',
    }
});

module.exports = ShareWebsite;
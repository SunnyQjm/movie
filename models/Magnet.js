const db = require('../db');

const Magnet = db.defineModel('magnets', {
    magnet: {
        type: db.STRING(500),
        defaultValue: '',
    }
});

module.exports = Magnet;
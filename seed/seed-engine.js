const WebTorrent = require('webtorrent'),
    thunky = require('thunky');
const {
    getRedisClient
} = require('../tools/redis-client');
const {
    getMd5
} = require('../tools/md5');

let getClient = thunky(cb => {
    cb(new WebTorrent());
});

getClient(client => {
    client.on('error', err => {
        console.log(err);
    });
});

function seedFiles(path) {
    return new Promise((resolve, reject) => {
        getMd5(path)
            .then(md5 => {
                getClient(client => {
                    client.seed(path, {
                        announce: [
                            'http://210.30.100.171:8000/announce',
                            'udp://0.0.0.0:8000',
                            'udp://210.30.100.171:8000',
                            'ws://210.30.100.171:8000',
                        ]
                    }, torrent => {
                        getRedisClient(redisClient => {
                            redisClient.set(md5, torrent.magnetURI, () => {
                                console.log('set finish')
                            });
                        });
                        if (resolve)
                            resolve(torrent, md5);
                    })
                });
            })
            .catch(reject);

    });
}

module.exports = seedFiles;

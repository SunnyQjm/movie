const WebTorrent = require('webtorrent'),
    thunky = require('thunky');

let getClient = thunky(cb => {
   cb(new WebTorrent());
});

function seedFiles(path, cb){
    getClient(client => {
        client.seed(path, {
            // announce: [
            //     'http://210.30.100.171:8000/announce',
            //     'udp://0.0.0.0:8000',
            //     'udp://210.30.100.171:8000',
            //     'ws://210.30.100.171:8000',
            // ]
            announce: [
                'http://localhost:8000/announce',
                'udp://0.0.0.0:8000',
                'udp://localhost.171:8000',
                'ws://localhost.171:8000',
            ]
        }, torrent => {
            console.log(torrent.magnetURI);
            if(cb)
                cb(torrent);
        })
    })
}

module.exports = seedFiles;

const WebTorrent = require('webtorrent');

let client = new WebTorrent();

client.add('38e7f1aa6e079f03fafa7f406ffa1e1bbf0cdee0', {
    announce: [
        'http://210.30.100.171:8000/announce',
        'udp://0.0.0.0:8000',
        'udp://210.30.100.171:8000',
        'ws://210.30.100.171:8000',
    ]
},torrent => {
    console.log(torrent.magnetURI);
    torrent.on('download', bytes => { //Emitted whenever data is downloaded. Useful for reporting the current torrent status, for instance:
        console.log('DOWNLOAD');
    });

    torrent.on('done', () => {
        console.log('done');
    });

    torrent.on('error', () => {
        console.log('error');
    })
});
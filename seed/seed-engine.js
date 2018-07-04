const WebTorrent = require('webtorrent');

let client = new WebTorrent();

//D:\WebstormProj\movie\static\uploads\1530613859089.mp4
client.seed('../static/uploads/1530613859089.mp4', {
    announce: [
        'http://210.30.100.171:8000/announce',
        'udp://0.0.0.0:8000',
        'udp://210.30.100.171:8000',
        'ws://210.30.100.171:8000',
    ]
}, torrent => {
    console.log(torrent.magnetURI);
    console.log(torrent.infoHash);
});
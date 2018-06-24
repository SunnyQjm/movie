const WebTorrent = require('webtorrent');
const path = require('path');
const model = require('../model');
const async = require('async');


String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

let Movie = model.Movie;
let client = new WebTorrent();

let savePath = path.join(__dirname, 'static');

function download(movie) {
    let magnet = movie.magnet;
    if(magnet.trim() === '' || !magnet.startsWith('magnet'))
        return;
    console.log('add download: ' + magnet);
    client.add(magnet, {
        path: savePath,       //设置下载文件的路径
    }, torrent => {      //called when this torrent is ready to be used.   ==> equal to    client.on('torrent', callback);

        torrent.on('download', bytes => { //Emitted whenever data is downloaded. Useful for reporting the current torrent status, for instance:
            console.log('download speed: ' + (torrent.downloadSpeed / 1024) + ' KB/s');
            console.log('progress: ' + (torrent.progress * 100));
        });

        torrent.on('error',  err => {
           console.log('download error: ' + err);
        });
        torrent.on('done', function () {
            console.log('torrent finished downloading');
            let file = torrent.files.find(file => {
                return file.name.endsWith('.mp4') || file.name.endsWith('.rmvb');
            });
            //下载完成则将其标识为已下载
            Movie.update({
                isDownload: 1,
                size: file.length,
                downloadPath: path.join(savePath, file.path),
            }, {
                where: {
                    id: movie.id
                }
            });
        })
    });
}


/**
 * Emitted when the client encounters a fatal error. The client is automatically destroyed and all torrents are removed and cleaned up when this occurs.
 * Always listen for the 'error' event.
 */
client.on('error', err => {

});


Movie.findAndCountAll({
    where: {
        isDownload: 0,
        magnet: {
            $like: 'magnet%'
        }
    },
    limit: 50,
})
    .then(result => {
        result.rows.forEach(movie => {
            download(movie);
        });
    });

//
// download({
//     magnet: 'magnet:?xt=urn:btih:88594aaacbde40ef3e2510c47374ec0aa396c08e&dn=bbb_sunflower_1080p_30fps_normal.mp4&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=http%3A%2F%2Fdistribution.bbb3d.renderfarming.net%2Fvideo%2Fmp4%2Fbbb_sunflower_1080p_30fps_normal.mp4'
// });
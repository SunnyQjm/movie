const WebTorrent = require('webtorrent');
const path = require('path');
const model = require('../model');
const schedule = require('node-schedule');        //用户开启定时任务


String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

let Movie = model.Movie;
let client = new WebTorrent();

let savePath = path.join(__dirname, 'static');

/**
 * 下载movie对象中的磁力链接，并且在下载完成后将isDownload标志位置1，并写回数据库
 * @param movie
 * @param client
 */
function download(movie, client) {
    let magnet = movie.magnet;
    if (magnet.trim() === '' || !magnet.startsWith('magnet'))
        return;
    console.log('add download: ' + magnet);
    client.add(magnet, {
        path: savePath,       //设置下载文件的路径
    }, torrent => {      //called when this torrent is ready to be used.   ==> equal to    client.on('torrent', callback);

        torrent.on('download', bytes => { //Emitted whenever data is downloaded. Useful for reporting the current torrent status, for instance:
        });

        torrent.on('error', err => {
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
    console.log(err);
});


function findMovieAndDownload(client) {
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
                download(movie, client);
            });
        });
}


function beginScheduleDownload() {
    console.log('begin a schedule task to download movie. (crawler per twice hour).....');
    findMovieAndDownload(client);
    let rule = new schedule.RecurrenceRule();
    rule.second = 1;
    rule.minute = 1;
    rule.hour = [0, 4, 8, 12, 16, 20];
    for (let i = 0; i <= 22; i += 2) {
        rule.hour.push(i);
    }
    schedule.scheduleJob(rule, () => {
        client.destroy(() => {
            client = new WebTorrent();
            findMovieAndDownload(client);
        })
    })
}
module.exports = {
    beginScheduleDownload,
    findMovieAndDownload,
};

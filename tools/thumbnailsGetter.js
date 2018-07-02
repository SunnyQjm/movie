const FfmpegCommand = require('fluent-ffmpeg');

const ORIGIN_PATH = 'static/uploads/';

function getScreenShot(fileName) {
    return new Promise((resolve, reject) => {
        let ffmpeg = FfmpegCommand(ORIGIN_PATH + fileName);
        let fns = [];
        ffmpeg
            .on('filenames', function (filenames) {
                fns = filenames;
            })
            .on('end', function() {
                resolve(fns);
            })
            .on('error', reject)
            .screenshots({
                timestamps: ['1%'],
                filename: fileName + '-thumbnail.png',
                folder: 'static/thumbnails',
                // size: '320x240'
            });
    });

}

module.exports = {
    getScreenShot,
};
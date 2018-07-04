const multer = require('koa-multer');
const Movie = require('../models/Movie');
const {
    getScreenShot
} = require('../tools/thumbnailsGetter');

const {
    getMd5
} = require('../tools/md5');

// const {
//     getRedisClient
// } = require('../tools/redis-client');

const seedFiles = require('../seed/seed-engine');
const fs = require("fs");
const path = require("path");

/**
 * 启动的时候，服务器开始seed服务器上现有的文件
 * @type {string}
 */
let root = path.join(__dirname, '../static/uploads/');
fs.readdir(root, (err, files) => {
    if (err) {
        console.log(err);
    } else {
        files.forEach(ele => {
            seedFiles(path.join(root, ele));
        })
    }
});

//文件上传配置
let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static/uploads/'))
    },
    //修改文件名称
    filename: function (req, file, cb) {
        //用当前时间作为文件的名字
        // let fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        // cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        cb(null, file.originalname);
    }
});

//加载配置
let upload = multer({storage: storage});

module.exports = {
    'POST /upload': [upload.single('file'), async (ctx, next) => {
        /**
         { fieldname: 'file',
          originalname: '优云面对面快传演示.mp4',
          encoding: '7bit',
          mimetype: 'video/mp4',
          destination: 'static/uploads/',
          filename: '1530536427141.mp4',
          path: 'static\\uploads\\1530536427141.mp4',
          size: 18416318 }
         */
        let file = ctx.req.file;
        if (!file) {     //上传文件错误
            ctx.easyResponse.error("上传文件错误");
        } else {
            try {
                let fns = await getScreenShot(file.filename, file.destination, 'static/thumbnails');
                let movie = await Movie.create({
                    movieName: file.originalname,
                    cover: `/upload/${fns[0]}`,
                    downloadPath: `/upload/${file.filename}`,
                    isDownload: 1
                });

                //上传成功后，返回文件的基本信息
                ctx.easyResponse.success(movie);

                seedFiles(file.path, torrent => {
                    // //将torrent.magnetURI存到Redis当中
                    // getRedisClient(client => {
                    //     client.set(movie.id, torrent.magnetURI);
                    // });

                    Movie.update({
                        magnet: torrent.magnetURI
                    }, {
                        where: {
                            id: movie.id
                        }
                    })
                });

                //给客户返回请求之后计算文件的MD5值，如果文件较大，用户无需等待。
                //MD5计算完毕后写到数据库当中
                getMd5(file.path)
                    .then(md5 => {
                        Movie.update({
                            md5: md5
                        }, {
                            where: {
                                id: movie.id
                            }
                        })
                    });
            } catch (err) {
                console.log('failed: ' + err);
                ctx.easyResponse.error(err);
            }
        }
    }],
};
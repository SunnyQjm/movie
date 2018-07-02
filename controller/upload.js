const multer = require('koa-multer');
const Movie = require('../models/Movie');
const {
    getScreenShot
} = require('../tools/thumbnailsGetter');

//文件上传
//配置
let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'static/uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        console.log(file);
        let fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//加载配置
let upload = multer({ storage: storage });

module.exports = {
    'POST /upload': [upload.single('file'), async(ctx,next)=>{
        console.log(ctx.req.file);
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
        if(!file){     //上传文件错误
            ctx.body = '上传文件错误';
        } else {
            getScreenShot(file.filename)
                .then(fns => {
                    console.log(fns);
                    Movie.create({
                        movieName: file.originalname,
                        cover: `/upload/${fns[0]}`,
                        downloadPath: `/upload/${file.filename}`,
                        isDownload: 1
                    }).then(p => {
                        console.log('created: ' + JSON.stringify(p));
                    }).catch(err => {
                        console.log('failed: ' + err);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            console.log(file);

            ctx.body = {
                filename: ctx.req.file.filename//返回文件名
            }
        }
    }],
};
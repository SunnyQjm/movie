const Koa = require('koa');
const controller = require('./controllers');
const bodyParser = require('koa-bodyparser');
const combineMiddleWare = require('./middleware');
const {
    beginScheduleCrawler
} = require('./crawler/crawler-engine');

const {
    beginScheduleDownload
} = require('./download_movie/download-engine');

const app = new Koa();

combineMiddleWare(app, __dirname);
app.use(bodyParser());
app.use(controller());

app.listen(9748);
console.log('app started at port 9748...');

/**
 * 开启定时爬虫的任务
 */
try {
    beginScheduleCrawler();
} catch (e) {
    console.log(e);
    beginScheduleCrawler();
}

try {
    beginScheduleDownload();
} catch (e) {
    console.log(e);
    beginScheduleDownload();
}
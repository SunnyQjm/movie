let superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    Movie = require('../models/Movie'),
    schedule = require('node-schedule');        //用户开启定时任务

/**
 * 引入 superagent-charset 库扩展 superagent 对象，使其支持设置编码格式
 */
require('superagent-charset')(superagent);

/**
 * String对象的扩展，使其支持 trim() 操作
 * @returns {string}
 */
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

const TRANSLATION_NAME = "译　　名";
const MOVIE_NAME = "片　　名";
const RELEASE_TIME = "上映日期";
const CATEGORY = "类　　别";
const SUBTITLE = "字　　幕";
const PRODUCE_PLACE = "产　　地";
const INTRODUCTION = "简　　介";
const DIVIDE_TAG = "◎";


/**
 * 根据爬虫得到的文字，构建一个Movie对象
 * @param initParam
 * @param textArr
 * @returns {initParam}
 */
function buildMovie(initParam, textArr) {
    let params = initParam;
    textArr.forEach(value => {
        if (value.startsWith(MOVIE_NAME)) {
            params.movieName = value.substring(MOVIE_NAME.length).trim();
        } else if (value.startsWith(TRANSLATION_NAME)) {
            params.translationName = value.substring(TRANSLATION_NAME.length).trim();
        } else if (value.startsWith(RELEASE_TIME)) {
            params.releaseTime = value.substring(RELEASE_TIME.length).trim();
        } else if (value.startsWith(PRODUCE_PLACE)) {
            params.producePlace = value.substring(PRODUCE_PLACE.length).trim();
        } else if (value.startsWith(SUBTITLE)) {
            params.subtitle = value.substring(SUBTITLE.length).trim();
        } else if (value.startsWith(CATEGORY)) {
            params.category = value.substring(CATEGORY.length).trim();
        } else if (value.startsWith(INTRODUCTION)) {
            params.introduction = value.substring(INTRODUCTION.length).trim();
        }
    });
    return Movie.create(params);
}


/**
 * 爬取电影天堂一个电影详情页的电影信息
 * @param url
 * @param charset
 */
function crawlerMovieAndSave(url, charset) {
    superagent
        .get(url)
        .charset(charset)
        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
        .end((err, res) => {
            if (!err) {
                let $ = cheerio.load(res.text);
                let zoom = $('#Zoom');
                let textArr = zoom.text().split(DIVIDE_TAG);
                let magnet = zoom
                    .find('table tbody tr td a')
                    .eq(1).prop('href');
                let cover = zoom.find('p img')
                    .first()
                    .prop('src');
                buildMovie({
                    magnet: magnet,
                    cover: cover,
                    originUrl: url,
                }, textArr)
                    .then(p => {
                        console.log('created: ' + JSON.stringify(p));
                    }).catch(err => {
                    console.log('failed: ' + err);
                });

            } else {
                console.log(err);
            }
        });
}

/**
 * 'https://www.dy2018.com/html/gndy/dyzz/index_2.html'
 * @param url
 * @param charset
 */
function crawlerAPage(url, charset) {
    superagent
        .get(url)
        .charset(charset)
        .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36')
        .set('authority', 'www.dy2018.com')
        .set('accept-language', 'zh-CN,zh;q=0.9')
        .end((err, res) => {
            if (!err) {
                let $ = cheerio.load(res.text);
                let paths = [];
                $('.ulink').each((index, link) => {
                    paths.push('http://' + res.request.host + link.attribs.href)
                });

                async.mapLimit(paths, 5, async function f(url) {
                    crawlerMovieAndSave(url, charset);
                })
            } else {
                console.log(err);
            }
        });
}

/**
 * 现在每次是爬取电影天堂两页
 */
function doCrawler() {
    let BASE_URL = 'https://www.dy2018.com/html/gndy/dyzz/';
    let urls = [BASE_URL];
    urls.push(BASE_URL + 'index_2.html');

    /**
     * 用作并发，同时爬取5个页面
     */
    async.mapLimit(urls, 5, async function f(url) {
        crawlerAPage(url, 'gb2312');
    })
}


/**
 * 开始定期爬虫任务
 * 每隔两个小时爬虫一次
 */
function beginScheduleCrawler() {
    console.log('begin a schedule task to crawler movie. (crawler per twice hour).....');
    doCrawler();
    let rule = new schedule.RecurrenceRule();
    rule.second = 1;
    rule.minute = 1;
    rule.hour = [];
    for(let i = 0; i <= 22; i += 2){
        rule.hour.push(i);
    }
    schedule.scheduleJob(rule, () => {
        doCrawler()
    });
}

module.exports = {
    beginScheduleCrawler,
    doCrawler,
    crawlerAPage,
    crawlerMovieAndSave,
};



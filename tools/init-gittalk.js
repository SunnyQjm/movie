const superagent = require('superagent');
/**
 * 引入 superagent-charset 库扩展 superagent 对象，使其支持设置编码格式
 */
require('superagent-charset')(superagent);


function createIssue(title, body, labels) {
    superagent
        .post("https://api.github.com/repos/SunnyQjm/movie_web/issues")
        .auth("SunnyQjm", "f93bd21db0c500fed3bcdb024853d4c4a0727620")
        .set('Content-Type', 'application/json')
        .send({
            "title": title,
            "body": body,
            "labels": labels
        })
        .end((err, response) => {
            if(err){
                console.log(err);
            } else {
                console.log(response)
            }
        });
}

module.exports = {
    createIssue
};

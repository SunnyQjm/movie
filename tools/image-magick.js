var fs, gm;
gm = require('gm');

gm('./qjm253.cn.png').options({
    imageMagick: true
}).resize(130, 105).write('./after.png', function(err) {
    if (err) {
        return console.error(err);
    }
    return console.log('success');
});
const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

// url: 类似 '/static/'
// dir: 类似 __dirname + '/static'
function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rPath = ctx.request.path;
        //判断是否以指定url开头
        if (rPath.startsWith(url)) {
            //获取文件的完整路径
            let fp = path.join(dir, rPath.substring(url.length));
            //判断文件是否存在
            if (await fs.exists(fp)) {
                //查找文件的mime
                ctx.response.type = mime.getType(rPath);
                //读取文件的内容并赋值给response.body
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.body = 404;
            }
        } else {
            //不是指定的前缀，处理下一个middleware
            await next();
        }
    }
}

module.exports = staticFiles;
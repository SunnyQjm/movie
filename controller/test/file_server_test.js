let
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');

let root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

function responseFile(path, response, request) {
    console.log('200 ' + request.url);
    response.writeHead(200);
    fs.createReadStream(path).pipe(response);
}

function response_404(response, request) {
    console.log('404 ' + request.url);
    response.writeHead(404);
    response.end('404 Not Found');
}

function existFile(path, existCallback, notExistCallback) {
    fs.stat(path, (err, stats) => {
        if (!err && stats.isFile())
            existCallback(path);
        else
            notExistCallback(path);
    });
}

let server = http.createServer((request, response) => {
    let pathName = url.parse(request.url).pathname;
    let filePath = path.join(root, pathName);
    //获取文件的状态
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            responseFile(filePath, response, request)
        } else if (stats.isDirectory()) {
            existFile(path.join(filePath, 'index.html'), p => {
                responseFile(p, response, request)
            }, () => {
                existFile(path.join(filePath, 'default.html'), p => {
                    responseFile(p, response, request)
                }, () => {
                    response_404(response, request);
                })
            });
        } else {
            response_404(response, request);
        }
    });
});

server.listen(9748);

console.log('Server is running at http://127.0.0.1:9748/');

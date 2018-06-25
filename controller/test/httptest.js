let http = require('http');


let server = http.createServer((request, response) => {
    console.log(request.method + ': ' + request.url);
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.end('<h1>Hello world</h1>');
});

server.listen(9748);

console.log('Server is running at http://127.0.0.1:9748/');
const nunjucks = require('nunjucks');
const model = require('../model');

let Movie = model.Movie;

nunjucks.configure('./views');

const fn_hello = async (ctx) => {
    const name = ctx.params.name;
    console.log('path: ' + ctx.request.path);
    console.log('url: ' + ctx.request.url);
    ctx.response.body = nunjucks.render('hello.html', {
        name: `<script>alert(${name})</script>`
    });
};

module.exports = {
    'GET /hello/:name': fn_hello
};
const Koa = require('koa');
const controller = require('./controllers');
const bodyParser = require('koa-bodyparser');
const combineMiddleWare = require('./middleware');

const app = new Koa();

combineMiddleWare(app, __dirname);
app.use(bodyParser());
app.use(controller());

app.listen(9748);

console.log('app started at port 9748...');
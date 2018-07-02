const staticFiles = require('./static-files');
const responseBody = require('./response-body');

function combineMiddleWare(app, dirname) {
    app.use(staticFiles('/static/', dirname + '/static'));
    app.use(responseBody());
}


module.exports = combineMiddleWare;

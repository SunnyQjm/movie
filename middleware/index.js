const staticFiles = require('./static-files');


function combineMiddleWare(app, dirname) {
    app.use(staticFiles('/static/', dirname + '/static'));
}


module.exports = combineMiddleWare;

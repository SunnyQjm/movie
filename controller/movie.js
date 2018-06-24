const Movie = require('../models/Movie');

const getMovies = async ctx => {
    const page = +ctx.query.page || 1,
        size = +ctx.query.size || 10;
    let result = await Movie.findAll({
        where: {
            magnet: {
                $like: 'magnet%'
            }
        },
        offset: (page - 1) * size,
        limit: size
    });
    ctx.response.type = 'application/json';
    ctx.response.body = JSON.stringify(result);
};

module.exports = {
    'GET /getMovies': getMovies,
};
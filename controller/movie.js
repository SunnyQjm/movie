const Movie = require('../models/Movie');

/**
 * 分页获取电影接口
 * @param ctx
 * @returns {Promise<void>}
 */
const getMovies = async ctx => {
    const page = +ctx.query.page || 1,          //页数
        size = +ctx.query.size || 10,           //每页的数量
        orderProp = ctx.query.orderProp,        //排序的属性
        order = ctx.query.order || 'ASC',       //排序方式。 ASC=>升序，DESC=>降序
        isDownload= ctx.query.isDownload;       //用来过滤电影是否已经下载完成。1 => 已下载完成， 0 => 未下载
    let findParams = {
        offset: (page - 1) * size,
        limit: size
    };
    if(orderProp && (order === 'ASC' || order === 'DESC')){
        findParams.order = [
            [orderProp, order]
        ];
    }
    if(isDownload !== undefined)
        findParams.where.isDownload = +isDownload ? 1 : 0;
    let result = await Movie.findAll(findParams);
    ctx.easyResponse.success(result);
};


/**
 * 通过电影的名字查询电影的信息
 * @param ctx
 * @returns {Promise<void>}
 */
const queryMovieByName = async ctx =>{
    const name = ctx.query.name;
    let findParams = {
        where: {
            $or: {
                movieName: {
                    $like: `%${name}%`
                },
                translationName: {
                    $like: `%${name}%`
                }
            }
        },
    };
    let result = await Movie.findAll(findParams);
    ctx.easyResponse.success(result);
};

/**
 * 这个接口是在服务器上查找有没有传入md5所对应的文件，如果有的话就不用再上传了
 * @param ctx
 * @returns {Promise<void>}
 */
const judgeMd5 = async ctx => {
  const md5 = ctx.query.md5;
  let findParams = {
      where: {
          md5: md5,
      },
  };
  let movie = await Movie.findOne(findParams);
  let result = {
      exist: movie !== null,
  };
  if(movie !== null)
      result.movie = movie;
  ctx.easyResponse.success(result);
};

module.exports = {
    'GET /getMovies': getMovies,
    'GET /queryMovieByName': queryMovieByName,
    'GET /judgeMD5': judgeMd5,
};
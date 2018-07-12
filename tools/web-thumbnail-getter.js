const phantom = require('phantom');
const thunky = require('thunky');

const getPhantomClient = thunky(async cb => {
    cb(await phantom.create())
});

function createWebThumbnails(url, savePath) {
    return new Promise((resolve, reject) => {
        getPhantomClient(client => {
            client.createPage()
                .then(async page => {
                    try {
                        let width = 1024;
                        let height = 600;
                        await page.property('viewportSize', {width: width, height: height});
                        const status = await page.open(url);
                        page.evaluate(function(w, h) {
                            document.body.style.width = w + "px";
                            document.body.style.height = h + "px";
                        }, width, height);
                        await page.property('clipRect', {top: 0, left: 0, width: width, height: height});
                        if (status === 'success') {
                            setTimeout(async ()=> {
                                await page.render(savePath);
                                resolve(savePath);
                            }, 1000)
                        } else {
                            reject(status);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch(reject)
        })
    });
}

createWebThumbnails("https://qjm253.cn", 'qjm23.cn');
module.exports = {
    createWebThumbnails,
};

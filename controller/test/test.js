let WebTorrent = require('webtorrent');
let fs = require('fs');

let client = WebTorrent();

let torrentIds= ["magnet:?xt=urn:btih:YOQMXATCCU6R5JO4OT2VESFZWQMSQFJE&tr=http://bt.dl1234.com/announce",
"magnet:?xt=urn:btih:TGTMKKXW7XGEXZTFTSMT66O7TXHA3TDK&tr=http://bt.dl1234.com/announce",
"magnet:?xt=urn:btih:3R4FBCY6ZEVYGJYZMPXYY2BP7XDT5REP&tr=http://bt.dl1234.com/announce",
"magnet:?xt=urn:btih:CSQ6AXOZ3VNSA5BE4JY6K7JOJSXFI5TA&tr=http://bt.dl1234.com/announce",
"magnet:?xt=urn:btih:NM7VYWDGFWO2ADRCLFNFJMVOCSTXDGMR&tr=http://bt.dl1234.com/announce",
"magnet:?xt=urn:btih:S6ZNL64LUOH5QQWMOE2FTE25IRQKA3TQ&tr=http://bt.dl1234.com/announce"];



// let rs = fs.createReadStream('test.js');
// let ws = fs.createWriteStream('test2.js');
// rs.pipe(ws);
// torrentIds.forEach(tid => {
//     client.add(tid, {}, (torrent) => {
//         let file = torrent.files.find(file => {
//             console.log(file);
//             return file.name.endsWith(".mp4");
//         });
//
//         let rs = file.createReadStream();
//         let ws = fs.createWriteStream('./' + file.name);
//         rs.pipe(ws);
//         torrent.on('download', function (bytes) {
//             console.log('just downloaded: ' + bytes);
//             console.log('total downloaded: ' + torrent.downloaded);
//             console.log('download speed: ' + torrent.downloadSpeed);
//             console.log('progress: ' + torrent.progress);
//         })
//     });
// });
var https = require("https");
var fs = require("fs");
var format = require('string-format');
var request = require('request');

// https.createServer(options, (req, res) => {
//     res.writeHead(200);
//     res.end('hello world\n');
// }).listen(8000);

var category = ['人像'];

var host = "https://tuchong.com/rest/tags";
var img_host = "https://photo.tuchong.com";
var filePath = 'images/downImg';
var seed = 12;
var page = 1;
var max_page = 1;

var last_post_id = 0;
var req_data = {
    page: 1,
    count: 100,
    order: 'weekly'
};

mkdirsSync(filePath);

for (i = 0; i < max_page; i++) {
    var url = format("{0}/{1}/{2}?page={3}&count={4}&order=weekly&befor", host, category[0], 'posts', req_data.page, req_data.count);

    //发送请求
    request(encodeURI(url), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            data.postList.forEach(function (item, i) {
                setTimeout(function () {
                    item.images.forEach(function (img, ii) {
                        setTimeout(function () {
                            var img_url = format("{0}/{1}/f/{2}.jpg", img_host, img.user_id, img.img_id);
                            saveImage(img_url);
                        }, ii * 200);
                    });
                }, i * 1000);
            });
        }
    });
}

function saveImage(img_url, callback) {
    request.head(img_url, function (err, res, body) {
        request(img_url).pipe(fs.createWriteStream(format("{0}/bg_{1}.jpg", filePath, seed)));
        console.log(format("dowloaded:{0}", img_url));
        seed++;
    });
}

// 创建多层文件夹 同步
function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        let pathtmp
        dirpath.split(path.sep).forEach(dirname => {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname)
            } else {
                pathtmp = dirname
            }

            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false
                }
            }
        })
    }
    return true
}
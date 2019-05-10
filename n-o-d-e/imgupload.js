/**
 * 加载npm包
 */
const fs = require("fs");
const path = require("path");
const co = require("co");
const images = require("images");
const sizeOf = require("image-size");
/**
 * 上传图片封装
 * @type {Object}
 */
let saveJPG;
saveJPG = {
    /**
     * 图片一分三存储的各个路径
     * @type {Array}
     */
    pathArr: ["web/upload/big/", "web/upload/middle/", "web/upload/small/"],
    /*
    * 文件夹权限
    * */
    folderAuthority: '0777',
    /**
     * 监控开关
     * @type {Boolean}
     */
    logsSwitch: true,
    /**
     * 单张图片保存图片
     * @param  {Object}   files       [file对象]
     * @param  {string}   goalDirPath [文件要存的全路径]
     * @param  {string}   Dirath      [图片的名字]
     * @param  {string}   jpgName     [生成后的名字]
     * @param  {Function} callback    [回调函数]
     * @return [no]
     */
    save: function (files, goalDirPath, Dirath, jpgName, callback) {
        let me = this;
        me.createDateFolder(goalDirPath);
        me.copyImage(files, goalDirPath, Dirath, jpgName, callback);
    },
    /**
     * [description]
     * @param  {[type]}   files       [description]
     * @param  {[type]}   goalDirPath [description]
     * @param  {[type]}   Dirath      [description]
     * @param  {[type]}   jpgName     [description]
     * @param  {Function} callback    [description]
     * @return {[type]}               [description]
     */
    classificationSave: function (files, goalDirPath, Dirath, jpgName, callback) {
        if (!fs.existsSync(this.pathArr[0]) || !fs.existsSync(this.pathArr[1]) || !fs.existsSync(this.pathArr[2])) {
            let me = this;
            me.pathArr.forEach(function (obj, i) {
                me.MymkdirSync(obj, 0, function (arr, err) {
                    if (err)
                        me.logs(("创建" + arr + "文件夹出错"), "err");
                    else
                        me.logs(("创建" + arr + "文件夹成功"), "log");
                });
            });
        }
        this.classificationCopyImage(files, goalDirPath, Dirath, jpgName, callback);
    },
    MymkdirSync: function (url, mode, cb) {
        this.logs(("url: " + url), "log");
        let arr = url.split("/");
        mode = mode || '0755';
        cb = cb || function () {};
        if (arr[0] == ".")
            arr.shift();
        if (arr[0] == "..")
            arr.splice(0, 2, (arr[0] + "/" + arr[1]));
        this.inner(arr.shift(), arr, mode, cb);
    },
    inner: function (cur, arr, mode, cb) {
        if (!fs.existsSync(cur)) {
            try {
                fs.mkdirSync(cur, mode);
                cb(cur);
            } catch (err) {
                cb(cur, err);
            }
        }
        if (arr.length) this.inner((cur + "/" + arr.shift()), arr, mode, cb);
    },
    copyImage: function (files, goalDirPath, Dirath, jpgName, callback) {
        this.logs(goalDirPath + jpgName, "log");
        let readStream = fs.createReadStream(files);
        let writeStream = fs.createWriteStream(("./" + goalDirPath + jpgName));
        readStream.pipe(writeStream);
        readStream.on('end', function () {
            fs.unlinkSync(files);
            callback();
        });
    },
    classificationCopyImage: function (files, goalDirPath, Dirath, jpgName, callback) {
        let me = this;
        me.logs(goalDirPath + jpgName, "log");
        me.createDateFolder(goalDirPath);
        let readStream = fs.createReadStream(files);
        let writeStream = fs.createWriteStream(("./" + goalDirPath + jpgName));
        readStream.pipe(writeStream);
        readStream.on('end', function () {
            fs.unlinkSync(files);
            fs.rename(files, ("" + goalDirPath + jpgName), function (err) {
                co(function () {
                    let dimensions = sizeOf(("" + goalDirPath + jpgName));
                    let _img = images(("" + goalDirPath + jpgName));
                    let imgW = parseInt(dimensions.width);
                    let imgH = parseInt(dimensions.height);
                    let z_x = 0;
                    let z_y = 0;
                    me.logs(`imgW : ${imgW} , imgH : ${imgH}`, "log");
                    if (imgW > 800 && imgH > 800) {
                        if (imgW > imgH) {
                            imgH = parseInt((imgH * 800) / imgW);
                            imgW = 800;
                        } else {
                            imgW = parseInt((imgW * 800) / imgH);
                            imgH = 800;
                        }
                        _img.resize(imgW, imgH);
                    } else if (imgW > 800 && imgH <= 800) {
                        imgH = parseInt((imgH * 800) / imgW);
                        imgW = 800;
                        _img.resize(imgW, imgH);
                    } else if (imgH > 800 && imgW <= 800) {
                        imgW = parseInt((imgW * 800) / imgH);
                        imgH = 800;
                    } else {
                        if (imgW > imgH) {
                            imgH = parseInt((imgH * 800) / imgW);
                            imgW = 800;
                        } else {
                            imgW = parseInt((imgW * 800) / imgH);
                            imgH = 800;
                        }
                        _img.resize(imgW, imgH);
                    }
                    z_x = (800 - imgW) / 2;
                    z_y = (800 - imgH) / 2;
                    let i = images(800, 800).fill(255, 255, 255, 1);
                    images(i).draw(_img, z_x, z_y)
                        .save(me.pathArr[0] + jpgName, {quality: 100}).resize(320, 320)
                        .save(me.pathArr[1] + jpgName, {quality: 100}).resize(120, 120)
                        .save(me.pathArr[2] + jpgName, {quality: 100});
                    me.logs(`${me.pathArr[0]}${jpgName} 创建成功`, "log");
                    me.logs(`${me.pathArr[1]}${jpgName} 创建成功`, "log");
                    me.logs(`${me.pathArr[2]}${jpgName} 创建成功`, "log");
                    callback();
                });
            });
        });

    },
    createDateFolder: function (goalDirPath) {
        let me = this;
        if (!fs.existsSync(goalDirPath)) {
            me.MymkdirSync(goalDirPath, me.folderAuthority, function (goalDirPath, err) {
                if (err) {
                    me.logs(`创建文件夹 ${goalDirPath} 出错`, "err");
                } else {
                    me.logs(`创建文件夹 ${goalDirPath} 成功`, "log");
                }
            });
        }
    },
    returnGuid: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    logs: function (value, type) {
        if (this.logsSwitch) {
            switch (type) {
                case "log":
                    console.log(("=================" + value));
                    break;
                case "err":
                    console.error(("=================" + value));
                    break;
                default:
                    "";
            }
        }
    }
};
module.exports = saveJPG;

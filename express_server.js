// 官网：http://expressjs.com/zh-cn
// 菜鸟教程：https://www.runoob.com/nodejs/nodejs-express-framework.html
// 菜鸟教程: https://www.runoob.com/nodejs/nodejs-restful-api.html
// nodejs教程: http://nodejs.cn/learn/reading-files-with-nodejs

const isCache = true; // 默认开启文件cache
var ejs = require('ejs');
const fs = require('fs')
const path = require("path");
const crypto = require('crypto');
var express = require('express');
var request = require('request');
var app = express();


// 对api接口设置支持跨域访问
app.all("/api/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 静态文件:  如Vue框架中构建好的dist目录中文件
app.use('/dist', express.static('dist'));

//  GET请求主页面  ejs模版引擎使用
app.get('/', function (req, res) {
    console.log("主页");
    res.header("Content-Type", "text/html");
    let data = [
        {method: 'GET请求：',  url: 'http://127.0.0.1:9999/api/get'},
        {method: 'POST请求(需要post请求)：', url:'http://127.0.0.1:9999/api/update'},
        {method: '静态页面：',  url:'http://127.0.0.1:9999/dist/index.html'},
        {method: '静态图片：',  url:'http://127.0.0.1:9999/dist/img/spark.jpg'},
        {method: 'ejs模版引擎post请求第三方接口(且支持缓存)：',  url:'http://127.0.0.1:9999/mock'},
    ];
    ejs.renderFile(path.join(__dirname,'ejs/index.ejs'), {name:'ejs模版引擎demo', data: data}, (err, str) => {
        // 输出绘制后的 HTML 字符串
        console.log(str);

        // 返回给浏览器客户端
        res.send(str);
    });
})

//  GET 请求
app.get('/api/get', function (req, res) {
    console.log("GET请求");
    data = {
        "id": 1,
        "name": "GET请求",
    }
    res.json(data);
})

//  POST 请求
app.post('/api/update', function (req, res) {
    console.log("POST请求");
    data = {
        "id": 2,
        "name": "POST请求",
    }
    res.json(data);
})

//  GET请求页面  ejs模版引擎使用, post获取后端接口数据
app.get('/mock', function (req, res) {
    console.log("mock页面");
    res.header("Content-Type", "text/html");
    // post请求第三方mock接口获取数据
    var requestData = {}
    request({
        url: "https://getman.cn/mock/hnust/xinglongliu/nodejs/mock/user/data", // https://getman.cn/mock 在线mock接口
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(requestData)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // {"ret":0,"msg":"ok","data":[{"id":10001,"name":"user01"},{"id":10002,"name":"user02"},{"id":10003,"name":"user03"}]}
            console.log(body) // 请求mock接口返回数据
            let data = body.data;
            let mockEjsPath = path.join(__dirname,'ejs/mock.ejs')
            if (!isCache) {
                // 没有开启缓存cache直接使用模版生成html输出
                ejs.renderFile(mockEjsPath, {name:'ejs模版引擎post请求第三方接口', data: data}, (ejsErr, str) => {
                    // 输出绘制后的 HTML 字符串
                    console.log(str);

                    // 返回给浏览器客户端
                    res.send(str);
                });
                console.log("======== 没有开启文件缓存: 通过模版引擎生成html文件输出给前端页面 ========");
            } else {
                // 开启缓存cache检查是否已有cache html文件,有则直接使用,没有重新生成

                // 读取mock.ejs模版文件内容
                fs.readFile(mockEjsPath, 'utf8' , (err, ejsData) => {
                    if (err) {
                        console.error(err)
                        res.send(err.message);
                        return
                    }
                    let cacheData= ejsData + JSON.stringify(body)

                    // 控制台输出mock.ejs模版文件内容和获取第三接口数据组合字符串
                    console.log(cacheData)

                    // 生成md5值
                    const md5 = crypto.createHash('md5');
                    let md5Str = md5.update(cacheData, 'utf8').digest('hex');
                    console.log("缓存文件内容md5值：" + md5Str);

                    // 检查缓存cache mock.html文件是否
                    let mockCachefilePath = path.join(__dirname,'cache/'+ md5Str + '_mock.html')

                    fs.access(mockCachefilePath, fs.constants.F_OK, (notExist) => {
                        console.log(`${mockCachefilePath} ${notExist ? '缓存文件不存在' : '缓存文件存在'}`);
                        if (notExist) {
                            console.error(notExist)
                            // cache mock.html文件不存在
                            ejs.renderFile(mockEjsPath, {name:'ejs模版引擎post请求第三方接口', data: data}, (ejsErr, str) => {
                                // 输出绘制后的 HTML 字符串
                                console.log(str);

                                // 保存cache mock.html文件, 之后会直接使用cache文件,不用重新生成html
                                fs.writeFile(mockCachefilePath, str, err => {
                                    if (err) {
                                        console.error(err)
                                        res.send(err.message);
                                        return
                                    }

                                    // 返回给浏览器客户端
                                    res.send(str);
                                })
                            })
                            console.log("======== 开启文件缓存: 【缓存文件不存在】通过模版引擎生成html文件输出给前端页面, 并保存生成的html到缓存中提供下次请求使用  ========");
                        } else {
                            // cache mock.html文件存在
                            fs.readFile(mockCachefilePath, 'utf8' , (err1, mockCacheData) => {
                                if (err1) {
                                    console.error(err1)
                                    res.send(err1.message);
                                    return
                                }
                                res.send(mockCacheData);
                            })
                            console.log("======== 开启文件缓存: 【缓存文件已存在】直接读缓存文件输出到前端页面  ========");
                        }
                    })
                })
            }
        } else {
            res.send("err");
        }
    });
})

// 创建服务,监听9999端口
var server = app.listen(9999, "" ,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server running at http://127.0.0.1:%s",port)
})
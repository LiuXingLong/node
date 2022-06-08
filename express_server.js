// 官网：http://expressjs.com/zh-cn
// 菜鸟教程：https://www.runoob.com/nodejs/nodejs-express-framework.html
// 菜鸟教程: https://www.runoob.com/nodejs/nodejs-restful-api.html

var express = require('express');
var app = express();

// 设置跨域访问
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", " 3.2.1");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//  GET请求主页面  ejs模版引擎使用
app.get('/', function (req, res) {
    res.header("Content-Type", "text/html");
    console.log("主页");
    let ejs = require('ejs'), path = require('path');
    let data = [
        {method: 'GET请求：', url: 'http://127.0.0.1:9999/api/get'},
        {method: 'POST请求：', url:'http://127.0.0.1:9999/api/update'}
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
    console.log("主页 GET 请求");
    data = {
        "id": 1,
        "name": "GET请求",
    }
    res.json(data);
})

//  POST 请求
app.post('/api/update', function (req, res) {
    console.log("主页 POST 请求");
    data = {
        "id": 2,
        "name": "POST请求",
    }
    res.json(data);
})

// 创建服务,监听9999端口
var server = app.listen(9999, "" ,function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server running at http://127.0.0.1:%s",port)
})
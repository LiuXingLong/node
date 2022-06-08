// 菜鸟教程：https://www.runoob.com/nodejs/node-js-get-post.html
// 官网教程：http://nodejs.cn/learn/make-an-http-post-request-using-nodejs

var http = require("http");

http.createServer(function (request, response) {
    console.log(request);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
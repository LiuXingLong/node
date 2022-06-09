## 安装 express和ejs
```
sudo权限下执行 init.sh 安装express框架、ejs模版引擎

# 执行init.sh脚本
./init.sh

# 注意：如已经含有 package.json 可直接执行 sudo npm install 安装
```

## 运行 express 框架的http服务
```
# 运行express_demo.js
node express_server.js
```

## 目录结构
```
├── README.md
├── cache
├── dist
│   ├── img
│   │   └── spark.jpg
│   └── index.html
├── ejs
│   └── index.ejs
├── express_server.js
├── init.sh
├── node_server.js
├── package-lock.json
└── package.json
```

> 1. init.sh             安装express框架和ejs模版引擎脚本
> 2. express_server.js   express框架创建http服务demo
> 3. node_server.js      nodejs创建http服务demo
> 4. ejs                 ejs模版文件目录
> 5. dist                静态文件目录
> 6. cache               模版和数据生成静态html文件缓存目录
> 7. package.json        引用包
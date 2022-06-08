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
├── express_server.js
├── init.sh
├── node_server.js
└── package.json
```

> 1. init.sh             按照express框架和ejs模版引擎脚本
> 2. express_server.js   express框架创建http服务demo
> 3. node_server.js      存nodejs创建http服务demo
> 4. package.json        引用包
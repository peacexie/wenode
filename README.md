

# Wenode - Node.js Mini Framework # 

Node.js Mini Framework, for Web-Chatroom, Info-push, REST-API!  
一个适合于：网页聊天, 信息推送, REST-API, 微信扫码交互的 Node.js 微框架！

----------------------------------- 


### 聊天室功能

* 已有功能
  - 分聊天室聊天，
  - 同一人员，加入多聊天室（客户端）

* 使用情景
  - 直播聊天
  - APP消息推送 : 升级,提示,消息
  - 微信扫码交互 : 登录,绑定,
  - Web客服聊天 : 
  - 微现场/扫码签到 : 与微信扫码，大屏幕交互

* 聊天室扩展(待实现)
  - 上传文件/图片
  - 消息屏蔽过滤


### Web功能

* REST-API
  - /rest/news (新闻首页)
  - /rest/news-a1002 (新闻栏目)
  - /rest/news-a1008 (新闻栏目)
  - /rest/news.2017-ab-1234 (新闻详情：id=2017-ab-1234)
  - 以下根据需要扩展实现
  - /rest/news-add + POST (增加)
  - /rest/news-upd + POST (更新)
  - /rest/news-del + id=2017-ab-1234 (删除)

* Web常用功能 (未使用express)
  - 图片, 静态解析
  - 模板继承, 模板包含
  - 标签: 数据列表, 字符截取, 时间格式化 (更多请按需求扩展吧)
  - 纯数据展示（见：REST-API）
  - xml解析, md解析
  - 自定义数据扩展
  - 自定义扩展显示

* Web扩展(待实现)
  - 上传文件/图片 及管理
  - 更丰富的标签显示，数据处理


### 服务器配置

* 安装器配 node.js和模块
  - 安装：node.js
  - 安装模块：npm install socket.io -g
  - 安装模块：npm install mysql -g

* 配置应用/运行
  - 配置db：/cache/data.sql
  - 配置nodejs：/module/config.js
  - (服务端)运行：node app.js
  - (客户端)运行：http://127.0.0.1:8821/
  - (客户端)聊天测试：任意浏览器 或 web服务器 打开/client/下的html文件


### node.js学习感悟与提示

* 静态文件处理
  - 静态文件(js/css/html)显示，还要写代码处理(很不想这样做)  
  - 建议：大量静态处理用其他web服务器（如：Apache, IIS, Nginx）
  - 建议：精简nodejs只做聊天服务端, REST-API 等

* 学习提示
  - 异步与回调：初学一定要好好体会，否则是个很大的坑
  - 文件列表： /cache/tree_fdir.txt

* 举一反三
  - php做 WebSocket 长连接，见：/wemin/php/server.php  
    client.htm 为对应客户端
  - 第一版 nods.js聊天：/wemin/ver1/chat.js (来源网络+修改)  
    chat.htm 为对应客户端, 共用 static文件夹
  - 单文件(服务端) nods.js聊天：/wemin/mini.js  
    共用 /static/文件夹, 及客户端：/client/*

----------------------------------- 


### 相关资源

* 系列链接

  - https://github.com/peacexie/wenode/tree/wemin  
    精简的 nodejs 聊天室：

  - http://txmao.txjia.com/dev.php  
    贴心猫(IntimateCat) --- PHP Web系统

* 外部链接
  - 见：wemin/@read/links.txt


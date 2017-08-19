
# wenode
Node js for Chatroom, Info-push, REST-API


----------------------------------- 


# nodejs学习/聊天室搭建 # 


### 需求分析

* php不适合做长连接
 - 可用：PHP socket实现（我没有成功过）
 - ajax/js不断请求php，做假文字直播：
 - http://house.08cms.com/fcsp/201411/593997/1.html

* 选nodejs
 - 天生的异步/非阻塞
 - 这里只做服务端(nodejs可做完整网站，见下`Hello-World`)

* 代码实现
 - 精简 - 只接受发送消息
 - 多房间...(底版本socket.io无此功能)
 - 具体流程分析...见代码

* 客户端调用:demo 
 - chatc.php
 - chatc.htm
 - chatc-func.js


### 服务器配置

* 安装器配 node.js和模块
 - 安装：node.js
 - 安装模块：npm install socket.io -g
 - 安装模块：npm install mysql -g

* 版本区别(安装走过的坑)
 - 本地node.js-v6 (-g全局模块可用)
 - 家里node.js-v8 (-g的模块不能用)

* 配置应用/运行
 - 配置db：db-sql见下
 - 配置nodejs：chats-cfgs.js (注意手动建立相关日志目录)
 - 运行：node chats.js


### node.js 扩展

* 聊天室扩展
 - 上传文件/图片
 - chats-cfgs.js `filter过滤配置` `xxx消息被屏蔽...`

* 其他应用场合：
 - 微信扫码等长连接
 - (摘录) RESTFUL API / 实时聊天 / APP信息推送 

----------------------------------- 


### 相关资源

* 本地资源
 - chatc.htm : 外部集成,调用参考
 - chatc.php : php综合,调用参考
 - chatc-func.js : 客户端js
 - chatc-kefu.htm : 游客(我)同时与3个客服聊天,调用参考
 - chatc-style.css : demo用css
 - chats.js : node.js 服务器端
 - chats-cfgs.js : 服务器配置
 - run.cmd : win的cmd命令

* 本地 demo
 - http://127.0.0.1/peace/nodejs/live/chatc.php
 - 

* 外部链接

  - http://www.runoob.com/nodejs/nodejs-tutorial.html
    Node.js 教程
  
  - http://cnodejs.org/topic/53787247cbcc396349fe3f5a
    用NodeJS实现一个简单的聊天室
  
  - http://blog.csdn.net/u013742084/article/details/51225635
    利用nodejs搭建server端
  
  - 安装express, 用这个来托管socket.io,以及静态页面,命令
    npm install express --save,--save可以使包添加到package.json文件里.
  
  - 安装socket.io,命令npm install socket.io --save.
  
  - http://yuncode.net/code/c_519c10363c14177
    js发送心跳包 web socket 

  - http://www.devstore.cn/essay/essayInfo/2199.html
    node.js的15个应用场景


* db-sql


```
    DROP TABLE IF EXISTS `chatroom_ys`;
    CREATE TABLE `chatroom_ys` (
      `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `type` varchar(24) NOT NULL DEFAULT '',
      `ufrom` varchar(255) NOT NULL DEFAULT '',
      `uto` varchar(24) NOT NULL DEFAULT '',
      `msgs` varchar(255) NOT NULL DEFAULT '',
      `show` tinyint(4) NOT NULL DEFAULT '1',
      `aip` varchar(255) NOT NULL DEFAULT '',
      `atime` int(11) NOT NULL DEFAULT '0',
      `auser` varchar(255) NOT NULL DEFAULT '',
      PRIMARY KEY (`id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
```

----------------------------------- 

var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    return ip;
};



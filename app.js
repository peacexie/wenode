
var Config  = require('./module/config'),
    Tools   = require('./module/tools'),
    Router  = require('./module/router'),
    WebSock = require('./module/websock'),
    SockIO  = require('socket.io'),
    http    = require('http');

global._dir = __dirname; // 根目录
global.rooms = {}; // 全局变量(统计各聊天室人数)

// 新建server服务器
var server = http.createServer(function(req, res){
    new Router(req, res).run();
}).listen(Config.port, Config.host);

// 聊天webSocket对象
global.ws = SockIO.listen(server);
ws.on('connection', function(client){
    new WebSock(this, client);
});

// 仅提示,无他意义
Tools.debug('server.run', Config.host+':'+Config.port+' ...');

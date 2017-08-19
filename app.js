
// modules/config
var http   = require('http'),
    Sockio = require('socket.io'),
    Config = require('./module/config'),
    Router = require('./module/router'),
    Chats  = require('./module/chats');
global._dir = __dirname;

// 新建server服务器
var server = http.createServer(function(req, res){
    var router = new Router(req, res);
    router.run();
}).listen(Config.port, Config.host);

// 聊天webSocket对象
global.rooms = {}; // 全局变量(统计各聊天室人数)
var ws = Sockio.listen(server);
ws.on('connection', function(client){
    new Chats(this,client);
});

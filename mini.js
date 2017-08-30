
var SockIO = require('socket.io'),
    http   = require('http');

global.rooms = {}; // 全局变量(统计各聊天室人数)

// 新建server服务器
var server = http.createServer().listen(8821, '127.0.0.1');
// 聊天webSocket对象
var ws = SockIO.listen(server);

ws.on('connection', function(client){

    var curRoom, // zhibo.123, web.456, app.789
        curUser, // 用户对象:uid,uname,uicon,...
        curIP; // user-ip
    
    client.on('init', function(room, user){
        curIP = client.request.connection.remoteAddress;
        curRoom = room; // room:字符串`type.123`格式
        curUser = user;
        logDebug('chat.init',user.uname+' -> '+curRoom+' @ '+curIP); 
    });
    
    client.on('check', function(cfg){
        client.join(curRoom);
        if(!rooms[curRoom]) rooms[curRoom] = 0;
        rooms[curRoom]++;
        ws.to(curRoom).emit('online', rooms[curRoom], +1);
    });
    
    // 监听客服端上发的消息
    client.on('upmsg', function(msgs){
        msgs = msgs ? msgs.trim().replace(/<\/?[^>]*>/g,'') : '';
        logDebug('chat.log, ', curUser.uid+' -> '+curRoom+' : '+msgs);
        var stime = new Date(new Date()).toLocaleTimeString();
        var data = {'user':curUser, 'msgs':msgs, 'ip':curIP, 'stime':stime, 'room':curRoom};
        ws.to(curRoom).emit('emsg', data);
    });
    
    // 监听退出
    client.on('disconnect', function () {
        rooms[curRoom]--;
        client.leave(curRoom);
        ws.to(curRoom).emit('online', rooms[curRoom], -1);
    });

});

// debug
function logDebug(erno, ermsg){
    console.log(erno, ermsg);
}

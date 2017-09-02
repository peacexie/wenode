
var SockIO = require('socket.io'),
    http   = require('http'),
    url    = require('url'),
    util   = require('util');

global.rooms = {}; // 全局变量(统计各聊天室人数)

// 新建server服务器
var server = http.createServer(function(req, res){
    shttp(req, res);
}).listen(8821, '127.0.0.1');
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

function shttp(req, res){
    var ourl = url.parse(req.url, true);
    var q = ourl.query;
    var stime = new Date(new Date()).toLocaleTimeString();
    var aid = q.aid ? q.aid : 0;
    var uname = q.uname ? q.uname : '系统Admin';
    var path = ourl.pathname;
    if(path=='/spush' || path=='/scans'){
        if(path=='/spush'){
            var msgs = q.msgs ? q.msgs+' ('+stime+')' : '系统Message ('+stime+')';
            var room = 'spush.'+aid;
        }else{ // scans
            var msgs = '成功接收转发扫码事件: scene='+aid+'. ';
            var room = 'scans.'+aid;
        }
        var user = {"uid":room, "uname":uname};
        var data = {'user':user, 'msgs':msgs, 'ip':'-', 'stime':stime, 'room':room};
        ws.to(room).emit('emsg', data);
        res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
        res.write(util.inspect(data));
    }else{
        res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
    }
    res.end();
}

// debug
function logDebug(erno, ermsg){
    console.log(erno, ermsg);
}

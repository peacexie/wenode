
var Config = require('./config'),
    //reqIp = require('request-ip'),
    Tools = require('./tools'),
    Mycurd = require('./mycurd');

var WebSock = function(ws, client){
    var curRoom, // zhibo.123, web.456, app.789
        curUser, // 用户对象:uid,uname,uicon,...
        curIP; // user-ip
    client.on('init', function(room, user){
        //curIP = reqIp.getClientIp(client.request); 
        curIP = client.request.connection.remoteAddress;
        // room:字符串`type.123`格式
        if(typeof(room)=='string' && room.indexOf('.')>0){
            curRoom = room;
        }
        if(!user.uid   || typeof(user.uid)=='object'   || typeof(user.uid)=='function')   user.uid = '';
        if(!user.uname || typeof(user.uname)=='object' || typeof(user.uname)=='function') user.uname = '游客';
        curUser = user;
        Tools.debug('init.info',user.uname+' -> '+curRoom+' @ '+curIP); 
    });
    client.on('check', function(cfg){
        if(!curRoom || !curUser.uid){
            if(curRoom){
                var erno = 'check.101', ermsg = 'Error User';
            }else{
                var erno = 'check.102', ermsg = 'Error Room';
            }
            Tools.debug(erno,ermsg);
        }
        client.join(curRoom);
        if(!rooms[curRoom]) rooms[curRoom] = 0;
        rooms[curRoom]++;
        ws.to(curRoom).emit('online', rooms[curRoom], +1);
    });
    // 监听客服端上发的消息
    client.on('upmsg', function(msgs){
        msgs = msgs ? msgs.trim().replace(/<\/?[^>]*>/g,'') : '';
        if(!msgs){
            var erno = 'upmsg.201', ermsg = 'Empty:msgs';
            ws.to(curRoom).emit('error',erno,ermsg);
            Tools.debug(erno,ermsg);
            return;
        }
        var mstamp = Date.parse(new Date()); // mstamp:时间戳(ms),取服务器时间
        save(msgs,mstamp);
        // 过滤
        var data = {'user':curUser, 'msgs':msgs, 'ip':curIP, 'mstamp':mstamp, 'room':curRoom};
        ws.to(curRoom).emit('emsg', data);
    });
    // 监听退出
    client.on('disconnect', function () {
        rooms[curRoom]--;
        client.leave(curRoom);
        ws.to(curRoom).emit('online', rooms[curRoom], -1);
    });
    // db-save, 插入数据
    var save = function(msgs, mstamp){
        var user = curUser;
        var arr = curRoom.split('.');
        if(!arr[0] || !arr[1] || !user.uid){
            Tools.debug('chat-save', 'Empty:room/user');
            return;
        }
        var data = {
            "type" : arr[0],
            "ufrom" : user.uid,
            "uto" : arr[1],
            "msgs" : msgs,
            "aip" : curIP,
            "atime" : parseInt(mstamp/1000),
            "auser" : user.uname
        };
        Mycurd.ins('chatroom', data, function(res){
            Tools.debug('chat-save, id=',res.insertId);
        });
        return;
    }
};
module.exports = WebSock;


// modules/config
var http   = require('http'),
    io     = require('socket.io'),
    mysql  = require('mysql'),
    config = require('./ucfgs'),
    rooms  = {},
    conn; // db-conn

// 新建server服务器
var server = http.createServer().listen(config.port, config.host);
var ws = io.listen(server);

ws.on('connection', function(socket){
    var curRoom, // zhibo.123, web.456, app.789
        curUser; // '匿名用户'
    socket.on('joinRoom', function(roomName){
        // 字符串`type.123`格式
        if(typeof(roomName)=='string' && roomName.indexOf('.')>0){
            curRoom = roomName;
            socket.join(curRoom);
            if(!rooms[curRoom]) rooms[curRoom] = 0;
            rooms[curRoom]++;
            ws.to(curRoom).emit('online',rooms[curRoom],1);
        }else{
            curRoom = '0.0';
            // ws.to(roomName).emit('errRoom','user.room','Error RoomName');
            // ws.close(); return; // ??? 发送不出去???
        }
    });
    socket.on('initUser', function(user){
        if(!user.uid   || typeof(user.uid)=='object'   || typeof(user.uid)=='function')   user.uid = '0';
        if(!user.uname || typeof(user.uname)=='object' || typeof(user.uname)=='function') user.uname = '游客';
        if(!user.uicon || typeof(user.uicon)=='object' || typeof(user.uicon)=='function') user.uicon = '';
        curUser = user; 
    });
    /*socket.on('checkData', function(){
        if(!curRoom || !curUser){
            // ws.to(curRoom).emit('errCheck','check.data','Error Check');
            if(curRoom) socket.leave(curRoom);
        }
    });*/
    // 监听发送消息
    socket.on('message', function(msg){
        var mstamp = Date.parse(new Date()); // mstamp:时间戳(ms),取服务器时间
        myIns(curRoom,curUser,msg,mstamp);
        // 过滤
        var data = {'user':curUser, 'msg':msg, 'mstamp':mstamp};
        ws.to(curRoom).emit('msg',data);
    });
    // 监听退出
    socket.on('disconnect', function () {
        rooms[curRoom]--;
        socket.leave(curRoom);
        ws.to(curRoom).emit('online',rooms[curRoom],-1);
    });
});

// db-conn, 中断了重连
var myConn = function(){
    if(!conn){
        conn = mysql.createConnection(config.mysql);     
        conn.connect();
    }
    //return conn;
}
// db-ins, 插入数据
var myIns = function(room,user,msg,mstamp){
    // if(!room || !user) return;
    myConn();
    var stamp = parseInt(mstamp/1000);
    var addSql = 'INSERT INTO cms_chatroom(type,uid,uname,uicon,uto,message,createdate) VALUES (?,?,?,?,?,?,?)';
    var arr = room.split('.');
    var addParams = [arr[0],user.uid,user.uname,user.uicon,arr[1],msg,stamp]; 
    conn.query(addSql,addParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }
    });
}

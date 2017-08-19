
// server-cfg
var hostname = '192.168.1.228',  
	port     = 8899;  
// base-vars
var http  = require('http'),
    url = require('url'),
	io    = require('socket.io'),
	mysql = require('mysql');

var conn = mysql.createConnection({     
	host     : 'localhost',       
	user     : 'root',              
	password : 'root',       
	port     : '3306',                   
	database : 'news', 
}); 	
conn.connect();

// 新建server服务器
var server = http.createServer(function(req, res){
    //myTest();
    //console.log('Server running at http://%s:%s', hostname, port);
}).listen(port, hostname);
var wsIO = io.listen(server);

//*/ 
wsIO.on('connection', function(socket){ 
    console.log('\033[96msomeone is connect\033[39m \n');
    //var url = socket.request.headers.referer;
    //console.log(url);

    socket.on('join', function(msg){
        // 检查是否有重复
        if(checkNickname(msg)){
            socket.emit('nickname', '昵称有重复!');
        }else{
            socket.nickname = msg;
            wsIO.sockets.emit('announcement', '系统', msg + ' 加入了聊天室!', {type:'join', name:getAllNickname()});
        }
    });
    // 监听发送消息
    socket.on('send.message', function(msg,vaid,vtype){
		myIns(socket.nickname,msg,vaid,vtype); console.log(vaid+':'+vtype);
        socket.broadcast.emit('send.message',socket.nickname,msg);
    });

    socket.on('disconnect', function(){
        if(socket.nickname){
            socket.broadcast.emit('send.message','系统',  socket.nickname + '离开聊天室!', {type:'disconnect', name:socket.nickname});
        }
    });
});//*/

var myIns = function(uname,msg,vaid,vtype){
    var create = parseInt(Date.parse(new Date())/1000);
    var addSql = 'INSERT INTO cms_chatroom(ufrom,uname,uto,type,message,createdate) VALUES (?,?,?,?,?,?)';
    var addSqlParams = ['0',uname,vaid,vtype,msg,create];
    conn.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT  ERROR] - ',err.message);
            return;
        }
    });
}

// 检查昵称是否重复
var checkNickname = function(name){
    if('(,你,我,他,她,它,TA,系统,admin,)'.indexOf(','+name+',')>0) return true;
    for(var k in wsIO.sockets.sockets){
        if(wsIO.sockets.sockets.hasOwnProperty(k)){
            if(wsIO.sockets.sockets[k] && wsIO.sockets.sockets[k].nickname == name){
                return true;
            }
        }
    }
    return false;
}
// 获取所有的昵称数组
var getAllNickname = function(){
    var result = [];
    for(var k in wsIO.sockets.sockets){
        if(wsIO.sockets.sockets.hasOwnProperty(k)){
            result.push({
                name: wsIO.sockets.sockets[k].nickname
            });
        }
    }
    return result;
}

/*
var server = http.createServer(function(req, res) {
    /*
    var params = url.parse(req.url, true).query;
    if(params.type) type = params.type;
    if(params.aid) aid = params.aid;
    console.log(type+':'+aid);
    //*/
    /*
    res.statusCode = 200;  
    res.setHeader('Content-Type', 'text/html');  
    res.write('<head><meta charset="utf-8"/></head>');  
    res.end('<h1>Hello world!</h1>');  
    *-/
});  
server.listen(port, hostname, function() {
    //myTest();
    // 解析 url 参数 : /?type=0&aid=1234
    //console.log(params);
    console.log('Server running at http://%s:%s', hostname, port);
});
*/


var myTest = function(){
    var  sql = 'SELECT * FROM cms_chatroom ORDER BY id DESC LIMIT 3';
    conn.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
       console.log('--------------------------SELECT----------------------------');
       console.log(result);
       console.log('------------------------------------------------------------\n\n');  
    }); 
}


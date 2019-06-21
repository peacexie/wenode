
var SockIO = require('socket.io'),
    http   = require('http'),
    //urlencode = require('urlencode'),
    //{base64encode, base64decode} = require('nodejs-base64');
    //serialjs = require('serialize-javascript'),
    query  = require('./mypool');
    config = require('./scfg');


var CONN = {};
var LIST = {}; // sid-uid：列表对应
// 新建server服务器
var server = http.createServer(function(req, res){
    //shttp(req, res);
}).listen(config.port); // , config.host
// webSocket统计对象
var io = SockIO.listen(server);


io.on('connection', function(socket){ //debug('disc:',socket.id);

    var curUser, // 用户对象:uid,uname,tel,...
        request; // 

    // 交互测试
    // * c2sTest:接收 socket 发来的消息
    // * s2cTest:发消息给 socket
    socket.on('c2sTest', function(data){
        debug('c2s-s2c:Tester', data);
        data['_from_server'] = 1;
        socket.emit('s2cTest', data); // io.to(socket.id).emit('s2cTest', data);
    });

    // 用户列表(测试用)
    socket.on('pullUserLists', function(tab){
        if(!tab) tab = 'user';
        var sql = 'SELECT * FROM ' +tab+ '_ys ORDER BY create_time DESC';
        query(sql, [], function(err, rows, fields){
            if(err){ socket.emit('getUserLists', {err}); }
            else{ socket.emit('getUserLists', {rows}); }
        });
    });

    // 未读消息(总数量)
    socket.on('pullUnreads', function(user){
        if(!user || !user.id){
            return;
        } 
        var sql2 = 'SELECT COUNT(*) AS cnt FROM chat_data_ys ';
            sql2 += 'WHERE uto=? AND `show`=?',
            uid = Number.isInteger(user.id) ? 'haina_'+user.id : user.id;
        query(sql2, [uid,'0'], function(err2, row2, fields2){
            var cnts = row2[0]['cnt'];
            socket.emit('getUnreads', {cnts,id:user.id});
        });
    });

    // 用户:初始化/上线/切换
    socket.on('initUser', function(user, re){
        if(!user || !user.uid){ //debug(user, 'a1');
            return;
        }
        request = socket.request;
        if(!CONN[user.uid]){ // 第一个窗口(端)初始化
            user.sockids = [socket.id];
            user.touid = ''; // 没有打开会话
            curUser = user;
            CONN[user.uid] = user;
            io.emit('online', Object.keys(CONN).length, +1);
        }else{ // 多窗口(端)登录实现
            if(CONN[user.uid].sockids.indexOf(socket.id)<0){
                CONN[user.uid].sockids.push(socket.id);
            } // 避免同一socket.id多次`initUser`(/#/dir/file?下)
            curUser = CONN[user.uid];
        }
        if(re){
            socket.emit('doneInitUser');
        } 
    });
    // 用户:多用户切换/多端登录?
    socket.on('resetUser', function(user){
        /*
            * 切换登录：
             - 页面不刷新，同一个socket.id
             - 先登录用户A，再登录用户B
             - 用户信息切换了，socket.id相同
        */
    });
    // 获取当前`property_id`中，绑定管理员的userid
    socket.on('pullBindAdmid', function(pid){
        // 绑定管理员的user
        var sql3 = 'SELECT uid FROM property_ys WHERE property_id=? AND chatid=?';
        query(sql3, [pid,'1'], function(err3, row3, fields3){
            if(row3 && row3.length>0){
                socket.emit('getBindAdmid', row3[0]['uid']);
            }
        }); 
    });
    // 设置当前会话对象(用户)
    socket.on('setNowConversation', function(touid){
        if(!curUser || !touid) return;
        curUser.touid = touid;
    });
    // 设置聊天置顶
    socket.on('setTopConversation', function(touid){
        if(!curUser || !touid) return;
        var sql = 'UPDATE chat_list_ys SET `top`=300 WHERE ufrom=? AND uto=?';
        var data = [touid, curUser.uid]; 
        query(sql, data, function(err, rows, fields){
            if(err){ console.log(err); }
        });
    });
    // 取消置顶的聊天
    socket.on('resetTopConversation', function(touid){
        if(!curUser || !touid) return;
        var sql = 'UPDATE chat_list_ys SET `top`=500 WHERE ufrom=? AND uto=?';
        var data = [touid, curUser.uid]; 
        query(sql, data, function(err, rows, fields){
            if(err){ console.log(err); }
        });
    });
    
    // 清除未读状态(标记已读,标记当前会话)
    socket.on('clearMessagesUnreadStatus', function(touid){
        if(!curUser || !touid) return; 
        var sql = 'UPDATE chat_data_ys SET `show`=1 WHERE ufrom=? AND uto=?';
        var data = [touid, curUser.uid]; 
        query(sql, data, function(err, rows, fields){
            if(err){ console.log(err); }
        });
    });
    // 拉取会话列表
    socket.on('pullConversationList', function(user){
        if(!user){
            user = curUser;
            user.upre = '';
        } 
        pullConversationList(socket, user);
    });
    // 拉取历史消息
    socket.on('pullHistoryMessages', function(from, last){
        if(!curUser){
            socket.emit('noinitUser');
        }else{
            pullHistoryMessages(socket, curUser, from, last); 
        } 
    });
    // 删除一个会话
    socket.on('delConversation', function(from){
        var sql = 'DELETE FROM chat_list_ys WHERE ufrom=? AND uto=?';
        query(sql, [from, curUser.uid], function(err, row, fields) {
            if(err){ console.log(err); }
        });
    });
    // 发送Text(文字)/Tpla(房源模板)消息
    socket.on('sendMessage', function(data){ 
        if(!data.ufrom || !data.uto){
            debug('Error-data', data);
            return; 
        }
        if(!curUser){
            socket.emit('noinitUser');
            return;
        }
        if(!data.msgs) return;
        let to = CONN[data.uto]; 
        let show = 1; // 已查看
        fmtMessage(data, curUser, request); // 格式化消息体
        if(to){
            show = to['touid']==curUser.uid ? 1 : 0; // 正在和socket对话为已读
            data['show'] = show;
            var sockids = to.sockids;
            for(var i=0;i<sockids.length;i++){
                if(sockids[i].length<6) continue;
                io.to(sockids[i]).emit('getMessage', data); // 转发消息
            } //socket.emit('getmsg', data); // 给自己???
        }else{
            data['show'] = 0; // 未查看
        }
        saveMessage(data); // 保存消息
    });
    // 用户：退出/离线
    socket.on('leaveUser', function(){ 
        userLeave(socket, curUser);
    });
    // 监听退出
    socket.on('disconnect', function(){ //debug('disc:',socket.id);
        userLeave(socket, curUser);
    });

});

// 用户:退出/离线(很多意外场景,都要执行这里的代码)
var userLeave = function(socket, curUser){ 
    if(!curUser || !curUser.uid) return;
    var sockids = curUser.sockids;
    for(var i=0;i<sockids.length;i++){
        if(socket.id==sockids[i]){
            sockids.splice(i,1);
            break;
        }
    }
    if(curUser.sockids.length==0){
        delete CONN[curUser.uid]; 
        io.emit('online', Object.keys(CONN).length, -1); 
    }
}

// 拉取会话列表()
var pullConversationList = function(socket, user){ 
    if(!user || !user.uid){
        debug(user, 'a');
        return; 
    }
    var upre = typeof(user.upre)=="undefined" ? 'haina_' : user.upre;
    var sql1 = 'SELECT * FROM chat_list_ys WHERE uto=? ORDER BY top,atime DESC';
    query(sql1, [user.uid], function(err1, list, fields){
        if(list && list.length){
            var ida = [];
            for(let i=0;i<list.length;i++){
                ida.push(list[i]['ufrom']);
                list[i]['fmtTime'] = fmtTime(list[i]['atime']);
            } 
            // 统计未读
            var sql2 = 'SELECT ufrom, COUNT(*) AS cnt FROM chat_data_ys ';
                sql2 += 'WHERE ufrom IN(?) AND uto=? AND `show`=? GROUP BY ufrom';
            query(sql2, [ida,user.uid,'0'], function(err2, row2, fields3){
                var cnts = {};
                for(let i=0;i<row2.length;i++){
                    cnts[row2[i]['ufrom']] = row2[i]['cnt'];
                } 
                socket.emit('getConversationList', {list:list, cnts:cnts});
            }); //console.log(ids, sql2);
        }else if(err1){ 
            console.log(err1); 
        }else{
            socket.emit('getConversationList', {list:[], uto:user.uid});
        }
    });
}
// 拉取最近消息(未读?,最近100条?)(包含:他发给我,我发给他)
var pullHistoryMessages = function(socket, user, from, last){
    lasql = last ? "id<?" : "id>?";
    lastid = last ? parseInt(last) : 0;
    var sql1 = 'SELECT * FROM chat_data_ys WHERE '+lasql+' AND ';
        sql1 += '( (ufrom=? AND uto=?) OR (ufrom=? AND uto=?) ) ';
        sql1 += ' ORDER BY atime DESC LIMIT 8';
    var params = [last, from, user.uid, user.uid, from];
    query(sql1, params, function(err1, data, fields){
        if(data && data.length){
            socket.emit('getHistoryMessages', {data:data, lastid});
        }else if(err1){ 
            console.log(err1); 
        }else{
            socket.emit('getHistoryMessages', {data:[], lastid});
        }
    });
}

// 保存会话列表(效率???)
var saveConversation = function(d){ // 
    var sql1 = 'SELECT * FROM chat_list_ys WHERE ufrom=? AND uto=?';
    var uname = d.uname; //d.toname;
    var thumb = d.thumb ? d.thumb : '';
    if(d.msgs.indexOf('{"id":')==0){
        var tabs = {'sale': '出售', 'rent': '出租'},
            data = JSON.parse(d.msgs),
            title = data['title'],
            type = tabs[data['model']] ? tabs[data['model']] : '未知';
        var msgs = type+':'+title;
    }else{
        var msgs = d.msgs;
    }
    query(sql1, [d.ufrom, d.uto], function(err1, row, fields) {
        if(row && row.length){ // 有列表,更新时间
            var sql = 'UPDATE chat_list_ys SET uname=?, atime=?'+(thumb?', thumb=?':'')+',msgs=? WHERE id=?';
            var data = thumb ? [uname, d.atime, thumb, msgs, row[0].id] : [uname, d.atime, msgs, row[0].id]; 
            query(sql, data, function(err1, rows, fields) {
                if(err1){ console.log(err1); }
            });
        }else if(err1){ // 出错提示
            if(err1){ console.log(err1); }
        }else{ // 无记录-新增
            var fields = 'ufrom,uname,thumb,uto,msgs,`show`,atime';
            var sql = 'INSERT INTO chat_list_ys('+fields+') VALUES (?,?,?,?,?,?,?)';
            var data = [d.ufrom, uname, thumb, d.uto, msgs, 1, d.atime]; 
            query(sql, data, function(err2, rows, fields) {
                if(err2){ console.log(err2); }
            });
        }
    });
}

// 保存消息
var saveMessage = function(d){ 
    // 保存信息
    var fields = 'ufrom,uto,msgs,type,ujson,`show`,aip,atime';
    var sql = 'INSERT INTO chat_data_ys('+fields+') VALUES (?,?,?,?,?,?,?,?)';
    var data = [d.ufrom, d.uto, d.msgs, d.type, d.user, d.show, d.ip, d.atime]; 
    query(sql, data, function(err, rows, fields) {
        if(err){ console.log(err); } 
        // 转发模板消息
        if(!d.show && d.hnadm){ 
            // 一个人的未读消息，1天(6/12小时)内只发一次模板消息... 
            var sql2 = 'SELECT COUNT(*) AS cnt FROM chat_data_ys ';
                sql2 += 'WHERE ufrom=? AND uto=? AND atime>? AND `show`=0';
            var data2 = [d.ufrom, d.uto, d.atime-6*3600];
            query(sql2, data2, function(err2, row2, fields2) {
                if(err2){ console.log(err2); } 
                if(row2[0].cnt<=1){ // 严格==1?
                    tplMessage(d, rows.insertId);
                }else{
                    console.log('skip:'+rows.insertId);
                } //console.log(row2[0],row2[0].cnt);
            });    
        } //console.log(d.show+':'+d.hnadm);
    });
    // 保存会话
    saveConversation(d); 
}
// 转发模板消息
var tplMessage = function(d, id){ 
    var data = {ufrom:d.ufrom, uto:d.uto, atime:d.atime, msgid:id},
        url = config.weapi_host,
        path = config.weapi_path;
    var unow = JSON.parse(d.user),
        uname = (unow && unow.uname) ? unow.uname : d.ufrom;
    data.uname = encodeURIComponent(uname); // .replace('和平鸽','');
    // 这个不明白,`和平鸽`为什么post传递不过去,后续来调试？
    // 含有中文需要rul编码, 否则可能是长度计算不准确,导致获取数据不完整 ???
    getHttp(url, path, data); //debug(d, id);
    // php发模板信息时，还会验证一次用户
}
// 格式化消息体
var fmtMessage = function(data, user, request){
    data['uname'] = user.uname;
    data['atime'] = parseInt(Date.parse(new Date())/1000),
    data['ip'] = request.connection.remoteAddress;
    data['user'] = JSON.stringify(user);
    msgs = data.msgs ? data.msgs.trim().replace(/<\/?[^>]*>/g,'') : '';
    data['msgs'] = msgs;
    data['fmtTime'] = fmtTime(data['atime']);
    return data;
}

var fmtTime = function(time){ 
    var D0 = new Date((time+8*3600)*1000), // 增加8小时
        D1 = new Date(), d0 = D0.toJSON(), d1 = D1.toJSON(); 
    if(!d0) return '--:--'; 
    if(d0.substr(0,10)==d1.substr(0,10)){ // 13:46:37
        return d0.substr(11,8);
    }else if(d0.substr(0,5)==d1.substr(0,5)){ // 04-23 12:30
        return d0.substr(5,11).replace('T',' ');
    }else{ // 2019-04-23 12:30
        return d0.substr(0,16).replace('T',' ');
    }
}

// debug
function debug(erno, ermsg){
    console.log(erno, ermsg);
}

var getHttp = function(url, path, data, port, cb){
    if(!port) port = '80';
    var http = require("http");  
    data = JSON.stringify(data); //console.log(data); 
    var opt = {  
        host: url,  
        port: '80',  
        method: 'POST',  
        path: path,  
        headers:{
            "Content-Type": 'application/json',  
            "Content-Length": data.length
        }
    }
    var body = '';  
    var req = http.request(opt, function(res) {  
        console.log("response: " + res.statusCode);  
        res.on('data',function(data){  
            body += data;  
        }).on('end', function(){  
            console.log(body)  
        });  
    }).on('error', function(e) {  
        console.log("error: " + e.message);  
    })
    req.write(data);
    req.end();
}

/*

    console.log('http-start');
    var url = 'gz.fzg360.com', // http://gz.fzg360.com
        path = '/proxy/pcheck.php',
        data = {username:"hello",password:"123456"};  
    getHttp(url, path, data);
    console.log('http-end');

*/

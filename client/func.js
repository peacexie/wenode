
(function(window,undefined){
    'use strict';
    var ws = {};
    var server = 'http://192.168.1.228:8808';
    function WebChat(type, id, cbget, cberr){
        this._id = id;
        this.connect(type, id, cbget, cberr);
    }
    WebChat.prototype = {
        connect:function(type, id, cbget, cberr){
            var _chat = this
            ws[id] = io(server);
            ws[id].on('connect', function(){
                _chat.init(type+'.'+id, chat_user);
                _chat.check();
            });
            // 监听:服务器下发的信息
            ws[id].on('emsg', function(data){
                var user = data.user; // {'user':curUser, 'msgs':msgs, 'stime':stime}
                var data = {
                    "uname" : user.uname + ((user.uid==chat_user.uid) ? '(我)' : ''),
                    "ip"    : data.ip,
                    "stime" : data.stime,
                    "msgs"  : data.msgs.replace(/\r\n/g,'<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>'),
                };
                var tpl = $('#msgRow').html();
                var html = tpl.replace(/\{([^\}]*)\}/ig, function(m, p) {
                    return data[p] || '';
                });
                msgShow(id,html,user);
                cbget && cbget(); // 收到信息回调
            });
            ws[id].on('online',function(count){
                var elm = $("#chatOnline"+id).length>0 ? $("#chatOnline"+id) : $("#chatOnline");
                $(elm).html(count);
            });
            ws[id].on('error',function(erno, ermsg){
                cberr && cberr(); // 出现错误回调
            });
        },
        init:function(room,user){
            ws[this._id].emit('init', room, user);
        },
        check:function(){
            ws[this._id].emit('check');
        },
        sendMsg:function(msgs){
            ws[this._id].emit('upmsg', msgs);
        },
        close:function(){
            ws[this._id].close();
        }
    }
    window['WebChat'] = WebChat;
})(window);

//初始化聊天
function initChat(room, cbemsg){
    if(!window['chatObjs']) window['chatObjs'] = {}; // 聊天对象
    if(typeof(room)=='string' && room.indexOf('.')>0){
        var tmp = room.split('.');
        if(tmp[1]){
            if(!window['chatId']) window['chatId'] = tmp[1];
            chatObjs[tmp[1]] = new WebChat(tmp[0], tmp[1], cbemsg);
        } // chatId:考虑多个id(聊天对象)切换
    }
}

function msgShow(id, html, user){
    if(user.uid==chat_user.uid) html = html.replace('(me)', 'clsme'); // 我自己
    if(user.uid=='(system)') html = html.replace('(sys)', 'clssys'); // 系统消息
    var div = $("#chatDiv"+id).length>0 ? $("#chatDiv"+id) : $("#chatDiv");
    var list = $("#chatLists"+id).length>0 ? $("#chatLists"+id) : $("#chatLists");
    $(list).html($(list).html()+html);
    $(div).scrollTop($(div)[0].scrollHeight); // 设置内容区的滚动条到底部
    $('#chatText').focus(); // 并设置焦点
}
function msgSend(msgs){
    var elm = $('#chatText');
    var msgs = elm.val().trim();
    if(!msgs) return;
    chatObjs[chatId].sendMsg(msgs);
    elm.val('');
}
function msgClear(){
    $('#chatLists').html('');
}

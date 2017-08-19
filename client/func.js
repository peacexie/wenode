
(function(window,undefined){
    'use strict';
    var ws = {};
    var server = 'http://127.0.0.1:8821';
    function WebChat(type,id){
        this._id = id;
        this.connect(type,id);
    }
    WebChat.prototype = {
        connect:function(type,id){
            var _chat = this;
            ws[id] = io(server);
            ws[id].on('connect',function(){
                _chat.init(type+'.'+id,chat_user);
                _chat.check();
            });
            // 监听:服务器下发的信息
            ws[id].on('emsg',function(data){
                var user = data.user; // {'user':curUser, 'msgs':msgs, 'mstamp':mstamp}
                var data = {
                    "uname" : user.uname + ((user.uid==chat_user.uid) ? '(我)' : ''),
                    "ip"    : data.ip,
                    "stime" : fmtStamp(data.mstamp),
                    "msgs"  : data.msgs.replace(/\r\n/g,'<br>').replace(/\r/g,'<br>').replace(/\n/g,'<br>'),
                };
                var tpl = $('#msgRow').html();
                var html = tpl.replace(/\{([^\}]*)\}/ig, function(m, p) {
                    return data[p] || '';
                });
                msgShow(id,html,user);
            });
            ws[id].on('online',function(count){
                var elm = $("#chatOnline"+id).length>0 ? $("#chatOnline"+id) : $("#chatOnline");
                $(elm).html(count);
            });
            ws[id].on('error',function(erno,ermsg){
                //this.close();
                console.log('['+erno+']'+ermsg);
            });
        },
        init:function(room,user){
            ws[this._id].emit('init',room,user);
        },
        check:function(){
            ws[this._id].emit('check');
        },
        sendMsg:function(msgs){
            ws[this._id].emit('upmsg', msgs);
        }
    }
    window['WebChat'] = WebChat;
})(window);

//初始化聊天
function initChat(room){
    if(!window['chatObjs']) window['chatObjs'] = {}; // 聊天对象
    if(typeof(room)=='string' && room.indexOf('.')>0){
        var tmp = room.split('.');
        if(tmp[1]){
            if(!window['chatId']) window['chatId'] = tmp[1];
            chatObjs[tmp[1]] = new WebChat(tmp[0],tmp[1]);
        } // chatId:考虑多个id(聊天对象)切换
    }
}

function msgShow(id,html,user){
    if(user.uid==chat_user.uid) html = html.replace('(me)','clsme'); // 我自己
    if(user.uid=='(system)') html = html.replace('(sys)','clssys'); // 系统消息
    var div = $("#chatDiv"+id).length>0 ? $("#chatDiv"+id) : $("#chatDiv");
    var list = $("#chatLists"+id).length>0 ? $("#chatLists"+id) : $("#chatLists");
    $(list).html($(list).html()+html);
    $(div).scrollTop( $(div)[0].scrollHeight ); // 设置内容区的滚动条到底部
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

function fmtStamp(mstamp,format){
    if(!format) format = 'y-m-d H:i';
    var D = new Date(parseInt(mstamp));
    var date = {
      "Y+": D.getFullYear(),
      "y+": D.getFullYear().toString().substr(2,2),
      "m+": D.getMonth() + 1,
      "d+": D.getDate(),
      "H+": D.getHours(),
      "i+": D.getMinutes(),
      "s+": D.getSeconds(),
      "S+": D.getMilliseconds()
    };
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

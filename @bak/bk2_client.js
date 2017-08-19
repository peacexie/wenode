
(function(window,undefined){
    'use strict';
    var ws = {};

    function Chat(host,port,id){
        this._id = id; // [this._id]
        ws[this._id] = io('http://' + host + ':' + port);
    }
    Chat.prototype = {
        connect:function(E){
            var id = this._id;
            ws[this._id].on('connect',function(){
                for(var i in E){
                    if(i == 'connect') continue;
                    ws[id].on(i,E[i]);    
                }
                E.connect && E.connect();
            });    
        },
        init:function(room,user){
            ws[this._id].emit('init',room,user);
        },
        check:function(cfg){
            ws[this._id].emit('check',cfg);
        },
        sendMsg:function(msg){
            ws[this._id].emit('message', msg);    
        }
    }
    if (typeof define == 'function' && define.amd) {
        define(function() {
            return Chat;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = Chat;
    } else {
        window['Chat'] = Chat;
    }
})(window);

function initChat(type,id){
    //初始化聊天
    chats[id] = new Chat('127.0.0.1','8821',id);
    chats[id].connect({
        connect:function(){
            chats[id].init(type+'.'+id,chat_user);
            chats[id].check();
        },
        msg:function(data){
            var user = data.user; // {'user':curUser, 'msg':msg, 'mstamp':mstamp}
            from = user.uname; if(user.uid==chat_user.uid) from +='(我)';
            time = fmtStamp(data.mstamp);
            var data = {
                "uname" : from,
                "ip"    : data.ip,
                "stime" : time,
                "msg"   : data.msg.replace(/\r\n/g,'<br>').replace(/\r/g,'<br>').replace(/\n/g,'<br>'),
            };
            var tpl = $('#msgRow').html();
            var html = tpl.replace(/\{([^\}]*)\}/ig, function(m, p) {
                return data[p] || '';
            });
            msgShow(id,html,user);
        },
        online:function(count){
            var elm = $("#chatOnline"+id).length>0 ? $("#chatOnline"+id) : $("#chatOnline");
            $(elm).html(count);
        },
        error:function(erno,ermsg){
            //this.close();
            console.log('['+erno+']'+ermsg);
        },
    });
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
function msgSend(msg){
    var elm = $('#chatText');
    var msg = elm.val().trim(); // .replace('\r\n', '')
    if(!msg) return;
    chats[cnow_id].sendMsg(msg); //console.log(msg);
    elm.val('');
}
function msgClear(msg){
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


(function(window,undefined){
    'use strict';
    var ws = {};
    var server = 'http://192.168.1.228:8829';
    //var server = 'ws://114.215.186.80:8888';
    function WebChat(user, cbget, cberr){
        //this._id = id; //'app';
        this.connect(user, cbget, cberr);
    }
    WebChat.prototype = {
        connect:function(user, cbget, cberr){
            var _stat = this; 
            ws = io(server);
            ws.on('connect', function(){
                _stat.initUser(user);
                _stat.pullConversationList();
            });
            // 接收消息 (监听/setOnReceiveMessageListener?Text)
            ws.on('getMessage', function(data){ 
                data['type'] = 'text';
                data['json'] = data['user']; //console.log(data);
                var html = showMessage(data,'新'); 
                // 更新会话列表
                updConversationList(data);
                $('#msg_'+data.ufrom).append(html);
                if($('#to').val()==data.ufrom){
                    scrBottom(data.ufrom);
                }
            });
            // 接收(拉取的)会话列表
            ws.on('getConversationList',function(data){ 
                showConversationList(data);
            });
            // 接收(拉取的)历史消息
            ws.on('getHistoryMessages',function(data, from, last){ 
                showHistoryMessages(data);
            });
            // 接收(系统的)在线状态
            ws.on('online',function(count){
                var elm = $("#statOnline").length>0 ? $("#statOnline") : $("#statOnline");
                $(elm).html(count);
            });
            ws.on('error',function(erno, ermsg){
                console.log(erno, ermsg);
            });
        },
        // 初始化用户
        initUser:function(user){
            ws.emit('initUser', user);
        },
        // 拉取会话类表
        pullConversationList:function(){
            ws.emit('pullConversationList');
        },
        // 删除会话类表
        delConversation:function(from){
            ws.emit('delConversation', from);
        },
        // 拉取历史信息
        pullHistoryMessages:function(from, last){
            ws.emit('pullHistoryMessages', from, last);
        },
        // 设置当前会话对象(用户)
        setNowConversation:function(touid){
            ws.emit('setNowConversation', touid);
        },
        // 清除信息未读状态
        clearMessagesUnreadStatus:function(touid){
            ws.emit('clearMessagesUnreadStatus', touid);
        },
        // 发送信息 
        sendMessage:function(data, type){
            data['type'] = type; 
            ws.emit('sendMessage', data);
            // 显示给'(我自己)';
            data['ufrom'] = jsuser.uid; //'(我自己)';
            data['atime'] = parseInt(Date.parse(new Date())/1000);
            var html = showMessage(data);
            $('#msg_'+$('#to').val()).append(html);
            scrBottom(data.uto);
        },
        // 关闭
        close:function(){
            ws.close();
        }
    }
    window['WebChat'] = WebChat;
})(window);

//初始化统计对象
function initChat(user){
    if(!window['chatObjs']){
        chatObjs = new WebChat(user);
    }
}
// 显示会话列表
function showConversationList(data){ 
    var list = $('#chatUsers');
    for(var i=0;i<data['list'].length;i++){
        var row = data['list'][i];
        if($('#to_'+row.ufrom).length>0) continue;
        showConversation(data['list'][i], data['cnts']);
    }
    showMessageList(); // 显示当前的默认信息列表
}
// 显示信息列表
function showMessageList(btn){ 
    to = btn ? $('#to').val() : to;
    var toitem = $('#to_'+to);
    $('#to').val(to);
    if($(toitem).length>0){
        $(toitem).find('p').trigger("click").addClass('act');
    }else{ // 新开会话
        var uname = $('#'+to).length ? $('#'+to).text() : 'User:'+to;
        showConversation({'ufrom':to,'uname':uname}, {'ufrom':0});
        setTimeout(function(){
            showMessageList(toitem);
        }, 200);  
    }
}
// 更新会话列表
function updConversationList(row){
    var toid = '#to_'+row.ufrom;
    if($(toid).length>0){
        var cnt = parseInt($(toid).find('i').text());
        if(isNaN(cnt)) cnt = 0;
        $(toid).find('i').text(cnt+1);
    }else{
        row['cnt'] = 1;
        showConversation(row, 1);
    }
}
// 显示一个会话
function showConversation(row, cnts){
    var html = $('#tplConversation').html(); 
    row['cnt'] = row['cnt'] ? row['cnt'] : cnts[row['ufrom']];
    html = html.replace(/\{([^\}]*)\}/ig, function(m, p) {
        return row[p] || '';
    });
    $('#chatUsers').prepend(html);
    //return html;
}
// 删除一个会话
function delConversation(e){
    var li = $(e).parent(),
        id = $(li).prop('id').replace('to_','');
    chatObjs.delConversation(id);
    $(li).remove();
}
// 切换会话
function changeConversation(e){
    var li = $(e).parent(),
        id = $(li).prop('id').replace('to_','');
    $('#chatLists li').hide();
    $('#chatUsers p').removeClass('act');
    var box = $('#msg_'+id);
    if($(box).length==0){
        $('#chatLists').append("<li id='msg_"+id+"'><p class='tc'>---("+id+")---</p></li>");
        chatObjs.pullHistoryMessages(id, 0);
    }else{
        $(box).show();
        scrBottom();
    }
    $('#to').val(id);
    $('#to_'+id).find('i').text('');
    chatObjs.setNowConversation(id); // （上报切换哪个会话）
    chatObjs.clearMessagesUnreadStatus(id); // 清除消息的未读状态
    $('#to_'+id).find('p').addClass('act');
}
// 显示历史消息列表
function showHistoryMessages(data){ 
    for(var i=0;i<data['data'].length;i++){ 
        html = showMessage(data['data'][i],'未读');
        $('#msg_'+$('#to').val()).prepend(html);
    }
    scrBottom(to);
}
// 滚动到底部
function scrBottom(to){ 
    setTimeout(function(){
        var box = '#msg_' + ($('#to').val());
        var sh = $(box)[0].scrollHeight;
        $('#chatLists').scrollTop(sh);
    }, 200);
}
// 显示一条消息
function showMessage(row, type){
    if(row.ufrom==jsuser.uid){
        row['uname'] = '(我自己)';
        //type = ''; 对方未读
    }
    if(!row.uname){
        if(row.ujson){
            var user = JSON.parse(row.ujson);
            row['uname'] = user.uname; 
        }else{
            row['uname'] = '(未知)';  
        }
    }
    row['atime'] = fmtTime(row['atime']);
    row['tag'] = row['show'] ? '' : type; // 未读/新
    var tpl = $('#tplMessage').html();
    var html = tpl.replace(/\{([^\}]*)\}/ig, function(m, p) {
        return row[p] || '';
    });
    return html;
}
// 发送一条消息
function sendMessage(msgs){
    var elm = $('#chatText');
        to = $('#to').val();
    msgs = msgs ? msgs : elm.val().trim();
    if(!to || !msgs){ alert('发送对象和信息不能为空'); return; }
    var data = {ufrom:uid, uto:to, msgs:msgs}
    if(!msgs) return;
    //data['toname'] = $('#'+to).text(); // 用于记录-聊天列表的姓名(对方的姓名哦) --- XXX
    chatObjs.sendMessage(data, 'text');
    elm.val('');
}
// 清空消息/未使用
function clearMessage(){
    $('#chatLists').html('');
}

// ======================================================== 

function nowPath(url){
    url = url ? url : document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);
    relUrl = decodeURI(relUrl);
    return relUrl;
}
function fromUrl(){
    relUrl = document.referrer;
    return nowPath(relUrl ? relUrl : '//(null)');
}

// 获取HTML页面参数 flag 为1 获取详细参数
function urlPara(key,def,url){
    url = url ? url : location.href;
    var re = (new RegExp("([^(&|\?)]*)" + key + "=([^&|#]*)").test(url+"#")) ? RegExp.$2 : '';
    if(def && !re) re = def;
    return re;
}

function fmtTime(time){
    var D0 = new Date((time+8*3600)*1000), // 增加8小时
        D1 = new Date(), d0 = D0.toJSON(), d1 = D1.toJSON(); 
    if(d0.substr(0,10)==d1.substr(0,10)){ // 13:46:37
        return d0.substr(11,8);
    }else if(d0.substr(0,5)==d1.substr(0,5)){ // 04-23 12:30
        return d0.substr(5,11).replace('T',' ');
    }else{ // 2019-04-23 12:30
        return d0.substr(0,16).replace('T',' ');
    }
}

/*

*/

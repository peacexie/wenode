
// ws-acts
var ws = io(chat_server); // .connect
ws.on('connect', function(){
    ws.emit('join',chat_type,chat_room,chat_uname,chat_uid);
});
ws.on('online',function(num){
    console.log('online:'+num);
});
ws.on('emsg',function(getUid,from,msg,mstamp){
    // fmt-Time
    var newDate = new Date();
    newDate.setTime(mstamp);
    stime = newDate.toLocaleString();
    // fmt-Msg
    msg = msg.replace(/\</g,'&lt;').replace(/\>/g,'&gt;').replace(/\n/g,"<br>");
    //msg = msg.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    msgShow(getUid,from,msg,stime);
});

// client-functions
var msgSend = function(){
    var elm = document.querySelector(chat_cltext);
    var msg = elm.value.replace('\r\n', '').trim();
    console.log(msg);
    if(!msg) return;
    ws.emit('umsg', msg);
    elm.value = '';
}
var msgShow = function(getUid,from,msg,stime){
    var li = document.createElement('li');
    if(getUid==chat_uid) li.className = 'me'; // 我自己
    from = getUid==chat_uid ? '(我)' : from;
    li.innerHTML = '<span>' +stime + ' ' + from + '</span>' + ' : ' + msg;
    document.querySelector(chat_clists).appendChild(li);
    // 设置内容区的滚动条到底部
    document.querySelector(chat_cldiv).scrollTop = document.querySelector(chat_cldiv).scrollHeight;
    // 并设置焦点
    document.querySelector(chat_cltext).focus();
}
var msgClear = function(){
    document.querySelector(chat_clists).innerHTML = '';
}

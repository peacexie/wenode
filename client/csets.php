<!DOCTYPE html>
<html>
<head>
<title>聊天室-管理后台</title>
<meta charset="utf-8">
<link rel="stylesheet" href="./style.css"/>
<script src='../static/js/zepto-1x.js'></script>
<script src="../static/js/socket.io.js"></script>
<script src="./func.js"></script>
</head>
<body>

<?php
$type = isset($_GET['type']) ? $_GET['type'] : 'uroom';
$aid = isset($_GET['aid']) ? $_GET['aid'] : '1251';
$uname = empty($_GET['uname']) ? '游客:'.$_SERVER['REMOTE_ADDR'] : $_GET['uname'];
$uid = (strstr($uname,'游客:')) ? md5($_SERVER['REMOTE_ADDR'].':'.@$_SERVER['HTTP_USER_AGENT']) : $uname; // user-id/md5(ip+ua)
?>

<div class="wrapper">
  <div class="content" id="chatDiv">
      <ul id="chatLists"></ul>
  </div>
  <div class="action">
      <textarea id="chatText"></textarea>
      <p class="online">在线：<span id="chatOnline"></span></p>
      <button class="btn btn-success" id="clear" onclick="msgClear()">清屏</button>
      <button class="btn btn-success" id="send" onclick="msgSend()">发送</button>
  </div>
</div>

<script id="msgRow" type="text/html">
<li class="some__class (me) (sys)">
  <div class="user-info">
    <p class="user-name"><a target="_blank">{uname}</a></p>
    <p class="user-ext">{stime}</p>
  </div>
  <p class="chat-msg">{msgs}</p>
</li>
</script>

<script>
// 聊天-configs
var chat_user = {
        "uid" : '<?=$uid?>', 
        "uname" : "<?=$uname?>"
    };
$(function() {
    initChat('<?="$type.$aid"?>');
});

</script>

<div class="nav">
    <li><a href='?aid=1251&uname='     >?aid=1251&uname=(游客)</a> # </li>
    <li><a href='?aid=1251&uname=Peace'>?aid=1251&uname=Peace</a> # </li>
    <li><a href='?aid=1252&uname=Lucy' >?aid=1252&uname=Lucy</a> # </li>
    <li><a href='?aid=1252&uname=Peace'>?aid=1252&uname=Peace</a> # </li>
    <li><a href='?aid=1251&uname=Lucy' >?aid=1251&uname=Lucy</a> # </li>
    <hr>
    <li><a href='?aid=1234&uname=客服A&type=kefu'>?aid=1234&uname=客服A</a> # </li>
    <li><a href='?aid=1235&uname=客服B&type=kefu'>?aid=1235&uname=客服B</a> # </li>
    <li><a href='?aid=1251&uname=客服C&type=kefu'>?aid=1251&uname=客服C</a> # </li>

</div>

</body>
</html>

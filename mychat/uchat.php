<!DOCTYPE html>
<html>
<head>
    <title>socket.io 聊天室例子</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/reset.css"/>
    <link rel="stylesheet" href="css/bootstrap.css"/>
    <link rel="stylesheet" href="css/app.css"/>
</head>
<?php
$aid = isset($_GET['aid']) ? $_GET['aid'] : '1239';
?>
<body>
    <p class="nav">
      <a href='?aid=1251'>?aid=1251</a> #
      <a href='?aid=1252'>?aid=1252</a> #
    </p>
    <div class="wrapper">
         <div class="content" id="chat">
             <ul id="chat_conatiner">
             </ul>

         </div>
         <div class="action">
             <textarea ></textarea>
             <button class="btn btn-success" id="clear">清屏</button>
             <button class="btn btn-success" id="send">发送</button>
         </div>
    </div>
    <script type="text/javascript" src="./js/socket.io.js"></script>
    <script type="text/javascript">
          var vaid = '<?=$aid?>', vtype = 'zhibo';
          var ws = io.connect('http://192.168.1.228:8899');
          var sendMsg = function(msg){
              ws.emit('send.message', msg, vaid, vtype);
          }
          var addMessage = function(from, msg){
              var li = document.createElement('li');
              li.innerHTML = '<span>' + from + '</span>' + ' : ' + msg;
              if(from=='系统') li.className = 'sys';
              document.querySelector('#chat_conatiner').appendChild(li);

              // 设置内容区的滚动条到底部
              document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;

              // 并设置焦点
              document.querySelector('textarea').focus();

          }

          var send = function(){
              var ele_msg = document.querySelector('textarea');
              var msg = ele_msg.value.replace('\r\n', '').trim();
              console.log(msg);
              if(!msg) return;
              sendMsg(msg);
              // 添加消息到自己的内容区
              addMessage('你', msg);
              ele_msg.value = '';
          }

          ws.on('connect', function(){
              var nickname = window.prompt('输入你的昵称!');
              while(!nickname){
                  nickname = window.prompt('昵称不能为空，请重新输入!')
              }
              ws.emit('join', nickname);
          });

          // 昵称有重复
          ws.on('nickname', function(){
              var nickname = window.prompt('昵称有重复或被系统保留，请重新输入!');
              while(!nickname){
                  nickname = window.prompt('昵称不能为空，请重新输入!')
              }
              ws.emit('join', nickname);
          });

          ws.on('send.message', function(from, msg, ops){
              addMessage(from, msg);
          });

          ws.on('announcement', function(from, msg, ops){
			  //console.log(ops);
              addMessage(from, msg);
          });

          document.querySelector('textarea').addEventListener('keypress', function(event){
              if(event.which == 13){
                  send();
              }
          });
          document.querySelector('textarea').addEventListener('keydown', function(event){
              if(event.which == 13){
                  send();
              }
          });
          document.querySelector('#send').addEventListener('click', function(){
              send();
          });

          document.querySelector('#clear').addEventListener('click', function(){
              document.querySelector('#chat_conatiner').innerHTML = '';
          });
    </script>
</body>
</html>
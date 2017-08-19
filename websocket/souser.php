<html>  
<head>  
    <meta charset="utf-8">
    <title>test</title>  
    <script>  
        g_xmlHttpReq = new XMLHttpRequest();  
        function onReplyCallback()  
        {  
            if(g_xmlHttpReq.readyState==4 && g_xmlHttpReq.status==200)  
            {  
                alert(g_xmlHttpReq.responseText);  
            }  
        }  
        function on_stop_service()  
        {  
            var cmd = document.getElementById("inCmd").value;  
            g_xmlHttpReq.open("GET","./sosvr.php?cmd=" + cmd,true);  
            g_xmlHttpReq.onreadystatechange=onReplyCallback;  
            g_xmlHttpReq.send(null);  
        }  
    </script>  
</head>  

<body>  
    <input type="text" id="inCmd">  
    <hr>  
    <button onclick="on_stop_service()">关闭服务</button>  
</body>  
</html>  
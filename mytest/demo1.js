//require.js 文件
var express = require('express')
	, http = require('http')
	//, html = require('./user_modules/html.js')
	, app = express();

app.get('/', function (req, res) {
   res.send("<!doctype html><html><head><meta charset='utf-8'><title>run@express</title></head><body>Hello 中文@7031@express</body></html>");
});

app.get('/news', function (req, res) {
	res.send("nodejs新闻列表");
	res.send("nodejs新闻列表，1，2，3");
	res.send();
});
 
//  /del_user 页面响应
app.get('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求");
   res.send('删除页面');
})
 
//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
   //console.log("/list_user GET 请求");
   res.send('用户列表页面');
})
 
// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {   
   console.log("/ab*cd GET 请求");
   res.send('正则匹配');
})

http.createServer(app).listen(7031);
console.log('Server running at http://127.0.0.1:7031/');


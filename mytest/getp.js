
var http = require('http');
var url = require('url');
var util = require('util');
 
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
	var ourl = url.parse(req.url, true);
	//console.log(ourl);
    var params = ourl.query;
	res.write("pathname：" + params.pathname);
    res.write("title：" + params.title);
    res.write("\n");
    res.write("网站 URL：" + params.url);
	res.write("\n");
    res.end(util.inspect(ourl));
}).listen(7032);

/*


util.inspect()
将任意对象转换为字符串的函数
*/

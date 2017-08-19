//require.js 文件
var express = require('express')
	, http = require('http')
	, app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({     
	host     : 'localhost',       
	user     : 'imcat',              
	password : '123456',       
	port     : '3306',                   
	database : 'txmao_main', 
});  

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   //console.log("主页 GET 请求");
   res.send('Mysql: select/insert/update/delete');
})

// 查询数据
app.get('/select', function (req, res) {
	conn.connect();
	//*
	var  sql = 'SELECT * FROM xtest_keyid_ys';
	//查
	conn.query(sql,function (err, result) {
			if(err){
				console.log('[SELECT ERROR] - ',err.message);
				return;
			}
		   console.log('--------------------------SELECT----------------------------');
		   console.log(result);
		   console.log('------------------------------------------------------------\n\n');  
	});
	//*/
	conn.end();
	res.send('s看命令行!');
});

// 插入数据
app.get('/insert', function (req, res) {
	conn.connect();
	var kid = Date.parse(new Date()); console.log(kid);
	var addSql = 'INSERT INTO xtest_keyid_ys(kid,content,auser,atime,aip) VALUES(?,?,?,?,?)';
	var addSqlParams = [kid, '菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
	//查
	conn.query(addSql,addSqlParams,function (err, result) {
			if(err){
				console.log('[INSERT  ERROR] - ',err.message);
				return;
			}
		   console.log('--------------------------SELECT----------------------------');
		   console.log(result);
		   console.log('------------------------------------------------------------\n\n');  
	});
	conn.end();
	res.send('i看命令行!');
});

// 更新数据
app.get('/update', function (req, res) {
	conn.connect();
	var kid = Date.parse(new Date());
	var modSql = 'UPDATE xtest_keyid_ys SET content = ?,auser = ? WHERE kid = ?';
	var modSqlParams = ['菜鸟dg站', 'https://dg.08cms.com',2];
	//查
	conn.query(modSql,modSqlParams,function (err, result) {
			if(err){
				console.log('[UPDATE  ERROR] - ',err.message);
				return;
			}
		   console.log('--------------------------SELECT----------------------------');
		   console.log(result);
		   console.log('------------------------------------------------------------\n\n');  
	});
	conn.end();
	res.send('u看命令行!');
});

// 删除数据
app.get('/delete', function (req, res) {
	conn.connect();
	var kid = Date.parse(new Date());
	var delSql = 'DELETE FROM xtest_keyid_ys where kid="1493710351000"';
	//删
	conn.query(delSql,function (err, result) {
			if(err){
				console.log('[DELETE  ERROR] - ',err.message);
				return;
			}
		   console.log('--------------------------SELECT----------------------------');
		   console.log(result);
		   console.log('------------------------------------------------------------\n\n');  
	});
	conn.end();
	res.send('d看命令行!');
});

//*
var server = app.listen(7042, function () {
  var host = server.address().address
  var port = server.address().port
  //alert("应用实例，访问地址为 http://%s:%s");
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
//*/

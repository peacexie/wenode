//require.js 文件
var express = require('express')
	, http = require('http')
	, app = express();

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/runoob'; //# 数据库为 runoob

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   //console.log("主页 GET 请求");
   res.send('Mongo: select/insert/update/delete');
})

// 查询数据
app.get('/select', function (req, res) {
	var selectData = function(db, callback) {  
	  //连接到表  
	  var collection = db.collection('site');
	  //查询数据
	  var whereStr = {"name":'菜鸟教程'};
	  collection.find(whereStr).toArray(function(err, result) {
		if(err)
		{
		  console.log('Error:'+ err);
		  return;
		}     
		callback(result);
	  });
	}
	MongoClient.connect(DB_CONN_STR, function(err, db) {
	  console.log("连接成功！");
	  console.log(err);
	  //var collection = db.collection('site');
	  /*
	  selectData(db, function(result) {
		console.log(result);
		db.close();
	  });
	  */
	});
});

// 插入数据
app.get('/insert', function (req, res) {
	conn.connect();
	var kid = Date.parse(new Date());
	var addSql = 'INSERT INTO xtest_keyid_ys(kid,content,auser,atime,aip) VALUES("'+kid+'",?,?,?,?)';
	var addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
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
	var modSqlParams = ['菜鸟dg站', 'https://dg.zfg360.com',2];
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

/*
var insertData = function(db, callback) {  
    //连接到表 site
    var collection = db.collection('site');
    //插入数据
    var data = [{"name":"菜鸟教程","url":"www.runoob.com"},{"name":"菜鸟工具","url":"c.runoob.com"}];
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}
 
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    insertData(db, function(result) {
        console.log(result);
        db.close();
    });
});
*/



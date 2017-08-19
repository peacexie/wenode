var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //var url = require('url');
  console.log(router); 
  res.send('respond with a test!!!!');
});


router.get('/act1', function(req, res, next) {

  var url = require('url');
  console.log(url);
  res.send('respond with a act1');
  
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
  
});

module.exports = router;

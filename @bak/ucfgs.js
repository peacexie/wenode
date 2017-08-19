
var config = {
    "debug" : true, // 调试标记
    /*
    "name" : "掌柜聊天服务端",
    "description" : "房掌柜聊天室nodejs+socket.io+mysql聊天室",
    "keywords" : "nodejs,socket.io,聊天室",
    //*/
	// host
    "host" : "192.168.1.228", // 228,4
    "port" : 8821,
    // mysql配置...
    "mysql" : {
        "host"     : "localhost",
        "user"     : "root",
        "password" : "root",
        "port"     : "3306",
        "database" : "news"
    },
    // filter配置
    /*
    "filtword" : "群发器;监听器;窃听器;发票",
    "filtroom" : {
        "room_1346",
    }, 
    "filtip" : {
        "192.168.1.258",
    },
    "filtuser" : {
        "peace_1348",
    },//*/
    // end
    "_flag" : "-End-",
};
module.exports = config;

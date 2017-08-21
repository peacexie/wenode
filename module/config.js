
var config = {
    "debug" : true, // 调试标记
    "logfile" : '/clog/Y-m-d.txt', // 调试日志
    "title" : "和平鸽-nodejs聊天室服务端",
	// host
    "host" : "127.0.0.1", // 228,4
    "port" : 8821,
    // mysql配置...
    "mysql" : {
        "host"     : "localhost",
        "user"     : "peace",
        "password" : "123456",
        "port"     : "3306",
        "database" : "txext_main"
    },
    "dbtab"  : "chatroom_ys",
    // 静态/禁访问:目录
    "dircfgs" : {
        '@bak'   : 'forbid',
        'client' : 'static',
        'clog'   : 'forbid',
        'module' : 'forbid',
        'static' : 'static',
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

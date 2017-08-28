
var config = {
    "debug" : true, // 调试标记
    "logfile" : '/cache/debug-Y-m-d.log', // 调试日志
    "title" : "Wenode - A mini Node.js App Framework!",
	// host
    "host" : "127.0.0.1", // 228,4
    "port" : 8821,
    // mysql配置...
    "mysql" : {
        "host"     : "localhost",
        "port"     : "3306",
        "user"     : "peace",
        "password" : "123456",
        "database" : "txext_main",
        "pre"      : "",
        "suf"      : "_ys"
    },
    // end
    "_flag" : "-End-",
};
module.exports = config;

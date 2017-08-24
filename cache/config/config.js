
var config = {
    "debug" : true, // 调试标记
    "logfile" : '/cache/Y-m-d.txt', // 调试日志
    "title" : "和平鸽-wenode",
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
    // 静态/禁访问:目录
    "dirs" : {
        '@bak'   : 'forbid',
        'cache'  : 'forbid',
        'client' : 'static',
        'static' : 'static',
        'module' : 'forbid',
    },
    // 视图目录:mkv/vop
    "dirv" : {
        'index' : 'mkv',
        'demo'  : 'mkv',
        'rest'  : 'data',
        'uext'  : 'viewop.js',
    },
    // end
    "_flag" : "-End-",
};
module.exports = config;

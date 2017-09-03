
// 系统配置
var config = {
    "debug" : 1, // 调试标记: 0-不记录, 1-控制台, file-文件
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
    // 数据模型
    "dbmod" : {
        // 聊天相关
        //"chatroom" : ["",  'id'],
        // 数据模型 : 类别(前缀)
        "nrem"     : ["coms", 'cid'],
        "news"     : ["docs",  'did'],
        "person"   : ["users", 'uid'],
    },
    // 静态/禁访问:目录
    "dirs" : {
        'client' : 'static',
        'static' : 'static',
        'cache'  : 'forbid',
        'module' : 'forbid',
    },
    // 视图目录:mkv/vop
    "dirv" : {
        'index' : 'mkv',
        'demo'  : 'mkv',
        'rest'  : 'vdata',
        'uapi'  : 'viewop.js',
    },
    // end
    "_flag" : "-End-",
};
module.exports = config;

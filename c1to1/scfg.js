
var config = {
    "debug" : true, // 调试标记
    "title" : "掌柜1to1聊天服务端",
	// host
    "host" : "192.168.1.228", // 228,4
    "port" : "8829",
    //"host" : "114.215.186.80", // 228,4
    //"port" : "8888",
    // wechat-api
    "weapi_host" : "haina.fzg360.com", // 192.168.1.228, haina.fzg360.com
    "weapi_path" : "/mobile.php/notice/tplmsg?key=b4Yf_kq@~7)y!D8",
    // mysql配置...
    "mysql" : {
        "host"     : "127.0.0.1", // 换成内网?
        "user"     : "peace",
        "password" : "123456",
        "port"     : "3306",
        "database" : "txext_main"
    },
    // end
    "_flag" : "-End-"
};
module.exports = config;

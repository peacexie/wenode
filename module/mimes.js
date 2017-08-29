
// mime头配置
var mimes = {

    // 
    "text" : {
        // text,html
        'txt'   : 'text/plain',
        'text'  : 'text/plain',
        // asp,aspx,jsp,php
        'htm'   : 'text/html',
        'html'  : 'text/html',
        // css,js,data(xml,json,jsonp)
        'css'   : 'text/css',
        'js'    : 'text/javascript', 
        'xml'   : 'text/xml', 
        'json'  : 'application/json',
        'jsonp' : 'application/jsonp',
    },

    // 
    "image" : {
        // image
        'ico'   : 'image/x-icon',
        'jpg'   : 'image/jpeg',
        'jpeg'  : 'image/jpeg',
        'gif'   : 'image/gif',
        'png'   : 'image/png',
        'tif'   : 'image/tiff',
    },

    // 
    "stream" : {
        // down
        'down'  : 'application/octet-stream',
    },

    // end
    "_flag" : "-End-",
};
module.exports = mimes;

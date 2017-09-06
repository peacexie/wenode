
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
        // font
        'eot'   : 'application/vnd.ms-fontobject',
        'ttf'   : 'application/x-font-ttf',
        'woff'  : 'application/font-woff',
        'svg'   : 'image/svg+xml',
    },

    // end
    "_flag" : "-End-",
};
module.exports = mimes;

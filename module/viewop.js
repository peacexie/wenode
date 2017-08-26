
var Config = require('./config'),
    Tools  = require('./tools'),
    Mimes = require('./mimes'),
    Mintpl = require('./mintpl'),
    dbData = require('./dbdata'),
    util   = require('util');

// mkv-显示
function ViewOP(req, res) {

    this.run = function(mkvs){
        var _me = this;
        new dbData(mkvs, res).run(function(data){
            _me.view(mkvs, data);
        });
    }

    // 显示操作
    this.view = function(mkvs, data){
        // 直接返回数据:vtype(html,json,jsonp,xml),callback
        var q = mkvs.query;
        if( (q.callback && !q.vtype) || (q.vtype && q.vtype!='html') ){
            vtype = (q.callback && !q.vtype) ? 'jsonp' : q.vtype;
            this.head(200, vtype);
            res.write(util.inspect(data));
            res.end();
            Tools.debug('data.'+vtype+' '+mkvs.path, q);
            return 
        }
        // 找模板
        var mtpl = new Mintpl(mkvs);
        var tplname = mtpl.get();
        if(tplname){
            // 模板显示
            this.head(200, 'html');
            var html = mtpl.fill(data);
            res.write(html);
            res.end();
            Tools.debug('http.'+200, '[tpl]/'+mkvs.dir+'/'+tplname+'?'+util.inspect(q));
        }else{
            // 模板错误
            var tpl = '/'+mkvs.dir+'/'+mkvs.mod+'/('+(mkvs.key+'|'+mkvs.type)+')';
            this.static(tpl+'.htm', 404);
        }
    }
    // 静态显示
    this.static = function(fp, code){
        var f4 = code==403 || code==404;
        if(f4){
            this.head(code, 'text');
            res.write('Error '+code+'!\n'+fp);
        }else{
            var cmine = this.mine(fp);
            var re = Tools.fsRead(fp, (cmine[0]=='image' ? 'binary' : 0));
            code = re.err ? 404 : 200;
            this.head(code, 0, cmine);
            if(code==404){
                re.data = 'Error 404, NOT found : '+fp;
                if(cmine[2]=='js') re.data = '\n// '+re.data+'\n';
                if(cmine[2]=='css') re.data = '\n/* '+re.data+' */\n';
            } 
            res.write(re.data, (cmine[0]=='image' ? 'binary' : 'utf-8'));
        }
        res.end();
        Tools.debug('http.'+code, fp);
    }
    // header
    this.head = function(code, ctype, cmine){
        code = code ? code : 200;
        if(ctype){
            cmine = this.mine(ctype);
        }
        res.writeHead(code, {'Content-Type':cmine[1]});
        return ctype;
    }
    // mine
    this.mine = function(fp){
        var ext = fp.indexOf('.')>0 ? fp.substring(fp.lastIndexOf(".")+1,fp.length) : fp;
        if(Mimes['text'][ext]){
            ctype = 'text';
            cmine = Mimes['text'][ext] + '; charset=utf-8';
        }else if(Mimes['image'][ext]){
            ctype = 'image';
            cmine = Mimes['image'][ext];
        }else{
            ctype = 'stream';
            cmine = Mimes['stream']['down'];
        }
        return [ctype, cmine, ext];
    }
};
module.exports = ViewOP;

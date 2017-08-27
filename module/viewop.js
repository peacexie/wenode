
var Config = require('./config'),
    Tools  = require('./tools'),
    Mimes = require('./mimes'),
    Mintpl = require('./mintpl'),
    dbData = require('./dbdata'),
    util   = require('util');

// mkv-显示
function ViewOP(req, res) {

    var mkvs={}, data={};

    this.run = function(mkp){
        mkvs = mkp;
        var _me = this;
        new dbData(mkvs, res).run(function(rep){
            data = rep;
            _me.view();
        });
    }
    // 显示操作
    this.view = function(){
        // 直接返回数据:vtype(html,json,jsonp,xml),callback
        if(Config.dirv[mkvs.dir]=='vdata'){
            return this.vdata();
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
            Tools.debug('http.200', '[tpl]/'+mkvs.dir+'/'+tplname+'?'+util.inspect(mkvs.query));
        }else{
            // 模板错误
            var tpl = '/'+mkvs.dir+'/'+mkvs.mod+'/('+(mkvs.key+'|'+mkvs.type)+')';
            this.static(tpl+'.htm', 404);
        }
    }
    // 纯数据显示
    this.vdata = function(){
        var q = mkvs.query;
        var vtype = q.vtype ? q.vtype : 'json';
        var json = util.inspect(data);
        var code = json=='{}' ? 404 : 200;
        this.head(code, vtype);
        if(code==200){
            if(vtype=='jsonp'){
                var cb = q.callback ? q.callback : 'cb';
                json = cb+'('+json+');';
                res.write(json);
            }else if(vtype=='xml'){
                var xml = this.xmlDoc(data);
                res.write(xml);
            }else{
                res.write(json);
            }
        }//else{ res.write(' '); }
        res.end();
        Tools.debug('data.'+code+'('+vtype+') '+mkvs.path, q); 
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

    this.xmlDoc = function(data){
        var xml = '';
        xml  = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
        xml += "<root>\n";
        xml += this.xmlRow(data, 'item', 'id');
        xml += "</root>\n";
        return xml;
    }
    this.xmlRow = function(data, item, id){
        var xml='', attr='', val='', ival='';
        if(util.isArray(data)){
            for(var i=0; i<data.length; i++) {
                attr = ' id="'+i+'"';
                ival = data[i]; val = ival;
                if(typeof(ival)=='object' || util.isArray(ival)){
                    val = this.xmlRow(ival, item, id);
                }else if(typeof(ival)=='string'){ 
                    val = ival.replace(/\&/g,"&amp;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
                }
                xml += "<"+item+attr+">"+val+"</"+item+">\n";
            }
        }else{
            for(var key in data){
                ival = data[key]; val = ival;
                if(typeof(ival)=='object' || util.isArray(ival)){
                    val = this.xmlRow(ival, item, id);
                }else if(typeof(ival)=='string'){ 
                    val = ival.replace(/\&/g,"&amp;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
                }
                xml += "<"+key+">"+val+"</"+key+">\n";
            }            
        }
        return xml;
    }

};
module.exports = ViewOP;

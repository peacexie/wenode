
var Config = require('./config'),
    Tools  = require('./tools'),
    url    = require("url"),
    util   = require('util'),
    fs     = require("fs");

function ViewOP(req, res) {

    this.read = function(fp){
        var data='', err=1;
        try{ // 不建议这样使用?!
            data = fs.readFileSync(_dir+fp, 'utf-8');
            err = 0;
        }catch(ex){}
        var re = {'err':err, 'data':data};
        return re;
    }

    this.static = function(fp, code){
        var f4 = code==403 || code==404;
        var re = this.read(f4  ? '/static/_404.htm' : fp);
        if(re.err || f4){
            code = code ? code : 400;
            this.head('html', code);
            res.write(re.data ? re.data.replace('Oops!','Error:'+code+'! ') : 'Error 404!');
        }else{
            this.head(fp, code);
            res.write(re.data);
        }
        res.end();
    }

    this.mkv = function(mkvs){
        var mkv3 = this.mkvsp(mkvs.mkv);
        var path = '/'+mkvs.dir+'/'+mkv3.mod + '/';
        var tpl = '';
        var fp = path + (mkv3.key) + '.htm';
        if(mkv3.key) tpl = this.read(_dir+fp);
        if(!tpl){
            fp = path + (mkv3.type) + '.htm';
            tpl = this.read(_dir+f2);
        } 
        if(tpl){
            // mkv 显示 
            res.write('mkv 显示 : template : ['+fp+'] ');
        }else{
            //var otpl = new Template(req, res);
            //otpl.static(mkvs.path,404);
            res.write('Error : template : ['+fp+'] NOT found!');
        }
        res.end();
        //vop.static(tpl,mkv3);
    }

    this.mkvsp = function(mkv3){
        var tmp=[], mod=key=view=type='';
        if(mkv3.indexOf('.')>0){
            tmp = mkv3.split('.');
            type = 'detail';
        }else if(mkv3.indexOf('-')>0){
            tmp = mkv3.split('-');
            type = 'mtype';
        }else{ // /about
            tmp[0] = mkv3;
            type = 'mhome';
        }
        if(tmp.length>3 || !tmp[0] || !tmp[tmp.length-1]) return {"err":1+':a'};
        for (var i = 0; i < tmp.length; i++) {
            var flag = /^[\w]{1,24}$/.test(tmp[i]);
            if(!tmp[i] || !flag) return {"err":1+':b'+':'+tmp[i]+':'+flag};
        }
        mod = tmp[0];
        if(type!='mhome'){
            key = tmp[1];
            view = tmp.length==3 ? tmp[2] : '';
        }
        return {"err":0,"mod":tmp[0],"key":key,"view":view,"type":type};
    }


    // header
    this.head = function(fp, code){
        ext = fp.indexOf('.')>=0 ? fp.substring(fp.lastIndexOf(".")+1,fp.length) : fp;
        cfgs = {
            'text'  : 'text/plain',
            'html'  : 'text/html',
            'css'   : 'text/css',
            'js'    : 'text/javascript', 
            'json'  : 'application/json',
            'jsonp' : 'application/jsonp',
            'xml'   : 'text/xml', 
            'down'  : 'application/octet-stream',
        };
        code = code ? code : 200;
        type = cfgs[ext] ? cfgs[ext] : cfgs['html']; //console.log(code,ext,type,cfgs[ext]);
        res.writeHead(code, {'Content-Type' : type+'; charset=utf-8'});
    }


};
module.exports = ViewOP;
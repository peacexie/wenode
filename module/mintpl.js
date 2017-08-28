
var Config = require('./config'),
    Tools  = require('./tools'),
    Mintag = require('./mintag'),
    util   = require('util'),
    fs     = require('fs');

function Mintpl(mkvs) {

    var dir, tplname='';

    // 通过mkv得到模板:news/detail
    this.get = function(){
        dir = '/'+mkvs.dir+'/';
        var tpl1 = mkvs.mod + '/' + mkvs.key;
        var tpl2 = mkvs.mod + '/' + mkvs.type;
        var flag = 0;
        if(mkvs.key) flag = Tools.fsHas(dir+tpl1+'.htm');
        if(flag){ 
            tplname = tpl1;
            return tpl1;
        }
        flag = Tools.fsHas(dir+tpl2+'.htm');
        if(flag){ 
            tplname = tpl2;
            return tpl2;
        }
        return '';
    }

    // 填充tpl: index, home/about
    this.fill = function(data) { 
        var html = this.read(tplname);
        // {use:"news/mtype"}
        var reg = new RegExp(/\{use:\"([\S]{3,48})\"\}/, 'gi');
        var itms = reg.exec(html);
        if(itms && itms[1]){
            html = this.read(itms[1]);    
        }
        // imp,继承; inc,包含
        html = this.imp(html); // 模板继承; 
        html = this.inc(html); // 模板包含; 
        html = new Mintag(html).run(data, mkvs); // tag解析; 
        return html;
    };


    // inc:模板包含
    this.inc = function(html) { 
        var reg = new RegExp(/{inc:\"(.*)\"}/, 'gi');
        itms = html.match(reg); 
        if(!itms) return html; //没有inc
        for (var i=0; i<itms.length; i++) {
            var tpl = itms[i].replace('{inc:"', '').replace('"}', '');
            var sinc = this.read(tpl);
            if(!sinc){ sinc = "<!-- {inc:`"+tpl+"`} -->"; }
            html = html.replace(itms[i], sinc);
            return this.inc(html);
        }
        return html;
    }

    // imp:模板继承
    this.imp = function(html) { 
        var reg = new RegExp(/\{imp:\"([\S]{3,48})\"\}/, 'gi');
        var itms = reg.exec(html);
        if(!itms || !itms[1]) return html; //没有imp
        var layout = this.read(itms[1]);
        reg = new RegExp(/\{block:([\w]{1,24})\}/, 'gi');
        itms = layout.match(reg); //Tools.debug(itms); 
        if(!itms) return layout; //没有block
        for (var i=0; i<itms.length; i++) {
            var k1 = itms[i], k2 = k1.replace('{block:', '{/block:');
            var blk1 = Tools.getPos(html, k1, k2),
                blkp = Tools.getPos(layout, k1, k2); 
            if(blk1=='{:clear}'){
                layout = layout.replace(k1+blkp+k2, '');
            }else if(blk1){
                if(blk1.indexOf('{:parent}')>=0) blk1 = blk1.replace("{:parent}", blkp);
                layout = layout.replace(k1+blkp+k2, blk1);
            }
            layout = layout.replace(k1, '').replace(k2, ''); // {:parent}
        }
        return layout;
    }

    // read:imp/inc
    this.read = function(tpl) { 
        var fp = tpl.indexOf(':')>0 ? '/'+tpl.replace(':','/') : dir+tpl;
        data = Tools.fsRead(fp+'.htm', 0, 1);
        return data;
    }

};
module.exports = Mintpl;

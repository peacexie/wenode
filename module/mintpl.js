
var Config = require('./config'),
    Tools  = require('./tools'),
    util   = require('util'),
    fs     = require("fs");

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
        res = Tools.fsRead(dir+tplname+'.htm');
        // imp,继承; inc,包含
        // data; tags; 
        html = this.imp(res.data); // 模板继承; 
        html = this.inc(html); // 模板包含; 
        //html = this.tag(html); // tag解析; 
        html = this.vals(html,mkvs,'mkvs');
        html = this.vals(html,data,'data');
        return html;
    };

    // inc:模板包含
    this.tag = function(html) { 
        return html;
    }

    // inc:模板包含
    this.inc = function(html) { 
        var reg = new RegExp(/{inc:\"(.*)\"}/,'gi');
        itms = html.match(reg); 
        if(!itms) return html; //没有inc
        for (var i=0; i<itms.length; i++) {
            var tpl = itms[i].replace('{inc:"','').replace('"}','');
            var sinc = Tools.fsRead(dir+tpl+'.htm',1);
            if(!sinc){ sinc = "<!-- {inc:`"+tpl+"`} -->"; }
            html = html.replace(itms[i],sinc);
            return this.inc(html);
        }
        return html;
    }

    // imp:模板继承
    this.imp = function(html) { 
        var reg = new RegExp(/\{imp:\"([\S]{3,48})\"\}/,'gi');
        var itms = reg.exec(html);
        if(!itms || !itms[1]) return html; //没有imp
        var layout = Tools.fsRead(dir+itms[1]+'.htm',1);
        reg = new RegExp(/\{block:([\w]{1,24})\}/,'gi');
        itms = layout.match(reg); //Tools.debug(itms); 
        if(!itms) return layout; //没有block
        for (var i=0; i<itms.length; i++) {
            var k1 = itms[i], k2 = k1.replace('{block:','{/block:');
            var blk1 = Tools.getPos(html,k1,k2),
                blkp = Tools.getPos(layout,k1,k2); 
            if(blk1=='{:clear}'){
                layout = layout.replace(k1+blkp+k2, '');
            }else if(blk1){
                if(blk1.indexOf('{:parent}')>=0) blk1 = blk1.replace("{:parent}", blkp);
                layout = layout.replace(k1+blkp+k2, blk1);
            }
            layout = layout.replace(k1,'').replace(k2,''); // {:parent}
        }
        return layout;
    }

    // 替换数据
    this.vals = function(html,arr,fix){
        var reg = new RegExp(/\{\$([\w]{1,24})\.([\w]{1,24})\}/,'gi');
        return html.replace(reg, function(m, p1, p2) {
            if(p1==fix){
                if(typeof(arr[p2])=='undefined') return '{'+fix+'.'+p2+'}';
                if(typeof(arr[p2])=='object' || typeof(arr[p2])=='function') arr[p2] = util.inspect(arr[p2]);
                return arr[p2]; 
            }else{
                return m;
            }
        });
    };



};
module.exports = Mintpl;


/*

{imp:"m_about/about_alayout"}
{inc:"c_pub/ahead"}
{js}var abc = 0; {/js}

{$abc}

{tag:newsList=[p1=a][p2=b]/tag}

{tag:dlist=[Page][modid,$this->mod][join,detail][show,1][stype][keywd][limit,10]}
{:row}
<li>{title($t_title,96,$v)}</li>
{/row}
<li>{title(page.bar)}</li>
{/tag:dlist}

    /*
    mkvs.xxxx
    data.xxxx
    */

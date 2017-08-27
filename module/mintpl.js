
var Config = require('./config'),
    Tools  = require('./tools'),
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
        html = this.tag(html, data); // tag解析; 
        html = this.vals(html, data.rdb, 'rdb');
        html = this.vals(html, data.rex, 'rex');
        html = this.vals(html, mkvs, 'mkvs');
        html = this.vals(html, Config, 'config');
        return html;
    };

    // inc:模板包含
    this.tag = function(html, data) { 
        reg = new RegExp(/\{tag:([\w|\.]{1,24})\}/, 'gi');
        itms = html.match(reg); // {tag:data.rex}, <p><i>{$title}</i>{$detail}</p>
        if(!itms) return html; //没有tag
        for (var i=0; i<itms.length; i++) {
            var k1 = itms[i], k2 = k1.replace('{tag:', '{/tag:');
            var tpl = Tools.getPos(html, k1, k2); 
            var vtag = this.vtag(k1, data);
            var list = '';
            var reg = new RegExp(/\{\$([\w]{1,24})\}/, 'gi');
            for(var key in vtag){
                list += tpl.replace(reg, function(m, p1) {
                    if(typeof(vtag[key][p1])=='undefined') return '{'+p1+'}';
                    if(typeof(vtag[key][p1])=='object' || typeof(vtag[key][p1])=='function') vtag[key][p1] = util.inspect(vtag[key][p1]);
                    return vtag[key][p1]; 
                });
            }
            html = html.replace(k1+tpl+k2, list);
        }
        return html;
        /*
            {tag:data.rex}
            <p><i>{$title}</i><br>{$detail}</p>
            {/tag:data.rex}
        */
    }

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

    // {tag:data.rex}
    this.vtag = function(tag, data){
        var arr = tag.replace('{tag:','').replace('}','').split('.');
        var dre={}, tmp={};
        for(var i=0; i<arr.length; i++){
            if(arr[i]=='data'){ tmp = data; }
            else{ dre = tmp[arr[i]]; tmp=dre; }
        }
        return dre;
    }

    // 替换数据
    this.vals = function(html, arr, fix){
        if(!arr) return html;
        var reg = new RegExp(/\{\$([\w]{1,24})\.([\w]{1,24})\}/, 'gi');
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

    // read:imp/inc
    this.read = function(tpl) { 
        var fp = tpl.indexOf(':')>0 ? '/'+tpl.replace(':','/') : dir+tpl;
        data = Tools.fsRead(fp+'.htm', 0, 1);
        return data;
    }

};
module.exports = Mintpl;


/*

{tag:newsList=[p1=a][p2=b]/tag}

{tag:dlist=[Page][modid,$this->mod][join,detail][show,1][stype][keywd][limit,10]}
{:row}
<li>{title($t_title,96,$v)}</li>
{/row}
<li>{title(page.bar)}</li>
{/tag:dlist}

*/


var Config = require('./config'),
    Tools  = require('./tools'),
    util   = require('util'),
    fs     = require('fs');

function Voptag(html) {

    // run
    this.run = function(data, mkvs){
        this.conv();
        this.list(data); // tag解析; 
        this.vals(data.rdb, 'rdb');
        this.vals(data.rex, 'rex');
        this.vals(mkvs, 'mkvs');
        this.vals(Config, 'config');
        /*
        var str = 'abc为为你好dssds你好你好你好你好你好你好你好你好', str2='';
        str2 = Tools.cutStr(str, 2);  Tools.debug('aaa: 02:', str2);
        str2 = Tools.cutStr(str, 3);  Tools.debug('aaa: 03:', str2);
        str2 = Tools.cutStr(str, 5);  Tools.debug('aaa: 05:', str2);
        str2 = Tools.cutStr(str, 8);  Tools.debug('aaa: 08:', str2);
        str2 = Tools.cutStr(str, 9);  Tools.debug('aaa: 09:', str2);
        str2 = Tools.cutStr(str, 10); Tools.debug('aaa: 10:', str2);
        //*/
        this.date();
        this.cut();
        return html;
    }

    this.conv = function() { //{func({$title},12,...)}
        reg = new RegExp(/\{(cut|opt|title|thumb)\(\{\$([\w]+)\}\,/, 'gi'); // |date
        itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace(/\}\,/g,'}<utag/>,'); 
            html = html.replace(itms[i], val); // /g?
        }
    }

    this.date = function() { // {date(1234567890,Y-m-d)}
        reg = new RegExp(/\{date\(([\w|\,|\-|\:|\.| ]{8,32})\)\}/, 'gi');
        itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace('{date(','').replace(')}','');
            var arr = val.split(','), stamp = arr[2] ? 1 : 0;
            var date = Tools.fmtStamp(arr[0], arr[1], stamp); 
            html = html.replace(itms[i], date); // /g?
        }
    }

    this.cut = function() { // {cut(title,24)}
        reg = new RegExp(/\{cut\(([^\n\r]+)\)\}/, 'gi');
        itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            /*
            var val = itms[i].replace('{cut(','').replace(')}','');
            var ar0 = val.split('<utag/>,');
            var arr = ar0[1].split(','), dot = arr[1] ? arr[1] : '';
            var sub = Tools.cutStr(ar0[0], arr[0], dot); 
            html = html.replace(itms[i], sub, '...'); // /g?
            */
        }
    }

    // list:标签
    this.list = function(data) { 
        reg = new RegExp(/\{list:([\w|\.]{1,24})\}/, 'gi');
        itms = html.match(reg); // {list:data.rex}, <p><i>{$title}</i>{$detail}</p>
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var k1 = itms[i], k2 = k1.replace('{list:', '{/list:');
            var tpl = Tools.getPos(html, k1, k2); 
            var vtag = this.varr(k1, data);
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
        /*
            {list:data.rex}
            <p><i>{$title}</i><br>{$detail}</p>
            {/list:data.rex}
        */
    }

    // 标签数组 : {list:data.rex}
    this.varr = function(tag, data){
        var arr = tag.replace('{list:','').replace('}','').split('.');
        var dre={}, tmp={};
        for(var i=0; i<arr.length; i++){
            if(arr[i]=='data'){ tmp = data; }
            else{ dre = tmp[arr[i]]; tmp=dre; }
        }
        return dre;
    }

    // 替换数据
    this.vals = function(arr, fix){
        if(!arr) return;
        var reg = new RegExp(/\{\$([\w]{1,24})\.([\w]{1,24})\}/, 'gi');
        html = html.replace(reg, function(m, p1, p2) {
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
module.exports = Voptag;


/*

{list:data.rex}
<p><i>{$title}</i><br>{$detail}</p>
{/list:data.rex}

<li>{cut($t_title,96,$v)}</li>
<li>{date(1234567890,'Y-m-d')}</li>

<li>{opt({},'<span class='itm-(k)'>(v)</span>')}</li>
<li>{title('hn','china')}</li> 'hn'=>'湖南'
<li>{thumb($t_title,96,$v)}</li>

*/


var Config = require('./config'),
    Tools  = require('./tools'),
    util   = require('util'),
    fs     = require('fs');

function Voptag(html) {

    // run
    this.run = function(data, mkvs){
        this.list(data); // tag解析; 
        this.vals(data.rdb, 'rdb');
        this.vals(data.rex, 'rex');
        this.vals(mkvs, 'mkvs');
        this.vals(Config, 'config');
        return html;
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

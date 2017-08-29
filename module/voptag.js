
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
        this.date();
        this.cut();
        //this.opt();
        //this.title();
        //this.thumb();
        return html;
    }
    // 为大段文本添加一个后缀`<ys/>`, 以便后续方法解析
    this.conv = function() { // {func({$title},12,...)}
        reg = new RegExp(/\{(cut|opt|title|thumb)\(\{\$([\w]+)\}\,/, 'gi'); // |date
        itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace(/\}\,/g,'}<ys/>,');
            html = html.replace(itms[i], val); // /g?
        }
    }

    this.date = function() { // {date({$atime},Y-m-d H:i)}
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

    this.cut = function() { // {cut({$title},18,...)}
        reg = new RegExp(/\{cut\(([^\n\r]+)\)\}/, 'gi');
        itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace('{cut(','').replace(')}','');
            if(val.indexOf('<ys/>')<=0) return;
            var ar0 = val.split('<ys/>,');
            var ar1 = ar0[1].split(','), dot = ar1[1] ? ar1[1] : '';
            var sub = Tools.cutStr(ar0[0], ar1[0], dot); 
            html = html.replace(itms[i], sub, '...'); // /g?
        }
    }

    // list:标签
    this.list = function(data) { // {list:data.rex}<li>{$title}</li>{/list:data.rex}
        reg = new RegExp(/\{list:([\w|\.]{1,24})\}/, 'gi');
        itms = html.match(reg);
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
                    if(typeof(vtag[key][p1])=='object') vtag[key][p1] = util.inspect(vtag[key][p1]);
                    return vtag[key][p1]; 
                });
            }
            html = html.replace(k1+tpl+k2, list);
        }
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
                if(typeof(arr[p2])=='object') arr[p2] = util.inspect(arr[p2]);
                return arr[p2]; 
            }else{
                return m;
            }
        });
    };

};
module.exports = Voptag;


/*

{list:data.rdb}
<li><a href="/demo/news.{$did}">{cut({$title},18,...)}</a> <i>{date({$atime},Y-m-d H:i)}</i></li>
{/list:data.rdb}

<li>{opt({},'<span class='itm-(k)'>(v)</span>')}</li>
<li>{title('hn','china')}</li> 'hn'=>'湖南'
<li>{thumb($t_title,96,$v)}</li>

*/

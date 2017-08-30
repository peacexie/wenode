
var Config = require('./config'),
    Tools  = require('./tools'),
    util   = require('util'),
    fs     = require('fs');

// 标签:解析/替换
function Voptag(html) {

    var subtpls = [];

    // run
    this.run = function(data, mkvs){
        this.conv();
        this.list(data); // 列表解析; 
        this.vals(data.rdb, 'rdb');
        this.vals(data.rex, 'rex');
        this.vals(mkvs, 'mkvs');
        this.vals(Config, 'config');
        this.sub();
        this.date();
        this.cut();
        //this.title();
        //this.thumb();
        return html;
    }
    // 转换数据, 以便后续方便解析
    this.conv = function() { // {func({$title},12,...)}
        // 子列表模板
        var subtstr = Tools.getPos(html, '<start=subtpls>', '<end=subtpls>');
        if(subtstr){
            subtpls = subtstr.split('<ys/>');
            html = html.replace(subtstr, '');
        }
        // 为大段文本添加一个后缀`<ys/>`
        var reg = new RegExp(/\{(cut|sub|title|thumb)\(\{\$([\w]+)\}\,/, 'gi'); // |date
        var itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace(/\}\,/g,'}<ys/>,');
            html = html.replace(itms[i], val); // /g?
        }
    }

    // 时间戳转日期时间 {date({$atime},Y-m-d H:i)}
    this.date = function() {
        var reg = new RegExp(/\{date\(([\w|\,|\-|\:|\.| ]{8,32})\)\}/, 'gi');
        var itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace('{date(','').replace(')}','');
            var arr = val.split(','), stamp = arr[2] ? 1 : 0;
            var date = Tools.fmtStamp(arr[0], arr[1], stamp); 
            html = html.replace(itms[i], date); // /g?
        }
    }
    // 字符串截取 {cut({$title},18,...)}
    this.cut = function() {
        var reg = new RegExp(/\{cut\(([^\n\r]+)\)\}/, 'gi');
        var itms = html.match(reg);
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

    // 子列表 {sub({$times},1)} // 定义id=1的模板
    this.sub = function() { // 
        var reg = new RegExp(/\{sub\(([^<]+)\<ys\/\>\,([\w]{1,24})\)\}/, 'gi');
        var itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var val = itms[i].replace('{sub(','').replace(')}',''); 
            if(val.indexOf('<ys/>')<=0) return;
            var ar0 = val.split('<ys/>,'); val = ar0[0]; 
            var ar1 = ar0[1].split(','), tplid = ar1[0], sp = ar1[1] ? ar1[1] : ','; 
            var sitm = this.sitm(val, tplid, sp);
            html = html.replace(itms[i], sitm, '...'); // /g?
        }
    }
    // {sitm({ user: 502557, nice: 0, sys: 468065, idle: 20318849, irq: 1388 }, 1, ,)}
    this.sitm = function(data, tplid, sp) { //
        var tpl = typeof(subtpls[tplid]=='string') ? subtpls[tplid] : '';
        if(data.indexOf(':')>0 && data.match(/^[\{]/) && data.match(/[\}]$/)){
            try{ eval('var _arr = '+data); }catch(err){}
        }else if(data.indexOf(sp)>0){
            var _arr = data.split(sp);
        }
        if(typeof(_arr)!='undefined'){
            data = Tools.tplFill(tpl, _arr);
        }
        return data; //data
    }

    // list:标签 {list:data.rex}<li>{$title}</li>{/list:data.rex}
    this.list = function(data) {
        var reg = new RegExp(/\{list:([\w|\.]{1,48})\}/, 'gi');
        var itms = html.match(reg);
        if(!itms) return; //没有tag
        for (var i=0; i<itms.length; i++) {
            var k1 = itms[i], k2 = k1.replace('{list:', '{/list:');
            var tpl = Tools.getPos(html, k1, k2); 
            var vtag = this.varr(k1, data);
            var list = '';
            var reg = new RegExp(/\{\$([\w]{1,48})\}/, 'gi');
            for(var key in vtag){
                var srow = Tools.tplFill(tpl, vtag[key]);
                srow = srow.replace(/\{id\:key\}/gi, key);
                list += srow;
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

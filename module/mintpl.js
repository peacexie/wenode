
var Config = require('./config'),
    Tools  = require('./tools'),
    util   = require('util'),
    fs     = require("fs");

function Mintpl(tpl,dir) {

    // index, home/about
    this.run = function(mkvs,mkv3) { 
        re = Tools.fsRead(dir+tpl+'.htm');
        // imp,继承; inc,包含
        // data; tags; 
        data = re.data;
        data = this.vals(data,mkvs,'mkvs');
        data = this.vals(data,mkv3,'mkv3');
        return data;
    };

    this.vals = function(html,arr,fix){
        //var reg =/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; 
        //var reg = new RegExp(key + "=([^(&|#)]*)",'ig');
        //var reg = new RegExp("\{$mkvs.([\w]{1,24})\}",'ig');
        return html.replace(/\{\$mkvs\.([\w]{1,24})\}/ig, function(m, p) { // ok
        //return html.replace(reg, function(m, p) {
            var tmp = arr[p];
            if(typeof(tmp)=='object' || typeof(tmp)=='function') tmp = util.inspect(tmp);
            return tmp || '['+p+']';
        });
    };

};
module.exports = Mintpl;


/*

{imp:"m_about/about_alayout"}
{inc:"c_pub/ahead"}
{js}var abc = 0; {/js}

{$abc}

{tag:dlist=[Page][modid,$this->mod][join,detail][show,1][stype][keywd][limit,10]}
{:row}
<li>{title($t_title,96,$v)}</li>
{/row}
<li>{title(page.bar)}</li>
{/tag:dlist}

    /*
    mkvs.xxxx
    mkv3.xxxx
    data.xxxx
    */

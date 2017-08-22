
var Config = require('./config'),
    Tools  = require('./tools'),
    util   = require('util'),
    fs     = require("fs");

function Mintpl(tpl,dir) {

    // index, home/about
    this.run = function(mkvs) { 
        re = Tools.fsRead(dir+tpl+'.htm');
        // imp,继承; inc,包含
        // data; tags; 
        html = re.data;
        html = this.vals(html,mkvs,'mkvs');
        //var data = xxx();
        //html = this.vals(html,data,'data');
        return html;
    };

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


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
        html = re.data;
        html = this.vals(html,mkvs,'mkvs');
        html = this.vals(html,mkv3,'mkv3');
        //var data = xxx();
        //html = this.vals(html,data,'data');
        return html;
    };

    this.vals = function(html,arr,fix){
        var reg = new RegExp(/\{\$([\w]{1,24})\.([\w]{1,24})\}/,'gi');
        return html.replace(reg, function(m, fiy, p) {
            if(fiy==fix){
                var tmp = arr[p]; if(!tmp) return '{'+fix+'.'+p+'}';
                if(typeof(tmp)=='object' || typeof(tmp)=='function') tmp = util.inspect(tmp);
                return tmp; 
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
    mkv3.xxxx
    data.xxxx
    */

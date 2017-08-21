
var Config = require('./config'),
    Tools  = require('./tools'),
    fs     = require("fs");

function Mintpl(tpl,dir) {

    // index, home/about
    this.run = function(mkvs,mkv3) { 
        re = Tools.fsRead(dir+tpl+'.htm');
        // imp,继承; inc,包含
        // data; tags; 
        data = re.data;
        data = this.vals(data,mkvs,'mkvs');
        return data;
    };

    this.vals = function(html,arr,fix){
        var reg =/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; 
        return html.replace(/\{\$mkvs\.([^\}]*)\}/ig, function(m, p) {
            return arr[p] || '['+p+']';
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

<?php
// 模板编译 类
class vopComp{

    //模板编译 ---------- 
    function build($tpl){ 
        global $_cbase; 
        $re = self::checkTpls($tpl);
        $_cbase['run']['comp'] = $tpl; //当前编译模板,js标签中使用
        $content = comFiles::get($re[0]);
        $content = $this->bcore($content); //获取经编译后的内容
        $shead = "(!defined('RUN_INIT')) && die('No Init'); \n\$this->tagRun('tplnow','$tpl','s');";
        $fptex = '/b_func/tex_base.php'; $spend = '';
        if(file_exists(vopTpls::path().$fptex)){
            $shead .= "\ninclude_once vopTpls::path().'$fptex';";
            $shead .= "\nif(method_exists('tex_base','init')){ tex_base::init(\$this); }";
            $spend = "<?php\nif(method_exists('tex_base','pend')){ tex_base::pend(); }\n?>";
        }
        comFiles::put($re[1], "<?php \n$shead \n?>\n".$content.$spend); //写入缓存
        return $re[1];
    }

    //模板编译核心
    function bcore($template=''){
        $template = self::impBlock($template); // 解析模板继承
        $template = self::incTpls($template); // 解析{inc},
        $template = self::phpBasic($template); //基本php语法解析
        $template = self::phpFlow($template); //流程控制语句
        $template = self::incCodes($template); // 解析{code}
        $template = vopCTag::tagMain($template); //系统标签解析
        return $template;
    }

    
    // 基本php语法解析, 常量,变量,函数,php代码
    static function phpBasic($template=''){
        //常量解析
        $template = preg_replace ( "/\{([A-Z_][A-Z0-9_]*)\}/s", "<?php echo \\1;?>", $template );    
        /*将变量{$name}替换成<?php  echo $name; ?>,可以是数组 $name, $re1['title'], $this->mod, $this->ucfg['q'] */
        $template = preg_replace("/{(\\$[a-zA-Z_][\w\.\"\'\[\]\$\-\>\:]{0,64})}/i", "<?php echo @$1; ?>", $template);//替换变量
        /*
        $html = preg_replace_callback(
            '(<h([1-6])>(.*?)</h\1>)',
            function ($m) {
                return "<h$m[1]>" . strtoupper($m[2]) . "</h$m[1]>";
            },
            $html
        );*/

        // ----------------------------
        /* php标签
            {= date('Y-m-d'); }     =>  <?php echo date('Y-m-d'); ?>
            {php echo phpinfo();}    =>    <?php echo phpinfo(); ?>
         */
        $template = preg_replace ( "/\{=\s+([^}]+)\}/", "<?php echo \\1?>", $template );
        $template = preg_replace ( "/\{php\s+([^}]+)\}/", "<?php \\1?>", $template );
        // ----------------------------
        /* 函数 标签
            {date('Y-m-d H:i:s')}    =>    <?php echo date('Y-m-d H:i:s');?> 
            {$date('Y-m-d H:i:s')}    =>    <?php echo $date('Y-m-d H:i:s');?> 
        $template = preg_replace ( "/\{([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff:]*\(([^{}]*)\))\}/", "<?php echo \\1;?>", $template );
        $template = preg_replace ( "/\{(\\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff:]*\(([^{}]*)\))\}/", "<?php echo \\1;?>", $template );
        */
        // ----------------------------
        return $template;
    }
    
    //模板解析 流程控制语句(Flow control statements)
    static function phpFlow($template){
        /* if 标签
            {if $name==1}        =>    <?php if ($name==1){ ?>
            {elseif $name==2}    =>    <?php } elseif ($name==2){ ?>
            {else}                =>    <?php } else { ?>
            {/if}                =>    <?php } ?>
        */
        $template = preg_replace ( "/\{if\s+(.+?)\}/", "<?php if(\\1) { ?>", $template );
        $template = preg_replace ( "/\{else\}/", "<?php } else { ?>", $template );
        $template = preg_replace ( "/\{elseif\s+(.+?)\}/", "<?php } elseif (\\1) { ?>", $template );
        $template = preg_replace ( "/\{\/if\}/", "<?php } ?>", $template );
        // ----------------------------
        /* for 标签
            {for $i=0;$i<10;$i++}    =>    <?php for($i=0;$i<10;$i++) { ?>
            {/for}                    =>    <?php } ?>
        */
        $template = preg_replace("/\{for\s+(.+?)\}/","<?php for(\\1) { ?>",$template);
        $template = preg_replace("/\{\/for\}/","<?php } ?>",$template);
        // ----------------------------
        /* loop 标签
            {loop $arr $vo}            =>    <?php $n=1; if (is_array($arr) foreach($arr as $vo){ ?>
            {loop $arr $key $vo}    =>    <?php $n=1; if (is_array($array) foreach($arr as $key => $vo){ ?>
            {/loop}                    =>    <?php $n++;}unset($n) ?>
        */
        $template = preg_replace ( "/\{loop\s+(\S+)\s+(\S+)\}/", "<?php if(is_array(\\1)) foreach(\\1 as \\2) { ?>", $template );
        $template = preg_replace ( "/\{loop\s+(\S+)\s+(\S+)\s+(\S+)\}/", "<?php \$n=1; if(is_array(\\1)) foreach(\\1 as \\2 => \\3) { ?>", $template );
        $template = preg_replace ( "/\{\/loop\}/", "<?php } ?>", $template );
        // ----------------------------
        // {php}{/php} 标签 --- 可在前后添加 <!--, --> 以便在html中显示调试
        $_aorg = array('{php} ','{php}','{/php}','<!--<?php','?>-->');
        $_aobj = array('{php}','<?php ','?>','<?php','?>');
        $template = str_replace ( $_aorg, $_aobj, $template );
        // ----------------------------
        return $template;
    }
    

    
}
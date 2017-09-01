<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0,user-scalable=no">
<title>layout</title>
<style type="text/css">
.out{ width:760px; margin:auto; }
.block{ width:50%; float:left; }
@media only screen and (min-width:1150px){
    .out{ width:1140px; margin:auto; background:#CCC;  }
    .block{ width:33.33%; float:left; }
} /*>=1150(1200)的设备*/
@media only screen and (max-width:764px){
    .out{ width:100%; max-width:240px; max-width:380px; margin:auto; }
    .block{ width:100%; float:none; }
} /*<=764(768)的设备*/
.in{ padding:10px; margin:10px; border:1px solid #CCC; }
.in h1{ font-size:18px; padding:2px; margin:2px; }
.in h1 .tg1{ float:right; font-size:smaller; }
.in p{ border-top:1px dashed #CCC; padding:5px 0px; margin:10px 5px; }
</style>
</head>

<body>

<!--
380x2 = 760    768, 800, 1024
380*3 = 1140   1200+
```
    typeof define === 'function' && define({siteAreas:siteAreas,cityArr:cityArr,cityLine:cityLine});
```
wenode, imcat, yscode, javabox, txasp, (code,baby,links)
-->

<div class="head">
    
</div>

<div class="out">
    <?php for($i=0;$i<3;$i++){ ?>
    <?php for($j=0;$j<3;$j++){ ?>
        <div class="block"><div class="in">
        <h1><span class="tg1">php</span>标题<?="$i$j"?></h1>
        <p>Testx, LoopA<?=$i?>, LoopB<?=$j?></p>
        <p>Testx, LoopA<?=$i?>, LoopB<?=$j?></p>
        <p>Testx, LoopA<?=$i?>, LoopB<?=$j?></p>
        </div></div>
    <?php }} ?>
</div>

<div class="foot">
    
</div>

</body>
</html>

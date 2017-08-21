
//---------------------------------------------------
// *** 基础函数2
//--------------------------------------------------- \

/*
String.prototype.replaceAll = function (findText, repText){
    var newRegExp = new RegExp(findText, 'gm');
    return this.replace(newRegExp, repText);
}*/

// 调试信息
function jsLog(msg,color){
	// ?? debug模式
	if(window.console){ 
		var cstr = '';
		if(color){
			var cstr = 'color:'+color;
			msg = '%c'+msg;
		}
		console.log(msg,cstr);
	}else{
		;//	
	}
}

function jsGuid(){ 
	return (new Date).getTime() + Math.random().toString();
}
function urlRnd(url,fix){
	if(!fix) fix = '__rndUrl__';
	guid = jsGuid();
	url += (url.indexOf('?')>0 ? '&' : '?')+fix+'='+guid; 
	return url;
}

// Js动态获取js脚本
function jsImps(url,callback){     
	url = urlRnd(url);
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement('script');
	script.onload = script.onreadystatechange = script.onerror = function (){
		if (script && script.readyState && /^(?!(?:loaded|complete)$)/.test(script.readyState)) return;
		script.onload = script.onreadystatechange = script.onerror = null;
		script.src = '';
		script.parentNode.removeChild(script);
		script = null;
		if(callback){ 
			var func = callback + (callback.indexOf('()')<=0 ? '' : '()');
			eval(""+func+";");
		}
	}
	script.charset = "utf-8";
	script.src = url;
	try { head.appendChild(script); } 
	catch (exp) {}
}

// Js动态获取data内容
function jsHttp(url,callback){
    url = urlRnd(url);
	var http = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Msxml2.XMLHttp"); 
    http.open("get", url, true);  
    http.onreadystatechange = function(){
		if (http.readyState == 4) {  
			if (http.status == 200) {  
				__httpData__ = http.responseText; //(__httpData__)固定写法
				if(callback){ 
					var func = callback + (callback.indexOf(')')<=0 ? '()' : ''); 
					eval(""+func+";");
				}else{
					console.log(http.responseText);
				}
			}  
		}  
	} 
    http.send(null); 
}

//---------------------------------------------------
// *** 基础函数
//--------------------------------------------------- \

var jsElm = {}; //通过id得到web相关元素
jsElm.pdID = function(id){ // 获取iframe父窗口id对应的web元素
	return typeof id == 'string' ? parent.document.getElementById(id) : id; 
}
jsElm.ifID = function(id){ // 获取iframe，id为iframe的对应ID
	return document.getElementById(id).contentWindow;
	//return window.frames[id]; //id为name值
}
jsElm.jeID = function(id){ // 通过id得到web元素
	return typeof id == 'string' ? document.getElementById(id) : id;
}

// 查找e元素的前一个/下一个/父元素,且元素名称为tag
function jeFind(e,tag,type) {
	e = jsElm.jeID(e); var f;
	if(type=='prev') f = e.previousSibling;
	else if(type=='next') f = e.nextSibling;
	else f = e.parentNode; 
	try{
		while(f.nodeType==3){
			if(type=='prev') f = f.previousSibling;
			if(type=='next') f = f.nextSibling;
		}
	}catch(ex){ return null; }
	if(f.tagName.toLowerCase()==tag) return f;
	else return jeFind(f,tag,type);
}
// 显示/隐藏e元素
function jeShow(xID){
  var elm = jsElm.jeID(xID); 
  if(!elm) return;
  if(elm.style.display=='none') { elm.style.display = ''; }
  else { elm.style.display = 'none'; } 
} 
// 居中显示div，xOffset:百分比
function jeCenter(xID,xOffset){
	var elm = jsElm.jeID(xID); 
	var oSize = jeSize(xID);
	var wSize = winSize();
	var top=0,left=0;
	top = (wSize.winHeight-oSize.height)/2;
	left = (wSize.winWidth-oSize.width)/2;
	if(xOffset) top = top - parseInt(top*xOffset/100);
    elm.style.top = top + "px";
    elm.style.left = left + "px";
}
// 元素大小
function jeSize(xID){
	var elm = jsElm.jeID(xID); 
	var obj = {};
	obj.width = elm.offsetWidth;
	obj.height = elm.offsetHeight;
	return obj;
} 
//获取元素的位置 
function jePos(obj) { 
	var pos = $('#'+obj).offset();
	return [pos.left,pos.top];
	var obj = jsElm.jeID(obj); 
	if (obj == null) return null; 
	var posLeft = obj.offsetLeft; 
	var posTop = obj.offsetTop; 
	//while (obj != null && obj.offsetParent != null && obj.offsetParent.tagName != "BODY") { 
		//posLeft = posLeft + obj.offsetParent.offsetLeft; 
		//posTop = posTop + obj.offsetParent.offsetTop; 
	//} 
	return [posLeft,posTop]; 
}; 

function isObj(obj,type){ 
    var cons = obj.constructor.toString();
	if(type=='a') type='Array';
	if(type=='b') type='Boolean';
	if(type=='f') type='Function';
	if(type=='n') type='Number';
	if(type=='s') type='String';
	if(!type) type = 'Object';
	return (cons.indexOf(type)!= -1);
}
// 正则测试str,如判断ie6浏览器
function jsTest(c,str) {  
	if(!str) str = navigator.userAgent; 
	if(!c) c = 'MSIE 6';
	else if(!isNaN(c)) c = 'MSIE '+c; 
	var pos = str.indexOf(c);
	return pos<0 ? false : true; //reg.test(str);
}
// jsKeys
function jsKey(fid){
	var a = new Array("[",']',' ','/','-','.','&','=','#','?');
	var b = new Array("_",'_','_','_','_','_','_','_','_','_');
	for(var i=0;i<a.length;i++){
		fid = fid.replace(a[i],b[i]).replace(a[i],b[i]).replace(a[i],b[i]); 
	}
	return fid;
}
// jsReplace
function jsRep(str){
	var a = new Array("'",'"','\n','\r');
	var b = new Array("\\'",'\\"','\\n','\\r');
	for(var i=0;i<a.length;i++){
		str = str.replace(new RegExp(a[i],'g'),b[i]);
	}
	return str;
}
// removeHTMLTag
function jsText(str){ 
	str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
	return str;
}
// 获取文件名
function fileName(){
	var url = this.location.href
	var pos = url.lastIndexOf("/");
	if(pos == -1){
	   pos = url.lastIndexOf("\\")
	}
	var filename = url.substr(pos +1)
	return filename;
}
// 获取HTML页面参数 flag 为1 获取详细参数
function urlPara(key){
	return (new RegExp("([^(&|\?)]*)" + key + "=([^(&|#)]*)").test(location.href+"#")) ? RegExp.$2 : null;
}

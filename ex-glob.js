
var fp = __filename; console.log(fp);
var dir = __dirname; console.log(dir);
console.error('error:'+dir);


console.info("程序开始执行：");
var counter = 10;
console.log("计数: %d", counter);
console.time("获取数据");
// 执行一些代码
console.timeEnd('获取数据');
console.info("程序执行完毕。");


// 输出到终端
process.stdout.write("Hello World!" + "\n");
// 通过参数读取
process.argv.forEach(function(val, index, array) {
   console.log(index + ': ' + val);
});
// 获取执行路径
console.log(process.execPath);
// 平台信息
console.log(process.platform);


// 输出当前目录
console.log('当前目录: ' + process.cwd());
// 输出当前版本
console.log('当前版本: ' + process.version);
// 输出内存使用情况
console.log(process.memoryUsage());


function printHello(){
   console.log();
   console.log( "wait[2]sec : Hello, World!");
}
// 两秒后执行以上函数
setTimeout(printHello, 2000);

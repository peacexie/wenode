
obj = os.cpus();

        for(var j in obj) {
            console.log('\n\n --- testa:', j+':');
            for(var k in obj[j]) {
                console.log(' - '+k+':', obj[j][k]);
            }
        }
        console.log('\n\n');

// -----------------------------

var op1 = {"k1":"Xie", "key2":"Peace"};
for(var i=0; i<op1.length; i++) {
    console.log(' --- test1:', i+':'+op1[i]); // 这个不能输出
}
for(var j in op1) {
    console.log(' --- test2:', j+':'+op1[j]);
}
var op2 = ["Xie", "Peace"];
for(var i=0; i<op2.length; i++) {
    console.log(' --- test3:', i+':'+op2[i]);
}
for(var j in op2) {
    console.log(' --- test4:', j+':'+op2[j]);
}


// ------------------------------------

/*

<li><a href="/demo/news.{$did}">{cut({$title},15,...)}</a></li>

{sub({$0},id,sp)}
{sub({$0},id,,)}

    <tr>
    <td colspan="2">{id:key}</td>
    </tr>
    <tr><td colspan="3">{$0}</td></tr>
    <tr><td colspan="3">{$1}</td></tr>

<tr>
<td>{$address}</td>
<td>{$netmask}</td>
<td>{$family}</td>
<td>{$mac}</td>
<td>{$scopeid}</td>
<td>{$internal}</td>
</tr>

 --- testa: 无线网络连接 2:
 - 0: { address: 'fe80::58da:5b06:aa29:95fc',
  netmask: 'ffff:ffff:ffff:ffff::',
  family: 'IPv6',
  mac: '0c:82:68:28:97:b9',
  scopeid: 17,
  internal: false }
 - 1: { address: '172.30.97.1',
  netmask: '255.255.0.0',
  family: 'IPv4',
  mac: '0c:82:68:28:97:b9',
  internal: false }

 --- testa: 本地连接 2:
 - 0: { address: 'fe80::21a8:1a70:3618:ae3c',
  netmask: 'ffff:ffff:ffff:ffff::',
  family: 'IPv6',
  mac: '38:d5:47:1a:dd:42',
  scopeid: 12,
  internal: false }
 - 1: { address: '192.168.1.228',
  netmask: '255.255.255.0',
  family: 'IPv4',
  mac: '38:d5:47:1a:dd:42',
  internal: false }

 --- testa: VMware Network Adapter VMnet1:
 - 0: { address: 'fe80::d941:e9:3985:d1fa',
  netmask: 'ffff:ffff:ffff:ffff::',
  family: 'IPv6',
  mac: '00:50:56:c0:00:01',
  scopeid: 13,
  internal: false }
 - 1: { address: '192.168.33.1',
  netmask: '255.255.255.0',
  family: 'IPv4',
  mac: '00:50:56:c0:00:01',
  internal: false }

 --- testa: VMware Network Adapter VMnet8:
 - 0: { address: 'fe80::f89a:2cb0:7cb7:73d2',
  netmask: 'ffff:ffff:ffff:ffff::',
  family: 'IPv6',
  mac: '00:50:56:c0:00:08',
  scopeid: 14,
  internal: false }
 - 1: { address: '192.168.197.1',
  netmask: '255.255.255.0',
  family: 'IPv4',
  mac: '00:50:56:c0:00:08',
  internal: false }

 --- testa: Loopback Pseudo-Interface 1:
 - 0: { address: '::1',
  netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
  family: 'IPv6',
  mac: '00:00:00:00:00:00',
  scopeid: 0,
  internal: true }
 - 1: { address: '127.0.0.1',
  netmask: '255.0.0.0',
  family: 'IPv4',
  mac: '00:00:00:00:00:00',
  internal: true }

*/

// -------------------------------------

/*

<tr>
<td>id</td>
<td>model</td>
<td>speed</td>
<td>times</td>
</tr>

<div id='tpla1' style='display:none'>
<tr>
<td>[$id]</td>
<td>[$model]</td>
<td>[$speed]</td>
<td>[$times]</td>
</tr>
</div end='tpla1' >

 --- testa: 0:
 - model: Intel(R) Core(TM) i5-6400 CPU @ 2.70GHz
 - speed: 2712
 - times: { user: 386118, nice: 0, sys: 411452, idle: 13637404, irq: 25552 }

 --- testa: 1:
 - model: Intel(R) Core(TM) i5-6400 CPU @ 2.70GHz
 - speed: 2712
 - times: { user: 188839, nice: 0, sys: 179447, idle: 14066360, irq: 982 }

 --- testa: 2:
 - model: Intel(R) Core(TM) i5-6400 CPU @ 2.70GHz
 - speed: 2712
 - times: { user: 327243, nice: 0, sys: 294639, idle: 13812640, irq: 1154 }

 --- testa: 3:
 - model: Intel(R) Core(TM) i5-6400 CPU @ 2.70GHz
 - speed: 2712
 - times: { user: 390657, nice: 0, sys: 363014, idle: 13680726, irq: 1060 }

*/


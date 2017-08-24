-- Adminer 4.3.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `chatroom_ys`;
CREATE TABLE `chatroom_ys` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(24) NOT NULL DEFAULT '',
  `ufrom` varchar(255) NOT NULL DEFAULT '',
  `uto` varchar(24) NOT NULL DEFAULT '',
  `msgs` varchar(255) NOT NULL DEFAULT '',
  `show` tinyint(4) NOT NULL DEFAULT '1',
  `aip` varchar(255) NOT NULL DEFAULT '',
  `atime` int(11) NOT NULL DEFAULT '0',
  `auser` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `coms_nrem_ys`;
CREATE TABLE `coms_nrem_ys` (
  `cid` varchar(24) NOT NULL,
  `cno` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `mname` varchar(24) NOT NULL,
  `mtel` varchar(24) NOT NULL,
  `show` tinyint(4) NOT NULL DEFAULT '0',
  `pid` varchar(24) NOT NULL,
  `aip` varchar(255) NOT NULL DEFAULT '',
  `atime` int(11) NOT NULL DEFAULT '0',
  `auser` varchar(24) NOT NULL DEFAULT '',
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `coms_nrem_ys` (`cid`, `cno`, `title`, `detail`, `mname`, `mtel`, `show`, `pid`, `aip`, `atime`, `auser`) VALUES
('2015-a4-7tu1',    1,  'Elifebike-爸妈也放假吗？',    '但愿爸妈也放假才好！！',  '幼儿园-李某',   '3333-232233',  1,  '2015-9c-m4k1', '127.0.0.1',    1443916484, 'peace'),
('2015-a4-a0q1',    1,  'Elifebike-我和谁过节',  '对孩子们来说，六一儿童节应该是最值得让他们高兴的节日之一了。\r\n可现在的六一儿童节，真的慢慢过成了孩子们“自己”的节日了。\r\n六一我和谁过节，成了绝大多数孩子们要思考的问题。',  '幼儿园-Craby',    '3333232233',   1,  '2015-9c-m4k1', '127.0.0.1',    1443924055, 'peace'),
('2015-a4-a161',    1,  'Elifebike-儿童节不仅属于孩子，一家人应享受亲子活动',   '“您如何看待六一节让家长放假的提议？\r\n”近日《广州日报》在新浪微博上发起的一项投票结果显示，87%的网友认为，“儿童节不仅属于孩子，一家人应享受亲子活动”。\r\n',    'Peace',    '3333-232233',  1,  '2015-9c-m4k1', '127.0.0.1',    1443924128, 'peace'),
('2016-7k-n491',    1,  'Elifebike-清理调试记录', 'detail:Elifebike-清理调试记录',  'TTTTTTTT', '3333-232233',  1,  '2015-9c-m4k1', '127.0.0.1',    1468843733, 'xgezi');

DROP TABLE IF EXISTS `docs_news_ys`;
CREATE TABLE `docs_news_ys` (
  `did` varchar(24) NOT NULL,
  `dno` int(11) NOT NULL DEFAULT '0',
  `catid` varchar(255) NOT NULL,
  `hinfo` varchar(12) DEFAULT '',
  `title` varchar(255) NOT NULL,
  `show` tinyint(4) NOT NULL DEFAULT '1',
  `click` int(11) NOT NULL DEFAULT '0',
  `aip` varchar(255) NOT NULL DEFAULT '',
  `atime` int(11) NOT NULL DEFAULT '0',
  `auser` varchar(24) NOT NULL DEFAULT '',
  PRIMARY KEY (`did`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `docs_news_ys` (`did`, `dno`, `catid`, `hinfo`, `title`, `show`, `click`, `aip`, `atime`, `auser`) VALUES
('2015-9c-m221',    1,  'n1012',    '', 'Forward Electronics Co., LTD 8月联谊活动',  1,  229,    '127.0.0.1',    1442055860, 'peace'),
('2015-9c-m2k1',    1,  'n1012',    '', 'Priver Corp 9月联谊活动',   1,  423,    '127.0.0.1',    1442055926, 'peace'),
('2015-9c-m4k1',    1,  'n1014',    'zhuanti',  'Elifebike Online Store',   1,  311,    '127.0.0.1',    1442056182, 'peace'),
('2015-9g-mqx1',    1,  'n1018',    '', '湖南郴州为古树名木建“电子身份证”',    1,  275,    '127.0.0.1',    1442317730, 'peace'),
('2015-9g-n1m1',    1,  'n1018',    'pindao',   '永兴县多措并举保障农村供水水质安全',    1,  263,    '127.0.0.1',    1442318601, 'peace'),
('2015-9g-n271',    1,  'n1018',    'pindao',   '中国女排主教练郎平：郴州是中国女排的福地', 1,  285,    '127.0.0.1',    1442318681, 'peace'),
('2015-9g-n301',    1,  'n1018',    '', '2015中国足协中国之队国际足球赛将在郴打响',   1,  390,    '127.0.0.1',    1442318783, 'peace'),
('2015-9g-n3q1',    1,  'n1018',    '', '永兴试种火龙果成功',    1,  123,    '127.0.0.1',    1442318868, 'peace'),
('2015-9g-n4h1',    1,  'n1018',    'pindao',   '逛新村---便江渔鼓坐唱', 1,  184,    '127.0.0.1',    1442318975, 'peace'),
('2015-52-fdn1',    1,  'nsystem',  '', '[资讯]2015-0501：微信接口基本完成',   1,  233,    '127.0.0.1',    1430807343, 'peace'),
('2015-a1-fhh1',    1,  'nsystem',  '', '[资讯]2015-1001：支付接口基本完成',   1,  299,    '127.0.0.1',    1443681308, 'peace'),
('2015-cs-fk01',    1,  'nsystem',  '', '[资讯]2015-1226：贴心猫(3.0)悄悄发布',   1,  280,    '127.0.0.1',    1451025503, 'peace'),
('2016-7r-j5w1',    1,  'nsystem',  NULL,   '2016-0723：【祝贺】贴心猫(3.2)乔迁之喜',   1,  359,    '120.84.11.188, 10.50.148.53',  1469265148, 'peace'),
('2016-cz-g8v1',    1,  'n1018',    'home', '【南湾】征集2017春节，家乡春联',    1,  84, '157.122.64.166, 10.50.148.54', 1483168731, 'peace'),
('2016-cz-j321',    1,  'nsystem',  '', 'Hi-2017 贴心猫迎新年！QQ群607070548 成立！',  1,  56, '120.84.10.166, 10.50.149.61',  1483175191, 'peace'),
('2017-15-p131',    1,  'nsystem',  'zhuanti',  '验证码 攻与防 较量！--- 共建安全高效和谐的web应用系统！', 1,  140,    '157.122.64.65, 10.50.148.53',  1483621338, 'peace'),
('2017-1m-cvw1',    1,  'n1018',    'zhuanti',  '慢慢明白了,什么才是最重要的(摘录)',   1,  55, '61.145.169.200, 10.50.148.61', 1484801964, 'peace'),
('2017-59-d2u1',    1,  'n1018',    'pindao',   ' You are very much ON TIME, and Destiny set up for you...',    1,  44, '61.145.169.200, 10.50.149.73', 1494306356, 'peace');

DROP TABLE IF EXISTS `users_person_ys`;
CREATE TABLE `users_person_ys` (
  `uid` varchar(24) NOT NULL DEFAULT '',
  `uname` varchar(24) NOT NULL,
  `mname` varchar(96) NOT NULL,
  `grade` varchar(12) NOT NULL,
  `mfrom` varchar(12) NOT NULL DEFAULT 'c0769',
  `mtel` varchar(24) NOT NULL DEFAULT '',
  `memail` varchar(120) NOT NULL DEFAULT '',
  `show` tinyint(4) NOT NULL DEFAULT '0',
  `click` int(11) NOT NULL DEFAULT '0',
  `aip` varchar(255) NOT NULL DEFAULT '',
  `atime` int(11) NOT NULL DEFAULT '0',
  `auser` varchar(24) NOT NULL DEFAULT '',
  PRIMARY KEY (`uname`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `users_person_ys` (`uid`, `uname`, `mname`, `grade`, `mfrom`, `mtel`, `memail`, `show`, `click`, `aip`, `atime`, `auser`) VALUES
('2015-6h-p241',    'xieys',    '测试者ys',    'pvip', 'c0762',    '343344346',    'xpigeon-6@165.com',    1,  0,  '192.168.1.11', 1435556380, 'peace'),
('2015-a5-h9g1',    'a5h9g1',   '测试随机1',    'pvip', 'c0769',    '3333-232233',  '', 1,  0,  '127.0.0.1',    1444033208, 'peace'),
('2017-4k-j3s1',    'test21',   'xpig21n@163.com',  'pcom', 'c0769',    '126-8888-8888',    'xpigeon@163.com',  1,  0,  '127.0.0.1',    1492506476, ''),
('2015-c2-q9d1',    'hepingge', '和平鸽(peace)',   'pcom', 'c0769',    '127-6666-8888',    'ypigeon@163.com',  1,  0,  '127.0.0.1',    1449066000, 'peace'),
('2015-c3-q9d2',    'test22',   '好好学习', 'pcom', 'c0769',    '127-6666-8888',    'ypigeon@163.com',  1,  0,  '127.0.0.1',    1449066000, 'peace'),
('2017-5k-j3s41',   'testbb',   'xpigeon@163.com',  'pcom', 'c0769',    '126-8888-8888',    'xpigeon@163.com',  1,  0,  '127.0.0.1',    1492506476, '');

-- 2017-08-24 09:46:34
-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `chat_data_ys`;
CREATE TABLE `chat_data_ys` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ufrom` varchar(24) NOT NULL DEFAULT '',
  `uto` varchar(24) NOT NULL DEFAULT '',
  `msgs` varchar(255) NOT NULL DEFAULT '',
  `type` varchar(12) NOT NULL DEFAULT 'text',
  `ujson` text NOT NULL,
  `show` tinyint(4) NOT NULL DEFAULT '1',
  `aip` varchar(255) NOT NULL DEFAULT '',
  `atime` int(11) NOT NULL DEFAULT '0',
  `app` varchar(24) NOT NULL DEFAULT '' COMMENT '(暂不用)',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='聊天记录';


DROP TABLE IF EXISTS `chat_list_ys`;
CREATE TABLE `chat_list_ys` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ufrom` varchar(24) NOT NULL DEFAULT '',
  `uname` varchar(24) NOT NULL DEFAULT '' COMMENT '昵称',
  `uto` varchar(24) NOT NULL DEFAULT '',
  `atime` int(11) NOT NULL DEFAULT '0',
  `top` tinyint(4) NOT NULL DEFAULT '0',
  `app` varchar(24) NOT NULL DEFAULT '' COMMENT '(暂不用)',
  `show` tinyint(4) NOT NULL DEFAULT '1' COMMENT '(暂不用)',
  `thumb` varchar(255) NOT NULL DEFAULT '',
  `msgs` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='会话列表';


-- 2019-06-21 06:40:01

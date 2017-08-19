
<?php  
require_once('Socket.php');   

$con = Socket::getInstance();  
$req = $_GET['cmd'];  
$con->sendMsg($req);  
$ret = $con->getMsg();  
echo $ret;

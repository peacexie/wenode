<?php
class Socket {
    public static $instance = null;
    public $conn;
    private function __construct() {
        set_time_limit(0);
        $ip = '127.0.0.1';
        $port = 8826;
        if (($this->conn = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)) < 0) {
            echo "socket_create() 失败的原因是:" . socket_strerror($this->conn) . "\n";
        }
        $result = socket_connect($this->conn, $ip, $port);
        if ($result < 0) {
            echo "socket_connect() failed.\nReason: ($result) " . socket_strerror($result) . "\n";
        } else {
            echo "连接OK\n";
        }
    }
    public static function getInstance() {
        if (is_null(self::$instance)) {
            self::$instance = new Socket;
        }
        return self::$instance;
    }
    public function sendMsg($msg) {
        socket_write($this->conn, $msg);
    }
    public function getMsg() {
        $clients = array($this->conn);
        while (true) {
            $read = $clients;
            $wrSet = NULL;
            $errSet = NULL;
            if (socket_select($read, $wrSet, $errSet, 3) < 1) {
                continue;
            }
            foreach ($read as $read_sock) {
                $data = @socket_read($read_sock, 1024, PHP_BINARY_READ);
                socket_close($this->conn);
                return $data;
            }
        }
    }
}

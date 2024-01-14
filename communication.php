<?php
    //phpでは変数の前に$をつける必要がある

    date_default_timezone_set("Asia/Tokyo");

    $memo_array = array();
    $pdo = null;
    $stmt = null;

    $dsn = 'mysql:host=localhost;dbname=schedule_management';
    $user = 'root';
    $password = 'xxxx'; //xxxxはmysql（MariaDB）のパスワード
    //DB接続 各引数にはhost名,dbname,自身のuser名,自身のpasswordを入れる
    $pdo = new PDO($dsn,$user,$password);


    try{
        //以下はhttps://masanyon.com/php-javascript-data-fetch-api/より引用

        // 1. POSTされた生のデータを受け取る
        $request_raw_data = file_get_contents('php://input');

        // 2. JSON形式のデータをデコードする
        // => データをPHP上で処理できるような形にする。
        $data = json_decode($request_raw_data);

        // 3. データをPHP(Server-Side)上で処理する！

        // key指定でvalueを使用
        $day = $data->day_info;
        $memo = $data->memo;

        $response = $data;

        // 4. echo するとClient-Sideにデータを返却することができる！
        // => JSON形式にして返す
        echo json_encode($response); 


        // コメントが空でないことを確認
        if (!empty($memo)) {
            $stmt = $pdo->prepare("INSERT INTO schedule(memo,DAY) VALUES ({$memo},{$day});");
            $stmt->bindParam(':memo', $memo, PDO::PARAM_STR); 
            $stmt->bindParam('DAY', $day, PDO::PARAM_STR);
    
            $stmt->execute();
        } else {
            echo "予定が設定されていません";
        }
        
    }catch(PDOException $e){
        echo $e->getMessage();
    }
    
    /*
    //DBからメモデータを取得する
    $sql = "SELECT 'memo' FROM 'schedule';";
    $memo_array = $pdo->query($sql);
    */

    //DBの接続を閉じる
    $pdo = null;
    
?>

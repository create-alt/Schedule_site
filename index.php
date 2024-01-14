<!DOCTYPE html>
<html lang="jp">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css" type="text/css">
    <script type="text/javascript" src="calendar.js"></script>
    <title>スケジュール管理用サイト_remake</title>
</head>
<body>
    <header>
        <dev class="menus">
            <!--git hub等へのアップロード後実装-->
            <a href="#" class="menu">予定一覧</a>
            <a href="#" class="menu">予定書き換え</a>
            <a href="#" class="menu">通知設定</a>
        </dev>
        <dev class="logins">
            
        </dev>
    </header>

    <h1 class="title">予定管理サイト</h1>
    <div class="wrapper">
        <!--xxxx年 oo月を表示-->
        <div class="pos">
            <h1 id="header"></h1>
        </div>
        

        <!--ボタンクリックで月移動-->
        <div id="next-prev-button">
            <button id="prev" onclick="prev()"> < </button>
            <button id="next" onclick="next()"> > </button>
        </div>

        <!--カレンダー-->
        <div id="calendar">

        </div>

        <div id="schedule_table">
            <div id="schedule">

            </div>
        </div>
    </div>
</body>

<!--<?php include('./communication.php'); ?>-->

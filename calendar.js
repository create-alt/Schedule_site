//にゃんブログ(https://nyanblog2222.com/programming/javascript/2749/)を参照および引用
const week = ["日", "月", "火", "水", "木", "金", "土"];
const today = new Date();
// 月末だとずれる可能性があるため、1日固定で取得
var showDate = new Date(today.getFullYear(), today.getMonth(), 1);

// 祝日取得
var request;
window.onload = function () {
    request = new XMLHttpRequest();
    request.open('get', 'syukujitsu.csv', true);
    request.send(null);
    request.onload = function () {
        // 初期表示
        showProcess(today, calendar);
    };
};

// 前の月表示
function prev(){
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
}

// 次の月表示
function next(){
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
}

// カレンダー表示
function showProcess(date) {
    var year = date.getFullYear();
    var month = date.getMonth(); // 0始まり
    document.querySelector('#header').innerHTML = year + "年 " + (month + 1) + "月";

    var calendar = createProcess(year, month);
    document.querySelector('#calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    var calendar = "<table><tr class='dayOfWeek'>";
    for (var i = 0; i < week.length; i++) {
        calendar += "<th>" + week[i] + "</th>";
    }
    calendar += "</tr>";

    var count = 0;
    var startDayOfWeek = new Date(year, month, 1).getDay();
    var endDate = new Date(year, month + 1, 0).getDate();
    var lastMonthEndDate = new Date(year, month, 0).getDate();
    var row = Math.ceil((startDayOfWeek + endDate) / week.length);

    // 1行ずつ設定
    for (var i = 0; i < row; i++) {
        calendar += "<tr>";
        // 1colum単位で設定
        for (var j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                calendar += "<td class='disabled'><button class='disabled' onclick=writing(" + year +","+ (month-1)+","+ (lastMonthEndDate - startDayOfWeek + j + 1) + ")>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</button></td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                calendar += "<td class='disabled'><button class='disabled' onclick=writing(" + year+","+ (month+1)+","+ (count - endDate) + ")>" + (count - endDate) + "</button></td>";
            } else {
                // 当月の日付を曜日に照らし合わせて設定
                count++;
                var dateInfo = checkDate(year, month, count);
                if(dateInfo.isToday){
                    calendar += "<td class='today'><button class='today' onclick=writing(" + year+","+ month+","+ count + ")>" + count + "</button></td>";
                } else if(dateInfo.isHoliday) {
                    calendar += "<td class='holiday' title='" + dateInfo.holidayName + "'><button class='holiday' onclick=writing(" + year+","+ month+","+ count + ")>" + count + "</button></td>";
                } else if(j == 0){
                    calendar += "<td><button class='sunday' onclick=writing(" + year+","+ month+","+ count + ")>" + count + "</button></td>";
                } else if(j == week.length - 1){
                    calendar += "<td><button class='saturday' onclick=writing(" + year+","+ month+","+ count + ")>" + count + "</button></td>";
                } else {
                    calendar += "<td><button class='normal_button' onclick=writing(" + year+","+ month+","+ count + ")>" + count + "</button></td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

// 日付チェック
function checkDate(year, month, day) {
    if(isToday(year, month, day)){
        return {
            isToday: true,
            isHoliday: false,
            holidayName: ""
        };
    }

    var checkHoliday = isHoliday(year, month, day);
    return {
        isToday: false,
        isHoliday: checkHoliday[0],
        holidayName: checkHoliday[1],
    };
}

// 当日かどうか
function isToday(year, month, day) {
    return (year == today.getFullYear()
        && month == (today.getMonth())
        && day == today.getDate());
    }

// 祝日かどうか
function isHoliday(year, month, day) {
    var checkDate = year + '/' + (month + 1) + '/' + day;
    var dateList = request.responseText.split('\n');
    // 1行目はヘッダーのため、初期値1で開始
    for (var i = 1; i < dateList.length; i++) {
        if (dateList[i].split(',')[0] === checkDate) {
            return [true, dateList[i].split(',')[1]];
        }
    }
    return [false, ""];
}

//指定日の予定等の書き込み欄の表示
function writing(year,month,day){
    var schedule = createSchedule(year,month,day);
    document.querySelector('#schedule').innerHTML = ''; 
    document.querySelector('#schedule').appendChild(schedule);
}

function createSchedule(year,month,day){
    var schedule = document.createElement('div');

    var date = document.createElement("h2");
    date.className = "date";

    var day_text;
    var mon;
    //13月となってしまうときには1月に直す
    //0月となってしまう時には12月に直す
    if(month+1 == 13){
        day_text = document.createTextNode(String(year) + "年" + "1" + "月" + String(day) + "日");
        mon = 1;
    }else if(month+1 == 0){
        day_text = document.createTextNode(String(year) + "年" + "12" + "月" + String(day) + "日");
        mon = 12;
    }else{
        day_text = document.createTextNode(String(year) + "年" + String(month+1) + "月" + String(day) + "日");
        mon = month + 1;
    }

    //日付を表示する
    date.appendChild(day_text);
    schedule.appendChild(date);

    //予定を箇条書きで表示
    var schedule_list = document.createElement("ul");
    var schedule_list_child = document.createElement("li");

    //schedule_textにはデータベースから取得した予定一覧を挿入する
    var schedule_text = document.createTextNode("データベースから取得した予定");

    schedule_list_child.appendChild(schedule_text);
    schedule_list.appendChild(schedule_list_child);
    schedule.appendChild(schedule_list);
    
    // テキストエリアの追加
    var textarea = document.createElement('textarea');
    textarea.name = 'memo';
    schedule.appendChild(textarea);
    

    // 改行
    schedule.appendChild(document.createElement('br'));

    // ボタンの追加
    var button = document.createElement('input');
    button.type = 'submit';
    button.value = '反映させる';
    button.name = 'submitButton';
    // ボタンがクリックされたときに関数を呼ぶ
    button.addEventListener('click', {year: year,mon:mon,day:day,handleEvent:sendData});
    schedule.appendChild(button);
    
    return schedule;
}

function sendData(year,mon,day){
    var textareaContent = document.querySelector('textarea[name="memo"]').value;

    // 1. PHP(Server-Side)に渡したいデータ
    const parameter = {
        day_info: String(year)+"-"+String(mon)+"-"+String(day),
        memo: textareaContent
    };

    // 2. fetch-APIを使用して、Server-Sideにデータを送信する
    // => fetch(送り先, HTTP通信の情報)
    fetch('communication.php', 
        {
            method: 'POST', // HTTP-メソッドを指定
            headers: { 'Content-Type': 'application/json' }, // jsonを指定
            body: JSON.stringify(parameter),
        }
    ); 
    
    /* 以下はServerから返ってきたレスポンスをjsonで受け取って処理するためのコード（いったん保留）
    fetch('communication.php', 
        {
            method: 'POST', // HTTP-メソッドを指定
            headers: { 'Content-Type': 'application/json' }, // jsonを指定
            body: JSON.stringify(parameter),
        }
    )
    .then(response => response.json())
    .then(res => {
        // 最終的に返ってきたデータ => Server-Sideでのデータ処理が行われている！
        memo = res
    })
    .catch(error => {
        // エラー発生の場合の catch & console出力
        console.log({error});
    });*/
}


//getDaysByYearMonth(2018,5)
function getDaysByYearMonth(year, month) {//返回该月有多少天
    var date = new Date(year, month, 0);
    return date.getDate();
}
function getFirstDayWeekByYearMonth(year, month) {//返回该月的第一天是星期几
    var date = new Date(year, month - 1, 1);
    return date.getDay();
}
function prevMonthDays(year, month) { //返回该月的上一个月有多少天
    var date = new Date(year, month - 1, 0);
    return date.getDate();
}
function format(date, str) { //格式化时间的方法
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return str.replace("yyyy", year).replace("mm", month).replace("dd", day).replace("hh", hour).replace("mm", min).replace("ss", sec);
}
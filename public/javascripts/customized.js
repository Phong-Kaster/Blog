'use strict'
/* ===================================== */
/*              getDateAndTime           */
/* ===================================== */
function convertNumericMonthsToFontMonths(month)
{
    var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

    var selectedMonthName = months[month];

    return selectedMonthName;
}
function convertNumbericWeekdayToFontWeekday(day)
{
    var days = ["Monday","Tuedays","Wednesday","Thusday","Friday","Saturday","Sunday"];

    var selectedWeekday = days[day];
    
    return selectedWeekday;
}
function standizedHourAndMinute(number)
{
    if( number < 10)
    {
        number = "0" + number;
    }
    return number;
}
// Đối tượng thời gian hiện tại
function getDateAndTime()
{
    var d = new Date();
    
    var hour = standizedHourAndMinute(d.getHours());
    var minute = standizedHourAndMinute(d.getMinutes());
    var date = d.getDate();
    var day = convertNumbericWeekdayToFontWeekday(d.getDay()-1);
    var fullYear = d.getFullYear();
    var month = convertNumericMonthsToFontMonths(d.getMonth());

    var dateAndTime = hour + ":" + minute + "  "+ day + " , " + date + " " + month + " " +fullYear;
    
    $("#timer").html(dateAndTime);

    setTimeout(getDateAndTime,1000);
}

function WriteCookie()
{
    if( document.myform.customer.value == "" )
    {
         alert("Enter some value!");
           return;
    }
    cookievalue= escape(document.myform.customer.value) + ";";
    document.cookie="name=" + cookievalue;
    document.write ("Setting Cookies : " + "name=" + cookievalue );
}
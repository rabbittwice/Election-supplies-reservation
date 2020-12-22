(function() {
    const today = new Date();
    const nowYear = today.getFullYear();
    const nowMonth = today.getMonth() + 1;
    const firstDay = new Date(nowYear, nowMonth - 1, 1);
    const firstDayDate = firstDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    const lastDay = new Date(nowYear, nowMonth - 1, 0);
    const lastDayDate = lastDay.getDate();

    function _makeCalendar() {
        const calTable = document.querySelector('.calTable');
        const tableRow = document.createElement('tr');
        const tableDate 
        = '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' 
        + '<td class="dateColumn"></td>';
    
        tableRow.classList.add('dateRow');
        
        tableRow.innerHTML= tableDate;
        
        let Date = 1;
    
        for(let firstWeekDay = 0; firstWeekDay <= 6; firstWeekDay++){
            // 첫째주 부분
            if(firstWeekDay >= firstDayOfWeek){
                tableRow.childNodes[firstWeekDay].innerHTML
                = '<p class="date">' + Date + '</p>';
                Date++;
            }
            if(firstWeekDay == 6){
                calTable.append(tableRow);
            }
        };
    }
    _makeCalendar();

    _showYearMonth();

    function _showYearMonth() {
        const calYear = document.querySelector('.year');
        const calMonth = document.querySelector('.month')

        calYear.innerHTML = nowYear;
        calMonth.innerHTML = nowMonth;
    };

    
    

}())
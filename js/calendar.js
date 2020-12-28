(function () {
    let today = new Date();
    const calTable = document.querySelector('.calTable');

    _makeCalendar();

    function _makeCalendar() {
        let nowYear = today.getFullYear();
        const nowMonth = today.getMonth() + 1;
        const firstDay = new Date(nowYear, nowMonth - 1, 1);
        const firstDayOfWeek = firstDay.getDay();
        const lastDay = new Date(nowYear, nowMonth, 0);
        const lastDayDate = lastDay.getDate();
        const tableRow = [document.createElement('tr'), document.createElement('tr'), document.createElement('tr'), document.createElement('tr'), document.createElement('tr'), document.createElement('tr')];
        const tableDate = '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>' + '<td class="dateColumn"></td>';
        const lastTr = calTable.lastChild.childNodes[0].innerHTML;

        // 첫째주 부분
        tableRow[0].classList.add('dateRow');
        tableRow[0].innerHTML = tableDate;

        let date = 1;
        let weekDay = 0;

        for (weekDay = 0; weekDay <= 6; weekDay++) {
            if (weekDay >= firstDayOfWeek && weekDay < 6) {
                tableRow[0].childNodes[weekDay].innerHTML = '<p class="date">' + date + '</p>';
                date++;
            }
            if (weekDay == 6) {
                tableRow[0].childNodes[weekDay].innerHTML = '<p class="date">' + date + '</p>';
                date++;
                calTable.appendChild(tableRow[0]);
                weekDay = 0;
                break;
            }
        };

        // 첫째주 이외
        for (let i = 1; i <= 4; i++) {
            tableRow[i].classList.add('dateRow');
            tableRow[i].innerHTML = tableDate;
            for (let weekDay = 0; weekDay <= 6; weekDay++) {
                if (date <= lastDayDate) {
                    tableRow[i].childNodes[weekDay].innerHTML = '<p class="date">' + date + '</p>';
                    date++;
                }
            }
            calTable.append(tableRow[i]);
        }

        if (firstDayOfWeek >= 5) {
            tableRow[5].classList.add('dateRow');
            tableRow[5].innerHTML = tableDate;
            for (let weekDay = 0; weekDay <= 6; weekDay++) {
                if (date <= lastDayDate) {
                    tableRow[5].childNodes[weekDay].innerHTML = '<p class="date">' + date + '</p>';
                    date++;
                }
            }
            calTable.append(tableRow[5]);
        }

        if (!lastTr) {
            calTable.removeChild(calTable.lastChild);
        }
        _setOpenModal();
    }


    _showYearMonth(today);

    function _showYearMonth() {
        const nowYear = today.getFullYear();
        const nowMonth = today.getMonth() + 1;
        const calYear = document.querySelector('.year');
        const calMonth = document.querySelector('.month')

        calYear.innerHTML = nowYear;
        calMonth.innerHTML = nowMonth;
    };

    // 년도, 월 조정
    const yearUpBtn = document.getElementById('yearUp');
    const yearDownBtn = document.getElementById('yearDown');
    const monthUpBtn = document.getElementById('monthUp');
    const monthDownBtn = document.getElementById('monthDown');

    yearUpBtn.addEventListener('click', _yearUp);
    yearDownBtn.addEventListener('click', _yearDown);
    monthUpBtn.addEventListener('click', _monthUp);
    monthDownBtn.addEventListener('click', _monthDown);

    function _yearUp() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth();
        today = new Date(nowYear + 1, nowMonth, 1);
        const rowCount = calTable.childElementCount - 1;
        for (let i = 1; i <= rowCount; i++) {
            const dateRow = document.querySelector('.dateRow');
            calTable.removeChild(dateRow);
        }
        _makeCalendar();
        _showYearMonth();
        
    };

    function _yearDown() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth();
        today = new Date(nowYear - 1, nowMonth, 1);
        const rowCount = calTable.childElementCount - 1;
        for (let i = 1; i <= rowCount; i++) {
            const dateRow = document.querySelector('.dateRow');
            calTable.removeChild(dateRow);
        }
        _makeCalendar();
        _showYearMonth();
    }

    function _monthUp() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth();
        today = new Date(nowYear, nowMonth + 1, 1);
        const rowCount = calTable.childElementCount - 1;
        for (let i = 1; i <= rowCount; i++) {
            const dateRow = document.querySelector('.dateRow');
            calTable.removeChild(dateRow);
        }
        _makeCalendar();
        _showYearMonth();
    }

    function _monthDown() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth();
        today = new Date(nowYear, nowMonth - 1, 1);
        const rowCount = calTable.childElementCount - 1;
        for (let i = 1; i <= rowCount; i++) {
            const dateRow = document.querySelector('.dateRow');
            calTable.removeChild(dateRow);
        }
        _makeCalendar();
        _showYearMonth();
    }


    // 모달창

    // 달력 클릭 시 이벤트
    const modalContainer = document.querySelector('.dark');
    const clickedDate = document.querySelector('.clickedDate');
    const orgName = document.getElementById('orgName');
    const returnDate = document.getElementById('returnDate');
    
    _setOpenModal();

    function _setOpenModal() {
        const dateColumn = document.querySelectorAll('.dateColumn');
        for(let i = 0; i < dateColumn.length; i++){
            if(dateColumn[i].innerHTML){
                dateColumn[i].addEventListener('click', _openModal);
            }
        }
    }

    function _openModal(e) {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth() + 1;
        modalContainer.classList.add('opened');
        clickedDate.innerHTML = nowYear + '년 ' + nowMonth + '월 ' + e.target.innerText + '일';
        orgName.focus();
        returnDate.value = today.toISOString().substring(0, 8) + (e.target.innerText.length == 1? '0' + e.target.innerText : e.target.innerText);
    }

    // close 버튼 & esc 키
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', _closeModal);

    function _closeModal() {
        modalContainer.classList.remove('opened');
    }
    
    window.addEventListener('keydown', function(e){
        if(e.key == "Escape"){
            _closeModal();
        }
    })

    // submit 버튼 눌렀을 때 이벤트 & 객체 생성

    function Reserved(name, date, kind, count, boxCount, returnDate){
        this.name = name;
        this.date = date;
        this.kind = kind;
        this.count = count;
        this.boxCount = boxCount;
        this.returnDate = returnDate;
    }

    const submitBtn = document.querySelector('.submitBtn');
    const kind1 = document.getElementById('kind1');
    const kind2 = document.getElementById('kind2');
    const count = document.getElementById('count');
    const boxCount = document.getElementById('boxCount');
    const listContainer = document.querySelector('.listContainer');
    


    submitBtn.addEventListener('click', function(e){
        const date = e.path[1].childNodes[1].innerText
        const theDate = date.substring(date.lastIndexOf('월') + 2, date.lastIndexOf('일'));
        const objName = orgName.value;

        if(orgName.value){
            const reservedList = new Reserved(orgName.value, today.toISOString().substring(0, 8) + theDate, (kind1.checked ? '(구)' : '(신)'), count.value, boxCount.value, returnDate.value);

            const listElement = document.createElement('div');
            listElement.classList.add('resList');
            const resName = document.createElement('div');
            resName.classList.add('resName');
            const countElement = document.createElement('div');
            countElement.classList.add('count');
            const resKind = document.createElement('p');
            resKind.classList.add('resKind')
            const resCount = document.createElement('p');
            resCount.classList.add('resCount');
            const resBoxCount = document.createElement('p');
            resBoxCount.classList.add('resBoxCount');
            const resDate = document.createElement('div');
            resDate.classList.add('resDate');
            const returnDateElement = document.createElement('p');
            returnDateElement.classList.add('returnDate');
            const deleteBtn = document.createElement('div');
            deleteBtn.classList.add('deleteBtn');


            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            returnDateElement.innerText = reservedList.returnDate;
            resDate.innerHTML = '반납예정일: ' + returnDateElement.outerHTML;
            resKind.innerText = reservedList.kind;
            resCount.innerText = reservedList.count;
            resBoxCount.innerText = reservedList.boxCount;
            countElement.innerHTML = resKind.outerHTML + '기표대:' + resCount.outerHTML + '개, 투표함:' + resBoxCount.outerHTML + '개';
            resName.innerText = reservedList.name;


            listElement.appendChild(resName);
            listElement.appendChild(countElement);
            listElement.appendChild(resDate);
            listElement.appendChild(deleteBtn);
            
            listContainer.appendChild(listElement);

            _activeDelete(deleteBtn, listContainer);
        }
    })

    // delete 버튼 누를 시 해당 리스트 삭제
    const listDelete = document.querySelector('.deleteBtn');

    if(listDelete){
        _activeDelete(listDelete);
    }
    
    function _activeDelete(btn, listCon){
        
        btn.addEventListener('click', function(e){
            if(e.target.nodeName == 'DIV'){
                listCon.removeChild(e.target.parentNode);
            } else {
                listCon.removeChild(e.target.parentNode.parentNode.parentNode);

            }
        })
    }

    

}())


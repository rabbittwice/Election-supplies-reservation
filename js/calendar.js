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
        for (let i = 0; i < dateColumn.length; i++) {
            if (dateColumn[i].innerHTML) {
                dateColumn[i].addEventListener('click', _openModal);
            }
        }
    }

    function _openModal(e) {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth() + 1;
        modalContainer.classList.add('opened');
        if (e.target.className == 'dateColumn') {
            clickedDate.innerHTML = nowYear + '년 ' + nowMonth + '월 ' + e.target.childNodes[0].innerText + '일';
            returnDate.value = today.toISOString().substring(0, 8) + (e.target.childNodes[0].innerText.length == 1 ? '0' + e.target.childNodes[0].innerText : e.target.childNodes[0].innerText);
        } else if (e.target.className == 'date') {
            clickedDate.innerHTML = nowYear + '년 ' + nowMonth + '월 ' + e.target.innerText + '일';
            returnDate.value = today.toISOString().substring(0, 8) + (e.target.innerText.length == 1 ? '0' + e.target.innerText : e.target.innerText);
        } else if (e.target.className == 'list') {
            clickedDate.innerHTML = nowYear + '년 ' + nowMonth + '월 ' + e.target.parentNode.childNodes[0].innerText + '일';
            returnDate.value = today.toISOString().substring(0, 8) + (e.target.parentNode.childNodes[0].innerText.length == 1 ? '0' + e.target.parentNode.childNodes[0].innerText : e.target.parentNode.childNodes[0].innerText);
        }
        orgName.focus();
    }

    // close 버튼 & esc 키
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', _closeModal);

    function _closeModal() {
        modalContainer.classList.remove('opened');
    }

    window.addEventListener('keydown', function (e) {
        if (e.key == "Escape") {
            _closeModal();
        }
    })

    // submit 버튼 눌렀을 때 이벤트 & 객체 생성

    function Reserved(name, date, kind, count, boxCount, returnDate) {
        this.name = name;
        this.date = date;
        this.kind = kind;
        this.count = count;
        this.boxCount = boxCount;
        this.returnDate = returnDate;
    }

    const submitBtn = document.querySelector('.submitBtn');
    const kind1 = document.getElementById('kind1');
    const count = document.getElementById('count');
    const boxCount = document.getElementById('boxCount');
    const listContainer = document.querySelector('.listContainer');


    submitBtn.addEventListener('click', _submitClick);

    function _submit(date) {
        if (orgName.value) {
            // modal 창에 추가
            const theDate = date.substring(date.lastIndexOf('월') + 2, date.lastIndexOf('일'));
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

            _activeDelete(deleteBtn, listContainer, reservedList.date, reservedList.name);

            // 메인 달력에 추가
            _addMain(reservedList.date, reservedList.name, reservedList.count, reservedList.boxCount);

            // Input 초기화

            orgName.value = '';
            kind1.checked = true;
            count.value = 0;
            boxCount.value = 0;
        }
    }


    function _submitClick(e) {

        if (e.type == 'click') {
            const date = e.path[1].childNodes[1].innerText;
            _submit(date);
        } else if (e.type == 'keydown') {
            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].className == 'modal') {
                    const date = e.path[i].childNodes[1].innerText;
                    _submit(date);
                };
            };
        };
    }     
        
    // modal 창에서 enter 키 누를 시 입력되도록

    const modal = document.querySelector('.modal');

    modal.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].className == 'modal') {
                    for (let j = 0; j < e.path[i].childNodes.length; j++)
                    if (e.path[i].childNodes[j].className == 'submitBtn'){
                        _submitClick(e);
                    }
                }
            }
        }
    });



    // 메인 달력에 추가하는 함수
    function _addMain(date, name, count, boxCount) {
        // 인수로 날짜를 받아서 메인 달력의 해당 날짜에 추가되도록 함.
        const dateRow = document.querySelectorAll('.dateRow')
        const theDate = date.substring(8, 10);

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 7; j++) {
                if (dateRow[i].children[j].childNodes[0]) {
                    if (dateRow[i].children[j].childNodes[0].innerText == theDate) {
                        const correctElement = dateRow[i].children[j].childNodes[0];
                        const list = document.createElement('div');
                        list.classList.add('list');
                        list.innerHTML = name + '<br>-기표대 ' + count + '개 <br>-투표함' + boxCount + '개'
                        correctElement.parentNode.appendChild(list);
                    }
                }
            }
        }
    }



    // delete 버튼 누를 시 해당 리스트 삭제
    const listDelete = document.querySelector('.deleteBtn');

    if (listDelete) {
        _activeDelete(listDelete);
    }

    function _activeDelete(btn, listCon, date, name) {

        const dateRow = document.querySelectorAll('.dateRow')
        const theDate = date.substring(8, 10);

        btn.addEventListener('click', function (e) {
            if (e.target.nodeName == 'DIV') {
                listCon.removeChild(e.target.parentNode);
            } else if (e.target.nodeName == 'svg'){
                listCon.removeChild(e.target.parentNode.parentNode);
            } else if (e.target.nodeName == 'path'){
                listCon.removeChild(e.target.parentNode.parentNode.parentNode);
            }

            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 7; j++) {
                    if (dateRow[i].children[j].childNodes[0]) {
                        if (dateRow[i].children[j].childNodes[0].innerText == theDate) {
                            for (let h = 0; h < dateRow[i].children[j].childNodes.length; h++) {
                                if (dateRow[i].children[j].childNodes[h].innerText.includes(name)) {
                                    dateRow[i].children[j].removeChild(dateRow[i].children[j].childNodes[h]);
                                }
                            }
                        }
                    }
                }
            }
        })


    }




}())


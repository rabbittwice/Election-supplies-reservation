(function () {
    let today = new Date();
    const calTable = document.querySelector('.calTable');

    if (!localStorage.getItem('arrOfObj')) {
        let arrOfObj = [];
        _saveToStorage(arrOfObj);
    }

    _makeCalendarFrame();

    // localStorage 초기화 버튼
    const title = document.querySelector('.title');
    title.addEventListener('click', _clearLocalStorage);

    function _clearLocalStorage() {
        if (confirm('초기화 하겠습니까?')) {
            localStorage.clear();
        } else {

        }
    }

    function _insertCountInfo(countInfo){
        const totalOldBooth = document.querySelector('.totalOldBooth'),
            totalNewBooth = document.querySelector('.totalNewBooth'),
            totalBox = document.querySelector('.totalBox');

        totalOldBooth.innerText = countInfo[0];
        totalNewBooth.innerText = countInfo[1];
        totalBox.innerText = countInfo[2];
    }

    // 총 개수 배열로 입력
    if (localStorage.getItem('countInfo')) {
        const countInfo = JSON.parse(localStorage.getItem('countInfo'));
        _insertCountInfo(countInfo);
    } else {
        const totalOldBooth = Number(prompt('총 구형 기표대는 몇 개인가요? (숫자만 입력, 수정 가능)'));
        const totalNewBooth = Number(prompt('총 신형 기표대는 몇 개인가요? (숫자만 입력, 수정 가능)'));
        const totalBox = Number(prompt('총 투표함은 몇 개인가요? (숫자만 입력, 수정 가능)'));
        const countInfo = [];
        countInfo.push(totalOldBooth, totalNewBooth, totalBox);
        localStorage.setItem('countInfo', JSON.stringify(countInfo));
        _insertCountInfo(countInfo);
    }

    function _insertCurrentCount(currentCount){
        console.log(currentCount);
        const rentableOldBooth = document.querySelector('.rentableOldBooth'),
            rentableNewBooth = document.querySelector('.rentableNewBooth'),
            rentableBox = document.querySelector('.rentableBox');

        rentableOldBooth.innerText = currentCount[0];
        rentableNewBooth.innerText = currentCount[1];
        rentableBox.innerText = currentCount[2];
    }

    // 대여 가능한 개수 불러오기
    if (localStorage.getItem('currentCount')){
        const currentCount = JSON.parse(localStorage.getItem('currentCount'));
        _insertCurrentCount(currentCount);
    } else {
        const currentCount = JSON.parse(localStorage.getItem('countInfo'));
        console.log(currentCount, '대여 가능한 수');
        localStorage.setItem('currentCount', JSON.stringify(currentCount));
    }

    // localStorage에 arr 저장
    function _saveToStorage(arr) {
        localStorage.setItem('arrOfObj', JSON.stringify(arr));
    }


    function _makeCalendarFrame() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth() + 1;
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
        _addMain(nowYear, nowMonth);

    }

    // 메인 달력에 추가하는 함수
    function _addMain(year, month) {
        const dateColumn = document.querySelectorAll('.dateColumn')

        // 지금 달력의 년도, 월에 맞는 데이터만 추출
        const arrOfObj = JSON.parse(localStorage.getItem('arrOfObj'));
        const thisPageList = [];
        console.log(arrOfObj, '현재 저장된 리스트들');

        for (let i = 0; i < arrOfObj.length; i++) {
            if (arrOfObj[i].date.split('-')[0] == year && arrOfObj[i].date.split('-')[1] == month) {
                thisPageList.push(arrOfObj[i]);
            }
        };
        localStorage.setItem('thisPageList', JSON.stringify(thisPageList));

        for (let i = 0; i < dateColumn.length; i++) {
            if (dateColumn[i].childElementCount >= 1) {
                for (let j = 0; j < thisPageList.length; j++) {
                    if (dateColumn[i].childNodes[0].innerText == thisPageList[j].date.split('-')[2]) {
                        const list = document.createElement('div');
                        list.classList.add('list');
                        if(thisPageList[j].checked){
                            list.classList.add('checked');
                        }
                        list.innerHTML = thisPageList[j].name + '<br>-기표대 ' + thisPageList[j].count + '<br>-투표함 ' + thisPageList[j].boxCount;

                        dateColumn[i].appendChild(list);
                    }
                }
            }
        }

        _setOpenModal();
        _setCheckList();
    }

    // 날짜가 입력된 칸만 event 지정되도록 설정
    function _setOpenModal() {
        const dateColumn = document.querySelectorAll('.dateColumn');
        for (let i = 0; i < dateColumn.length; i++) {
            if (dateColumn[i].childNodes[0]) {
                dateColumn[i].addEventListener('click', _clickColumn);
            }
        }
    }

    function _clickColumn(e) {
        if (e.target.className == 'list') {

        } else if (e.target.className == 'date') {
            _openModal(e.target.innerText);
        } else if (e.target.className == 'dateColumn') {
            _openModal(e.target.childNodes[0].innerText);
        }

        orgName.focus();
    }

    // main 화면에서 list 클릭했을 때 표시하는 기능 (대여 여부)
    function _setCheckList(){
        const dateColumn = document.querySelectorAll('.dateColumn');
        for (let i = 0; i < dateColumn.length; i++) {
            if (dateColumn[i].childNodes[1]) {
                _checkList(dateColumn[i].childNodes);
            }
        }
    }

    function _checkList(dateChilds){
        let arrOfObj = JSON.parse(localStorage.getItem('arrOfObj'));
        const thisPageList = JSON.parse(localStorage.getItem('thisPageList'));
        const date = dateChilds[0].innerText;
        const thisDateList = [];
        
        for (let i = 0; i < thisPageList.length; i++) {
            if (thisPageList[i].date.split('-')[2] == date) {
                thisDateList.push(thisPageList[i]);
            }
        };

        for (let i = 1; i < dateChilds.length; i++){
            dateChilds[i].addEventListener('click', function(e){
                const idx = arrOfObj.findIndex(function (item) { return item.id === thisDateList[i-1].id });
                if(arrOfObj[idx].checked){
                    arrOfObj[idx].checked = false;
                } else {
                    arrOfObj[idx].checked = true;
                }

                _saveToStorage(arrOfObj);
                _deleteFrame();
                _makeCalendarFrame();
            })
        }
    }

    const modalContainer = document.querySelector('.dark');
    const clickedDate = document.querySelector('.clickedDate');
    const orgName = document.getElementById('orgName');
    const returnDate = document.getElementById('returnDate');
    const listContainer = document.querySelector('.listContainer');

    function _openModal(date) {
        modalContainer.classList.add('opened');
        const nowYear = today.getFullYear();
        const nowMonth = today.getMonth() + 1;
        const thisPageList = JSON.parse(localStorage.getItem('thisPageList'));
        const thisModalList = [];

        clickedDate.innerText = '';

        clickedDate.innerText = nowYear + '년 ' + nowMonth + '월 ' + date + '일';
        
        // 좌측 리스트 영역 초기화
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }
        
        for (let i = 0; i < thisPageList.length; i++) {
            if (thisPageList[i].date.split('-')[2] == date) {
                const resList = document.createElement('div');
                resList.classList.add('resList');
                resList.innerHTML =
                    "<div class='resName'>" + thisPageList[i].name + "</div>" +
                    "<div class='count'><p class='resKind'>" + thisPageList[i].kind + "</p>" +
                    " 기표대:<p class='resCount'>" + thisPageList[i].count + "</p>개, 투표함: <p class='resBoxCount'>" +
                    thisPageList[i].boxCount + "</p>개</div>" + "<div class='resDate'>반납예정일: <p class='returnDate'>" +
                    thisPageList[i].returnDate + "</p></div>" + "<div class='deleteBtn'><i class='fas fa-trash-alt'></i></div>"

                listContainer.appendChild(resList);
                thisModalList.push(thisPageList[i]);
            }
        };

        // deleteBtn 활성화
        _activeDelete(thisModalList, date);
    }

    // 달력 오른쪽 상단 year, month 표시
    _showYearMonth();

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

    // calendarFrame 삭제
    function _deleteFrame() {
        const rowCount = calTable.childElementCount - 1;
        for (let i = 1; i <= rowCount; i++) {
            const dateRow = document.querySelector('.dateRow');
            calTable.removeChild(dateRow);
        }
    }

    function _yearUp() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth();
        today = new Date(nowYear + 1, nowMonth, 1);
        _deleteFrame();
        _makeCalendarFrame();
        _showYearMonth();

    };

    function _yearDown() {
        let nowYear = today.getFullYear();
        let nowMonth = today.getMonth();
        today = new Date(nowYear - 1, nowMonth, 1);
        _deleteFrame();
        _makeCalendarFrame();
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
        _makeCalendarFrame();
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
        _makeCalendarFrame();
        _showYearMonth();
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
        this.id = uuidv4();
        this.checked = false;
    }

    const submitBtn = document.querySelector('.submitBtn');
    const kind1 = document.getElementById('kind1');
    const count = document.getElementById('count');
    const boxCount = document.getElementById('boxCount');


    submitBtn.addEventListener('click', _submitClick);

    function _submit(date) {
        arrOfObj = JSON.parse(localStorage.getItem('arrOfObj'));

        if (orgName.value) {
            // 객체 생성
            const currentYear = document.querySelector('.year').innerText;
            const currentMonth = document.querySelector('.month').innerText;
            const theDate = date.substring(date.lastIndexOf('월') + 2, date.lastIndexOf('일'));
            const reservedList = new Reserved(orgName.value, currentYear + '-' + currentMonth + '-' + theDate, (kind1.checked ? '(구)' : '(신)'), count.value, boxCount.value, returnDate.value, false);

            // 객체 배열에 추가 후 localStorage에 저장
            arrOfObj.push(reservedList);
            _saveToStorage(arrOfObj);
            
            // currentInfo 생성 및 적용
            const currentCount = JSON.parse(localStorage.getItem('currentCount'));

            if(kind1.checked){
                currentCount[0] = currentCount[0] - count.value;
            } else {
                currentCount[1] = currentCount[1] - count.value;
            }
            currentCount[2] = currentCount[2] - boxCount.value;
            
            localStorage.setItem('currentCount', JSON.stringify(currentCount));
            

            // Input 초기화
            orgName.value = '';
            kind1.checked = true;
            count.value = 0;
            boxCount.value = 0;

            // 메인 달력 초기화 및 추가
            _deleteFrame();
            _makeCalendarFrame();
            _openModal(theDate);
        }
    }


    // localStorage 저장 및 호출을 위한 unique id 생성 함수

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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
                        if (e.path[i].childNodes[j].className == 'submitBtn') {
                            _submitClick(e);
                        }
                }
            }
        }
    });

    // 리스트를 인자로 currentCount 개수 증가되는 함수
    function _incCurCount(kind, count, boxCount){
        const currentCount = JSON.parse(localStorage.getItem('currentCount'));
        if(kind == '(구)'){
            currentCount[0] = currentCount[0] + Number(count);
        } else {
            currentCount[1] = currentCount[1] + Number(count);
        }
        currentCount[2] = currentCount[2] + Number(boxCount);
        
        console.log(currentCount);
        localStorage.setItem('currentCount', JSON.stringify(currentCount));
    }


    // delete 버튼 누를 시 해당 리스트 삭제
    function _activeDelete(thisModalList, date) {
        const deleteBtn = document.querySelectorAll('.deleteBtn');
        let arrOfObj = JSON.parse(localStorage.getItem('arrOfObj'));

        for (let i = 0; i < deleteBtn.length; i++) {
            deleteBtn[i].addEventListener('click', function (e) {
                const idx = arrOfObj.findIndex(function (item) { return item.id === thisModalList[i].id });
                if (idx > -1) {
                    _incCurCount(arrOfObj[idx].kind, arrOfObj[idx].count, arrOfObj[idx].boxCount);
                    arrOfObj.splice(idx, 1);
                }
                _saveToStorage(arrOfObj);
                _deleteFrame();
                _makeCalendarFrame();
                _openModal(date);
            });
        }

    }




}())


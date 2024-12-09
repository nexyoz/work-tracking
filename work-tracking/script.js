// 初始化本地存储
let workRecords = JSON.parse(localStorage.getItem('workRecords')) || [];

// 设置默认值
function setDefaultDateTime() {
    document.getElementById('workDate').valueAsDate = new Date();
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    document.getElementById('workTime').value = time;
}

setDefaultDateTime();

// 添加工作记录
function addWorkRecord() {
    const date = document.getElementById('workDate').value;
    const time = document.getElementById('workTime').value;
    const content = document.getElementById('workContent').value;
    const type = document.getElementById('workType').value;

    if (!date || !time || !content) {
        alert('请填写完整信息！');
        return;
    }

    const record = {
        id: Date.now(),
        date: date,
        time: time,
        content: content,
        type: type
    };

    workRecords.push(record);
    saveRecords();
    displayRecords();
    clearInputs();

    // 添加成功的视觉反馈
    const addBtn = document.querySelector('.add-btn');
    addBtn.innerHTML = '<i class="fas fa-check"></i> 添加成功';
    addBtn.style.backgroundColor = '#10b981';
    setTimeout(() => {
        addBtn.innerHTML = '<i class="fas fa-plus"></i> 添加记录';
        addBtn.style.backgroundColor = '#4a90e2';
    }, 1000);
}

// 删除工作记录
function deleteRecord(id) {
    if (confirm('确定要删除这条记录吗？')) {
        workRecords = workRecords.filter(record => record.id !== id);
        saveRecords();
        displayRecords();
    }
}

// 保存记录到本地存储
function saveRecords() {
    localStorage.setItem('workRecords', JSON.stringify(workRecords));
}

// 清空输入框
function clearInputs() {
    document.getElementById('workContent').value = '';
    setDefaultDateTime();
}

// 搜索和过滤记录
function filterRecords() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    displayRecords(searchText);
}

// 按日期对记录进行分组
function groupRecordsByDate(records) {
    return records.reduce((groups, record) => {
        const date = record.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(record);
        return groups;
    }, {});
}

// 显示所有记录
function displayRecords(searchText = '') {
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = '';

    // 过滤记录
    let filteredRecords = workRecords;
    if (searchText) {
        filteredRecords = filteredRecords.filter(record => 
            record.content.toLowerCase().includes(searchText) ||
            record.type.toLowerCase().includes(searchText) ||
            formatDate(record.date).toLowerCase().includes(searchText)
        );
    }

    // 按日期分组并排序
    const groupedRecords = groupRecordsByDate(filteredRecords);
    const sortedDates = Object.keys(groupedRecords).sort((a, b) => new Date(b) - new Date(a));

    if (sortedDates.length === 0) {
        recordsList.innerHTML = '<div class="no-records">暂无记录</div>';
        return;
    }

    // 显示分组记录
    sortedDates.forEach(date => {
        const dateGroup = document.createElement('div');
        dateGroup.className = 'date-group';
        
        // 添加日期标题
        const dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.innerHTML = `
            <i class="fas fa-calendar-day"></i>
            ${formatDate(date)}
        `;
        dateGroup.appendChild(dateHeader);

        // 添加该日期的记录
        const dateRecords = document.createElement('div');
        dateRecords.className = 'date-records';

        // 按时间排序当天的记录
        const sortedRecords = groupedRecords[date].sort((a, b) => a.time.localeCompare(b.time));
        
        sortedRecords.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.className = 'work-record';
            recordElement.innerHTML = `
                <div class="record-content">
                    <div class="record-time">
                        <i class="fas fa-clock"></i>
                        ${record.time}
                    </div>
                    <div>
                        ${record.content}
                        <span class="record-type" data-type="${record.type}">
                            ${record.type}
                        </span>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteRecord(${record.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            dateRecords.appendChild(recordElement);
        });

        dateGroup.appendChild(dateRecords);
        recordsList.appendChild(dateGroup);
    });
}

// 格式化日期显示
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
}

// 页面加载时显示现有记录
displayRecords();
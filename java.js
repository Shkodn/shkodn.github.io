Telegram.WebApp.ready();
Telegram.WebApp.expand();



let currentOperation = null;
let currentGroup = 'Основная';
let groups = JSON.parse(localStorage.getItem('financeGroups')) || ['Основная'];
let logs = JSON.parse(localStorage.getItem('financeLogs')) || [];
let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;


updateTotalAmount();
renderGroups();
renderLogs();


$('.UpButton').click(function() {
    $('.groups-modal').toggleClass('active');
    $('#groupInput').hide();
});


$('#createGroupBtn').click(function() {
    $('#groupInput').show().focus();
    $(this).hide();
});


$('#groupInput').keypress(function(e) {
    if (e.which === 13 && $(this).val().trim()) {
        const newGroup = $(this).val().trim();
        if (!groups.includes(newGroup)) {
            groups.push(newGroup);
            localStorage.setItem('financeGroups', JSON.stringify(groups));
            renderGroups();
        }
        $(this).val('').hide();
        $('#createGroupBtn').show();
    }
});


$(document).on('click', '.group-delete', function(e) {
    e.stopPropagation();
    const group = $(this).closest('.group-item').data('group');
    if (group === currentGroup) {
        currentGroup = 'Основная';
        $('#currentGroup').text(currentGroup);
    }
    groups = groups.filter(g => g !== group);
    localStorage.setItem('financeGroups', JSON.stringify(groups));
    renderGroups();
});


$(document).on('click', '.group-item', function() {
    currentGroup = $(this).data('group');
    $('#currentGroup').text(currentGroup);
    $('.group-item').removeClass('active');
    $(this).addClass('active');
    $('.groups-modal').removeClass('active');
});


$('.Pribl').click(function() {
    currentOperation = 'plus';
    $('#modalTitle').text('Введите сумму прибыли');
    $('#amountInput').val('');
    $('#amountModal').addClass('active');
    $('#amountInput').focus();
});


$('.Minus').click(function() {
    currentOperation = 'minus';
    $('#modalTitle').text('Введите сумму расхода');
    $('#amountInput').val('');
    $('#amountModal').addClass('active');
    $('#amountInput').focus();
});


$('#confirmBtn').click(function() {
    const amount = parseFloat($('#amountInput').val());
    if (amount && amount > 0 && currentOperation) {
        addLog(currentOperation, amount, currentGroup);
        $('#amountModal').removeClass('active');
        currentOperation = null;
    }
});


$('#cancelBtn').click(function() {
    $('#amountModal').removeClass('active');
    currentOperation = null;
});


$(document).click(function(e) {
    if (!$(e.target).closest('.groups-modal, .UpButton').length) {
        $('.groups-modal').removeClass('active');
    }
    if ($(e.target).hasClass('amount-modal')) {
        $('#amountModal').removeClass('active');
    }
});


function renderGroups() {
    $('#groupList').empty();
    groups.forEach(group => {
        const isActive = group === currentGroup ? 'active' : '';
        $('#groupList').append(`
            <div class="group-item ${isActive}" data-group="${group}">
                <span class="group-name">${group}</span>
                ${group !== 'Основная' ? '<button class="group-delete">×</button>' : ''}
            </div>
        `);
    });
}

function addLog(type, amount, group) {
    const date = new Date().toLocaleString('ru-RU');
    const log = {
        id: Date.now(),
        type: type,
        amount: amount,
        group: group,
        date: date
    };

    logs.unshift(log);
    if (type === 'plus') {
        totalAmount += amount;
    } else {
        totalAmount -= amount;
    }

    localStorage.setItem('financeLogs', JSON.stringify(logs));
    localStorage.setItem('totalAmount', totalAmount.toString());

    updateTotalAmount();
    renderLogs();
}

function renderLogs() {
    $('#logsList').empty();
    if (logs.length === 0) {
        $('#logsList').html('<div style="text-align: center; color: #666; padding: 40px;">Нет операций</div>');
        return;
    }

    logs.forEach(log => {
        const isPlus = log.type === 'plus';
        $('#logsList').append(`
            <div class="log-item ${isPlus ? '' : 'minus'}">
                <div class="log-details">
                    <div>${isPlus ? '➕ Прибыль' : '➖ Расход'}</div>
                    <div class="log-group">${log.group}</div>
                    <div class="log-date">${log.date}</div>
                </div>
                <div class="log-amount ${isPlus ? 'plus' : 'minus'}">
                    ${isPlus ? '+' : '-'}${log.amount} ₽
                </div>
            </div>
        `);
    });
}

function updateTotalAmount() {
    $('#totalAmount').text(`${totalAmount.toFixed(2)} ₽`);
    if (totalAmount >= 0) {
        $('#totalAmount').css('background', 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)');
    } else {
        $('#totalAmount').css('background', 'linear-gradient(135deg, #ff4757 0%, #c44569 100%)');
    }
    $('#totalAmount').css('-webkit-background-clip', 'text');
    $('#totalAmount').css('-webkit-text-fill-color', 'transparent');
}


$(document).keydown(function(e) {

    if (e.key === 'Escape') {
        $('.groups-modal').removeClass('active');
        $('#amountModal').removeClass('active');
    }

    if (e.key === '+' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        $('.Pribl').click();
    }

    if (e.key === '-' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        $('.Minus').click();
    }
});
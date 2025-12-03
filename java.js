
Telegram.WebApp.ready();
Telegram.WebApp.expand();

$('.Pribl').click(function() {
        currentOperation = 'plus';
        $('#modalTitle').text('Введите сумму прибыли');
        $('#amountInput').val('');
        $('#commentInput').val('');
        $('#amountModal').addClass('active');
        $('#amountInput').focus();
    });

$('.Minus').click(function() {
    currentOperation = 'minus';
    $('#modalTitle').text('Введите сумму расхода');
    $('#amountInput').val('');
    $('#commentInput').val('');
    $('#amountModal').addClass('active');
    $('#amountInput').focus();
});

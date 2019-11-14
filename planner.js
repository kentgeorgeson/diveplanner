function calcTotals() {

    var sum = 0;
    var count = 0;
    var max = 0
    $('.depth').each(function()
        {
           /* Capture Max Depth */
           if (parseFloat($(this).val()) > max) {
               max = parseFloat($(this).val())
           }

           /* Sum all depth's */
           if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
           }          

           /* Count of depth rows to calc average */
           count += 1;
        });

    /* Set the descent and ascent value to half the max depth  */
    $('.avg-depth').val(max/2);

    sum = 0;
    $('.ap').each(function()
    {
        /* Calc Atmospheric pressure based on depth of stop / 32 + 1 */
        var aP = 0
        if ($(this).parent().parent().find('.depth').length) {
            aP = Math.round((parseFloat($(this).parent().parent().find('.depth').val()) / 32 + 1) * 10) /10;
        }
        if ($(this).parent().parent().find('.avg-depth').length) {
            aP = Math.round((parseFloat($(this).parent().parent().find('.avg-depth').val()) / 32 + 1) * 10) /10;
        }
        $(this).val(aP);
     
        if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
        }
    });
    $('.total-ap').val(sum);

    sum = 0;
    $('.sac').each(function()
    {
        
        var sac = Math.round( parseFloat($(this).parent().parent().find('.ap').val()) * $('.sac-min').val() * 10) / 10;
        $(this).parent().parent().find('.sac').val(sac);

        if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
        }
    });
    $('.total-sac').val(sum);

    sum = 0;
    $('.time').each(function()
    {
        if ($(this).hasClass('ascend')) {
            $(this).val(Math.round(max / parseFloat($('.ascent-rate').val()) * 10) /10)
        }
        if ($(this).hasClass('descend')) {
            $(this).val(Math.round(max / parseFloat($('.descent-rate').val()) * 10) /10)
        }
        var vol = Math.ceil(parseFloat($(this).val()) * $(this).parent().parent().find('.sac').val());
        $(this).parent().parent().find('.vol').val(vol);
        if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
        }
    });
    $('.total-time').val(sum);

    sum = 0;
    $('.vol').each(function()
    {
        if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
        }
    });
    $('.total-vol').val(sum);


}


$(document).on('click', '.duplicate-row', function() {
        $(this).parent().parent().clone().insertAfter( $(this).parent().parent() );
});

$(document).on('click', '.remove-row', function() {
    $(this).parent().parent().remove();
});

$(document).on('keyup', '.edit-field', function() {
    calcTotals();
})

$(document).ready(function() {
    calcTotals();
})
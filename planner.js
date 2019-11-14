function drawDivePlan() {
    var c = document.getElementById("diveplan");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    var width = c.width;
    var height = c.height;
    
    var startx = 10;
    var starty = 10;
    var count = 1;
    var time = 0 + starty;
    var depth = 0 + startx;

    $('.stop-row').each( function() {
        
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(time, depth);
        depth = parseFloat($(this).find('input.depth').val()) + starty
        descendtime = depth / parseFloat($(this).find('descent-rate').val())
        time = time + parseFloat($(this).find('input.time').val())
        ctx.lineTo(time, depth);
        ctx.stroke();

        /* Start at previous X & Y */

        /* Calc Change in depth */
            /* If descending, take descend depth * rate of descent */

            /* If ascending, take ascend depth * rate of ascend */

            /* add to time */

        /* Draw previous to at depth */

        /* Maintain depth for duration given and draw from arrival to departure */

    });
}

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
            $(this).val(Math.ceil(max / parseFloat($('.ascent-rate').val())))
        }
        if ($(this).hasClass('descend')) {
            $(this).val(Math.ceil(max / parseFloat($('.descent-rate').val())))
        }
        var vol = Math.ceil(parseFloat($(this).val()) * $(this).parent().parent().find('.sac').val());
        $(this).parent().parent().find('.vol').val(vol);
        if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
        }
    });
    $('.total-time').val(sum);

    var reservevol = Math.round(parseFloat($('.end-psi').val()) / 3000 * parseFloat($('.tank-size').val()) * 10 ) /10
    $('.reserve-vol').val(reservevol)

    sum = 0;
    $('.vol').each(function()
    {
        if (!(isNaN(parseFloat($(this).val())))) {
            sum += parseFloat($(this).val());
        }
    });
    $('.total-vol').val(sum + reservevol);

    if (parseFloat($('.total-vol').val()) >= parseFloat($('.tank-size').val())) {
        $('.total-vol').addClass('gas-out');
        $('.total-vol').removeClass('gas-warn'); 
        $('.total-vol').removeClass('gas-plenty');
    } else if (parseFloat($('.total-vol').val()) >= parseFloat($('.tank-size').val())*.9) {
        $('.total-vol').removeClass('gas-out');
        $('.total-vol').addClass('gas-warn'); 
        $('.total-vol').removeClass('gas-plenty'); 
    } else {
        $('.total-vol').removeClass('gas-out');
        $('.total-vol').removeClass('gas-warn'); 
        $('.total-vol').addClass('gas-plenty'); 
    }

    drawDivePlan();
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
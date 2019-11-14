function markTime(time) {
    var c = document.getElementById("diveplan");
    var ctx = c.getContext("2d");
    var timescalefactor = 10.0;
    ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
    ctx.strokeStyle = "#fff";
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(time * timescalefactor, 0);
    ctx.lineTo(time * timescalefactor, c.height - 30);
    ctx.stroke();
    ctx.fillText(time, (time * timescalefactor) - 1, c.height - 15)
}

function markStop(fromtime, fromdepth, totime, todepth) {
    var c = document.getElementById("diveplan");
    var ctx = c.getContext("2d");
    var timescalefactor = 10.0;
    ctx.setLineDash([0]);/*dashes are 5px and spaces are 3px*/
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(fromtime * timescalefactor, fromdepth);
    ctx.lineTo(totime * timescalefactor, todepth);
    ctx.stroke();
}

function drawDivePlan() {
    var c = document.getElementById("diveplan");
    c.setAttribute('width', '400');
    c.setAttribute('height', '170');   
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    var width = c.width;
    var height = c.height;
   
    var count = 1;
    var time = 0;
    var depth = 0; 

    $('.stop-row').each( function() {
        
        var prevtime = Math.ceil(parseFloat(time));
        var prevdepth = Math.ceil(parseFloat(depth));
        
        newdepth = parseFloat($(this).find('.depth').val()) - depth;
        if (newdepth >= 0) {
            timetodepth = Math.ceil(newdepth / parseFloat($('#descent-rate').val()))
        } else {
            timetodepth = Math.ceil(Math.abs(newdepth) / parseFloat($('#ascent-rate').val()))
        }
        time = Math.ceil(prevtime + timetodepth);
        depth = Math.ceil(prevdepth + newdepth);

        markStop(prevtime, prevdepth, time, depth);
        prevtime = time;

        timeatdepth = Math.ceil(parseFloat($(this).find('input.time').val()));
        time = prevtime + timeatdepth;
        markStop(prevtime, depth, time, depth);
        markTime(time);
        count++;
    });
    
    finaltime = Math.round(parseFloat($('.total-time').val()))
    markStop(time, depth, finaltime, 0);
    

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
        var waterdivisor = parseFloat($('#water-type').val())
        if ($(this).parent().parent().find('.depth').length) {
            aP = Math.round((parseFloat($(this).parent().parent().find('.depth').val()) / waterdivisor + 1) * 10) /10;
        }
        if ($(this).parent().parent().find('.avg-depth').length) {
            aP = Math.round((parseFloat($(this).parent().parent().find('.avg-depth').val()) / waterdivisor + 1) * 10) /10;
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
    calcTotals();
});

$(document).on('click', '.remove-row', function() {
    $(this).parent().parent().remove();
    calcTotals();
});


$(document).on('click', 'input', function() {
    $(this).select();
});

$(document).on('keyup', '.edit-field', function() {
    calcTotals();
})

$(document).ready(function() {
    calcTotals();
})
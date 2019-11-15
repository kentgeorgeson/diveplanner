function refreshSlate() {

    var count = 0;
    var cumulativetime = 0;
    var cumulativevol = 0;
    var startingvol = parseFloat($('.starting-pressure').val());
    var tanksize = parseFloat($('.tank-size').val());

    $('.slate-row').remove();
    $('.stop-row').each( function() {
        var insertString = '<div id="stop' + count + '" class="table-row slate-data-row slate-row"></div>';
        if (count==0) {
            $(insertString).insertAfter(".diveslate .header-row");
        } else {
            $(insertString).insertAfter(".diveslate .slate-row:last-of-type");
        }

        insertString = '<div class="table-col"><input readonly id="slate-depth-' + count + '" class="ro-field slate-depth" type="number" min="0" max="999"/> </div>';
        insertString += '<div class="table-col"><input readonly id="slate-time-' + count + '" class="ro-field slate-time" type="number" min="0" max="99"/> </div>';
        insertString += '<div class="table-col"><input readonly id="slate-tp-' + count + '" class="ro-field slate-tp" type="number" min="0" max="9999"/> </div>';
        $(".diveslate .slate-row:last-of-type").html(insertString);

        $('#slate-depth-' + count).val(parseFloat($(this).find('input.depth').val()));

        cumulativetime += parseFloat($(this).find('input.run-time').val());
        $('#slate-time-' + count).val(cumulativetime);

        cumulativevol += parseFloat($(this).find('input.vol').val());
        consumedpsi = Math.round(cumulativevol / tanksize * startingvol / 100) * 100;
        turningpoint = startingvol - consumedpsi
        $('#slate-tp-' + count).val(turningpoint);

        count++;
    });

    count++;
    var insertString = '<div id="stop' + count + '" class="table-row slate-data-row slate-row"></div>';
    if (count==0) {
        $(insertString).insertAfter(".diveslate .header-row");
    } else {
        $(insertString).insertAfter(".diveslate .slate-row:last-of-type");
    }

    insertString = '<div class="table-col"><input readonly id="slate-depth-' + count + '" class="ro-field slate-depth" type="number" min="0" max="999"/> </div>';
    insertString += '<div class="table-col"><input readonly id="slate-time-' + count + '" class="ro-field slate-time" type="number" min="0" max="99"/> </div>';
    insertString += '<div class="table-col"><input readonly id="slate-tp-' + count + '" class="ro-field slate-tp" type="number" min="0" max="9999"/> </div>';
    $(".diveslate .slate-row:last-of-type").html(insertString);

    $('#slate-depth-' + count).val(0);
    $('#slate-time-' + count).val(Math.round(parseFloat($('.total-time').val())));

    cumulativevol = parseFloat($('.total-vol').val());
    reservevol = parseFloat($('.end-psi').val());
    consumedpsi = Math.round(cumulativevol / tanksize * startingvol / 100) * 100;
    turningpoint = startingvol - consumedpsi + reservevol
    $('#slate-tp-' + count).val(turningpoint);

}


function markTime(time) {
    var c = document.getElementById("diveplan");
    var ctx = c.getContext("2d");
    var timescalefactor = (c.width - 10) / parseFloat($('.total-time').val());
    ctx.setLineDash([5, 3]);/*dashes are 5px and spaces are 3px*/
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(time * timescalefactor, 0);
    ctx.lineTo(time * timescalefactor, c.height - 30);
    ctx.stroke();
    ctx.fillText(time, (time * timescalefactor), c.height - 15)
}

function markStop(fromtime, fromdepth, totime, todepth) {
    var c = document.getElementById("diveplan");
    var ctx = c.getContext("2d");
    var timescalefactor = (c.width - 10) / parseFloat($('.total-time').val());
    ctx.setLineDash([0]);/*dashes are 5px and spaces are 3px*/
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(fromtime * timescalefactor, fromdepth);
    ctx.lineTo(totime * timescalefactor, todepth);
    ctx.stroke();

    if (fromdepth == todepth) {
        ctx.font = "12px Arial";
        ctx.fillStyle = "#eee";
        ctx.fillText(todepth + "'", (fromtime * timescalefactor), todepth + 15)   
    }

}

function calcDivePlan() {
    var c = document.getElementById("diveplan");   
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    var width = c.width;
    var height = c.height;
   
    var count = 1;
    var time = 0;
    var depth = 0; 
    var runvol = 0;

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

        runvol += parseFloat($(this).find('.vol').val())

        markStop(prevtime, prevdepth, time, depth);
        prevtime = time;

        

        timeatdepth = Math.ceil(parseFloat($(this).find('input.time').val()));
        time = prevtime + timeatdepth;
        markStop(prevtime, depth, time, depth);
        markTime(time);

        $(this).find('input.run-time').val(time)
        $(this).find('input.run-vol').val(runvol)

        count++;
    });  

    finaltime = Math.round(parseFloat($('.total-time').val()))

    $('.final.run-time').val(finaltime);
    $('.final.run-vol').val(runvol + parseFloat($('.final.vol').val()));
    markStop(time, depth, finaltime , 0);
}

function calcTotals() {
    var sum = 0;
    var count = 0;
    var max = 0

    $('.final-depth').val(parseFloat($('.edit-field.depth:last').val()))

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
        if ($(this).hasClass('final')) {
            $(this).val(Math.ceil(parseFloat($('.final-depth').val()) / parseFloat($('.ascent-rate').val())))
        }
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

    var reservevol = Math.round(parseFloat($('.end-psi').val()) / parseFloat($('.starting-pressure').val()) * parseFloat($('.tank-size').val()) * 10 ) /10
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

    calcDivePlan();
    refreshSlate();
    $('.ro-field').attr('tabindex', '-1');
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

$(window).bind('resize', function () {
    var c = document.getElementById("diveplan");
    c.setAttribute('width', $('.divechart').width());
}).trigger('resize');

$(document).ready(function() {
    var c = document.getElementById("diveplan");
    c.setAttribute('width', $('.divechart').width());
    c.setAttribute('height', '170');

    calcTotals();
})
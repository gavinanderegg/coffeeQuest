var Effects = {

    updateValue: function(target, value) {

        var t = $(target);
        t.find('.indicator').remove()
        var currentVal = parseInt(t.text());
        var diff = value - currentVal

        if (!diff) return;

        var indicator = $('<div></div>').addClass('indicator')
        if (diff > 0) indicator.addClass('pos')
        else indicator.addClass('neg')
        indicator.text(diff)

        t.html(value)
        t.parent().append(indicator)

        setTimeout( function() {
            indicator.addClass('doubleSize').delay(1500).fadeOut(0, function() {
                $(this).remove()        
            })
        }, 100)

        

    }   

}

$(function () {

    var globie = Snap("#globie"), // assign svg #globie as Snap object
        lefteye = globie.select("#leftEye"), // select #leftEye from globie object
        leftball = globie.ellipse(220, 150, 27, 40).attr({}), // draw left eyeball in globie object
        righteye = globie.select("#rightEye"), // select #rightEye from globie object
        rightball = globie.ellipse(280, 150, 27, 40).attr({}), // draw right eyeball in globie object
        body = globie.select("#globieBody"),
        globieBody = document.querySelector('#globie'),
        globieLegs = document.querySelector('#legs'),

        lenl = Snap.path.getTotalLength(lefteye), // get length of left eye path
        lenr = Snap.path.getTotalLength(lefteye), // get length of right eye path
        bbl = Snap.path.getBBox(lefteye), // get bounding box of left eye path
        bbr = Snap.path.getBBox(righteye), // get bounding box of right eye path
        midl = {
            x: bbl.x + (bbl.width / 2),
            y: bbl.y + (bbl.height / 2)
        }, // find center point of left eye
        midr = {
            x: bbr.x + (bbr.width / 2),
            y: bbr.y + (bbr.height / 2)
        }, // find center point of right eye

        lpal = Snap.path.getPointAtLength(lefteye), // Returns the (x,y) coordinate in user space which is distance units along the path
        rpal = Snap.path.getPointAtLength(righteye); // Returns the (x,y) coordinate in user space which is distance units along the path

// Eyeballs follow cursor
    $(document).mousemove(function (e) {

        mX = e.pageX - $('#globie').offset().left;
        mY = e.pageY - $('#globie').offset().top;

        tl = Snap.angle(midl.x, midl.y, mX, mY) / 360;
        tr = Snap.angle(midr.x, midr.y, mX, mY) / 360;

        lpal = lefteye.getPointAtLength((tl * lenl) % lenl);
        lpalx = lpal.x;
        lpaly = lpal.y;

        rpal = righteye.getPointAtLength((tr * lenr) % lenr);
        rpalx = rpal.x;
        rpaly = rpal.y;

        if (Snap.path.isPointInside(lefteye, mX, mY)) {
            leftball.attr({
                cx: mX,
                cy: mY
            });
        } else {
            leftball.attr({
                cx: lpalx,
                cy: lpaly
            });
        }

        if (Snap.path.isPointInside(righteye, mX, mY)) {
            rightball.attr({
                cx: mX,
                cy: mY
            });
        } else {
            rightball.attr({
                cx: rpalx,
                cy: rpaly
            });
        }

    });
// END Eyeballs follow cursor

    $(document).on('mousedown', '.globieParts', function (e) {
        mX = e.pageX - $('#globie').offset().left;
        mY = e.pageY - $('#globie').offset().top;
        zit = Math.floor(Math.random() * 20) + 10;
        globie.ellipse(mX, mY, zit, zit).attr({
            fill: 'url(#acne)',
            class: 'globieParts hole',
        }).insertAfter(body);
    });
    $(document).on('dblclick', function() {
        $('#globieBody').remove(globieBody);
    });

    // make globie blush on envelope hover
    $('#envelope').hover(
        function () {
            $('svg').find('#skin').css('fill','#FAAFBE');
        },
        function () {
            $('svg').find('#skin').css('fill','#FFFFFF');
        }
    );

    /*
    var bouncetime = 1800;

    var winH = $(window).height();

    $('.envelope').css({'bottom':'100%','right':'30px'});

    function objectbounce() {
        $('.envelope').animate({'bottom':'30px','right':'30px'}, { duration: bouncetime, easing: 'easeOutBounce', queue: false});
        $('.envelope').animate({transform:'rotate(360deg)'}, { duration: bouncetime, easing: 'easeInQuad', queue: false});
    }

    setTimeout(objectbounce,1000)*/




});

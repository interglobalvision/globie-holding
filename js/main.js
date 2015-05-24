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


  /* KEYS TO MOVE THE CAM */

  $(document).keydown( function(e) {
    var direction;
    switch(e.which) {
      case 37: // left
        direction = "left";
        break;

      case 38: // up
        direction = "up";
        break;

      case 39: // right
        direction = "right";
        break;

      case 40: // down
        direction = "down";
        break;

      default: return; // exit this handler for other keys
    }

    $.ajax({
      url: "https://ceaajxcodq.localtunnel.me/api/" + direction,
    });
    
  });

});
  

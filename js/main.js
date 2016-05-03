/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

  },

  onResize: function() {
    var _this = this;

  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },
};

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});

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

  if( window.innerWidth > 720 ) {
    // Eyeballs follow cursor
    $(document).mousemove(function (e) {
      moveEyes(e.pageX, e.pageY);
    });
  } else {
    if(window.DeviceOrientationEvent){
      window.addEventListener("deviceorientation", onDeviceOrientationChange, false);
    }
  }

  function onDeviceOrientationChange(event) {

    var x = (event.gamma + 90) / 180 * window.innerWidth;
    var y = (event.beta - 45 + 90) / 180 * window.innerHeight;

    moveEyes(x,y);
  }


  function moveEyes(posX, posY) {

    mX = posX - $('#globie').offset().left;
    mY = posY - $('#globie').offset().top;

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
  }

});

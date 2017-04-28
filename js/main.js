/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Globie, Snap */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    Globie.init();

    _this.Language.init();
    _this.fixWidows();

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

Site.Language = {
  init: function() {
    var _this = this;

    _this.$specific = $('.lang-specific');
    _this.$contentEn = $('.active-en');
    _this.$contentEs = $('.active-es');

    _this.bind();

    _this.detectLang();

  },

  bind: function() {
    var _this = this;

    $('.lang-switch').click(function() {
      var $this = $(this);

      _this.switchLang($this.data('lang'));

    });

  },

  switchLang: function(lang) {
    var _this = this;

    _this.$specific.hide();

    if (lang === 'es') {
      _this.$contentEs.show();
    } else {
      _this.$contentEn.show();
    }

  },

  detectLang: function() {
    // Detect browser language
     var userLang = navigator.language || navigator.userLanguage;

     if ( userLang.indexOf('es') > -1 ) {
       _this.switchLang('es');
     }
  },

};

Globie = {
  init: function() {
    var _this = this;

    // assign svg #globie as Snap object
    var globie = Snap('#globie');
    // select #leftEye from globie object
    _this.lefteye = globie.select('#leftEye');
    // draw left eyeball in globie object
    _this.leftball = globie.ellipse(220, 150, 27, 40).attr({});
    // select #rightEye from globie object
    _this.righteye = globie.select('#rightEye');
    // draw right eyeball in globie object
    _this.rightball = globie.ellipse(280, 150, 27, 40).attr({});

    // get length of left eye path
    _this.lenl = Snap.path.getTotalLength(_this.lefteye);
    // get length of right eye path
    _this.lenr = Snap.path.getTotalLength(_this.lefteye);
    // get bounding box of left eye path
    _this.bbl = Snap.path.getBBox(_this.lefteye);
    // get bounding box of right eye path
    _this.bbr = Snap.path.getBBox(_this.righteye);

    // find center point of left eye
    _this.midl = {
      x: _this.bbl.x + (_this.bbl.width / 2),
      y: _this.bbl.y + (_this.bbl.height / 2),
    };

    // find center point of right eye
    _this.midr = {
      x: _this.bbr.x + (_this.bbr.width / 2),
      y: _this.bbr.y + (_this.bbr.height / 2),
    };

    // Returns the (x,y) coordinate in user space which is distance units along the path
    _this.lpal = Snap.path.getPointAtLength(_this.lefteye);
    // Returns the (x,y) coordinate in user space which is distance units along the path
    _this.rpal = Snap.path.getPointAtLength(_this.righteye);

    _this.bind();

  },

  bind: function() {
    var _this = this;

    // mobile width check to be made does hover exist check
    if ( window.innerWidth > 720 ) {
      // Eyeballs follow cursor
      $(document).mousemove(function (e) {
        _this.moveEyes(e.pageX, e.pageY);
      });
    } else {
      if(window.DeviceOrientationEvent){
        window.addEventListener('deviceorientation', function(e) {
          return _this.onDeviceOrientationChange(e);
        }.bind(_this), false);
      }
    }

  },

  onDeviceOrientationChange: function(event) {
    var _this = this;

    var x = (event.gamma + 90) / 180 * window.innerWidth;
    var y = (event.beta - 45 + 90) / 180 * window.innerHeight;

    _this.moveEyes(x, y);

  },

  moveEyes: function(posX, posY) {
    var _this = this;

    var mX = posX - $('#globie').offset().left;
    var mY = posY - $('#globie').offset().top;

    var tl = Snap.angle(_this.midl.x, _this.midl.y, mX, mY) / 360;
    var tr = Snap.angle(_this.midr.x, _this.midr.y, mX, mY) / 360;

    var lpal = _this.lefteye.getPointAtLength((tl * _this.lenl) % _this.lenl);
    var lpalx = lpal.x;
    var lpaly = lpal.y;

    var rpal = _this.righteye.getPointAtLength((tr * _this.lenr) % _this.lenr);
    var rpalx = rpal.x;
    var rpaly = rpal.y;

    if (Snap.path.isPointInside(_this.lefteye, mX, mY)) {
      _this.leftball.attr({
        cx: mX,
        cy: mY,
      });
    } else {
      _this.leftball.attr({
        cx: lpalx,
        cy: lpaly,
      });
    }

    if (Snap.path.isPointInside(_this.righteye, mX, mY)) {
      _this.rightball.attr({
        cx: mX,
        cy: mY,
      });
    } else {
      _this.rightball.attr({
        cx: rpalx,
        cy: rpaly,
      });
    }

  },
};

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});

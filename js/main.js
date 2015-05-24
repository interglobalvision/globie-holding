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
      url: "http://webcam.carlossolar.es/api/" + direction,
    });
    
  });

});

/* SMOKE */

(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d");

canvas.height = document.body.offsetHeight;
canvas.width = 500;

var parts = [],
minSpawnTime = 40,
lastTime = new Date().getTime(),
maxLifeTime = Math.min(5000, (canvas.height/(1.5*60)*1000)),
emitterX = canvas.width / 2,
emitterY = canvas.height - 10,
smokeImage = new Image();

function spawn() {
  if (new Date().getTime() > lastTime + minSpawnTime) {
    lastTime = new Date().getTime();
    parts.push(new smoke(emitterX, emitterY));
  }
}

function render() {
  var len = parts.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  while (len--) {
    if (parts[len].y < 0 || parts[len].lifeTime > maxLifeTime) {
      parts.splice(len, 1);
    } else {
      parts[len].update();

      ctx.save();
      var offsetX = -parts[len].size/2,
      offsetY = -parts[len].size/2;

      ctx.translate(parts[len].x-offsetX, parts[len].y-offsetY);
      ctx.rotate(parts[len].angle / 180 * Math.PI);
      ctx.globalAlpha  = parts[len].alpha;
      ctx.drawImage(smokeImage, offsetX,offsetY, parts[len].size, parts[len].size);
      ctx.restore();
    }
  }
  spawn();
  requestAnimationFrame(render);
}

function smoke(x, y, index) {
  this.x = x;
  this.y = y;

  this.size = 1;
  this.startSize = 32;
  this.endSize = 40;

  this.angle = Math.random() * 359;

  this.startLife = new Date().getTime();
  this.lifeTime = 0;

  this.velY = -1 - (Math.random()*0.5);
  this.velX = Math.floor(Math.random() * (-6) + 3) / 10;
}

smoke.prototype.update = function () {
  this.lifeTime = new Date().getTime() - this.startLife;
  this.angle += 0.2;

  var lifePerc = ((this.lifeTime / maxLifeTime) * 100);

  this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * .1);

  this.alpha = 1 - (lifePerc * .01);
  this.alpha = Math.max(this.alpha,0);

  this.x += this.velX;
  this.y += this.velY;
}

smokeImage.src = "img/smoke.png";

smokeImage.onload = function () {
  render();
}

window.onresize = resizeMe;
window.onload = resizeMe;
function resizeMe() {
  canvas.height = document.body.offsetHeight;
}

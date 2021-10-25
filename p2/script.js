var scene = document.getElementById('scene');
var parallaxInstance = new Parallax(scene, {
  relativeInput: true
});

$(document).ready(function(){
    $(".layer3").animate({
      left: '250px',
      opacity: '0.5',
      height: '100%',
      width: '50%'
    }, 15000);
    $('.layer3').fadeOut(5000);

    function loop(){
   $('.layer9')
     .animate({top:12},1000)
     .animate({top:9},1000, loop);
   $('.layer8')
     .animate({left:14},1000)
     .animate({left:10},1000, loop);
   $('.layer7')
     .animate({right:16},1000)
     .animate({right:12},1000, loop);
  }
  
  loop();
   

  });

$(document).click(function() {
    var $element1 = $('.shooting_star1');
    setTimeout(function () {
        $element1.animate({width:800, opacity:0}, function () {
            $element1.fadeIn(100, function () {
                $element1.animate({width:1000, opacity:1},150, function () {
                  $element1.fadeOut(2000)
                })
            });
        });
    }, 4030);

var $element2 = $('.shooting_star2');
    setTimeout(function () {
        $element2.animate({width:800, opacity:0}, function () {
            $element2.fadeIn(100, function () {
                $element2.animate({width:1000, opacity:1},400, function () {
                  $element2.fadeOut(2000)
                })
            });
        });
    }, 1200);

var $element3 = $('.shooting_star3');
    setTimeout(function () {
        $element3.animate({width:800, opacity:0}, function () {
            $element3.fadeIn(100, function () {
                $element3.animate({width:2000, opacity:1},250, function () {
                  $element3.fadeOut(2000)
                })
            });
        });
    }, 531);    
  
var $element4 = $('.shooting_star4');
    setTimeout(function () {
        $element4.animate({width:800, opacity:0}, function () {
            $element4.fadeIn(100, function () {
                $element4.animate({width:1500, opacity:1},300, function () {
                  $element4.fadeOut(2000)
                })
            });
        });
    }, 2931);    

var $element5 = $('.shooting_star5');
    setTimeout(function () {
        $element5.animate({width:800, opacity:0}, function () {
            $element5.fadeIn(100, function () {
                $element5.animate({width:1400, opacity:1},350, function () {
                  $element5.fadeOut(2000)
                })
            });
        });
    }, 5931); 
});
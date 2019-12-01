/* Parallax Images Scroll - by
╱╱╱╱╱╱╱╱╱╱╭╮╭╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮
╱╱╱╱╱╱╱╱╱╭╯╰┫┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃
╭━━┳╮╱╭┳━╋╮╭┫╰━┳┳━━╮╭━━┳━━┳━╮╭━━┫╰━┳━━┳━━━╮
┃╭━┫┃╱┃┃╭╮┫┃┃╭╮┣┫╭╮┃┃━━┫╭╮┃╭╮┫╭━┫╭╮┃┃━╋━━┃┃
┃╰━┫╰━╯┃┃┃┃╰┫┃┃┃┃╭╮┃┣━━┃╭╮┃┃┃┃╰━┫┃┃┃┃━┫┃━━┫
╰━━┻━╮╭┻╯╰┻━┻╯╰┻┻╯╰╯╰━━┻╯╰┻╯╰┻━━┻╯╰┻━━┻━━━╯
╱╱╱╭━╯┃/////////////////////////////////////
╱╱╱╰━━╯http://cynt.co.nf////////////////////
http://cyntss.github.io/Parallax-img-scroll/
////////////////////////////////////////////
V.1.2.5 - MIT license. Allowed for commercial
and personal use =D
*/

//reset the scroll to 0 (top of page)
//RL* In Javascript the $ symbol is used to target that specific element. In this case $(window) is targeting according to Mozilla MDN
//RL* "A global variable, window, representing the window in which the script is running, is exposed to JavaScript code."
//RL* The "." after (window) is called Dot Notation. MDN "A global variable, window, representing the window in which the script is running, is exposed to JavaScript code."
//RL* 'beforeunload' is a jQuery API which is usually used to warn people when they close pages with "Are you sure you want to leave this page?"
//RL* In this case though Cynthia has used the API to force the page to always load the page from the top most scroll. This is noticeable when you backspace to your
//RL* webpage and return back the to page with 'before unload'. A normal page will return to its previous scroll position while this page will always be at the top scroll. 
//RL* Basically the string below states target the window and on leaving the webpage, do this function where the window scrolls to the top position value 0.
$(window).on('beforeunload', function() {
  $(window).scrollTop(0);
});


//RL* This line basically states "make a function called parallaxImgScroll" with a "Call Function".
//RL* MDN states that "The call() method calls a function with a given this value and arguments provided individually."
//RL* This line is also known as a IIFE or Immediately Invoked Fuction Expression - which basically means this code will run immediately when the page is loaded.
//RL* MDN syntax "var myFunction = function [name]([param1[, param2[, ..., paramN]]]) {"
//RL* MDN syntax "statements"
//RL* MDN syntax  };
//RL* The sting below states function name parallaxImgScroll with parameter named settings. This pretty much wraps the entire JS sketch which I'm assuming means that
//RL* in the HTML header anything with "parallaxImgScroll" uses based off what we see here.
function parallaxImgScroll(settings) {

  //if the user is setting the configuration
  //RL* variable is made called default_settings. Its later used in the variable under it. I noticed in the HTML header there variables exactly like this right here.
  //RL* My assumption is this is the default settings to fall back on and the one in the HTML header will override this one.
  var default_settings = {
    initialOpacity : 0, //from 0 to 1, e.g. 0.34 is a valid value. 0 = transparent, 1 = Opaque
    opacitySpeed : 0.02, //values from 0.01 to 1 -> 0.01: slowly appears on screen; 1: appears as soon as the user scrolls 1px
    pageLoader: true // boolean type
  }
  //RL* variable parallaxSettings is the same as target that extends into two sub classes.
  //RL* MDN definition of extend is "The extends keyword is used in class declarations or class expressions to create a class which is a child of another class."
  //RL* I know where default_settings is but still lost on "settings" where does this subclass connect to?
  //RL* In the HTML header function parallaxImgScroll has the name parallaxSettings. Maybe it refers to the parameter above in line 37?
  var parallaxSettings = $.extend({}, default_settings, settings);

  //definition of essential variables [do not modify]
  //RL* !!This creates an array for a reason... not sure why - research this more!!
  //RL* According to the code below, parallaxElementsArray is used and referred to extensively for function imgScroll which is used to move images while scrolling
  //RL* the page. Since an array is a way to make a list of items, maybe this is the list of the content we put in via HTML and this array holds information about it all?
  var parallaxElementsArray = [];
  var lastestScrolled = 0;
  var scrolled = 0;

//RL* (document) repreents the entire document being displayed before you. Its targetting the document to basically put inlinne CSS into the classes stated.
//RL* the .ready is a special jQuery specific function that detects when a page has finished loading. Accord to jQuery's own website, a piece is not safely manipulatable
//RL* until it is ready and loaded. This is important because we are putting inline CSS directly into the document.
//RL* The string below basically states target the document and states when it is ready to execute the function below.
  $(document).ready(function (){

    //RL* .css according to jQuery's own documentation is "Description: Set one or more CSS properties for the set of matched elements."
    //RL* basically this string states that target the class parallax-move and add the following css.
    //RL* In the html page parallax-move is the class name of the stuff we want to scroll up and down our screen so this makes sense.
    $(".parallax-move").css({
      'opacity' : 0,
      position: "absolute"
    });

    //RL* This code is wrapped in a target document so I think the dot notation below "parallaxSettings.pageLoader" is specifically referring to the header script
    //RL* in the HTML. So if we have marked it as true in the header, this loading page screen script will start running.
    //RL* It is pretty obvious and apparent that the script below is to give CSS styling to the loading page screen while the webpage loads.
    if (parallaxSettings.pageLoader) {
      //RL* This creates a variable loadingMaringTop and it is used down below to set the loading text dead center of the window.
      //RL* the code below makes it pretty obvious with target window and access property height which we will divide by 2 so its half aka dead center.
      var loadingMaringTop = $(window).height() / 2
      //RL* .wrapInner is jQuery API that according to their documentation
      //RL* "The .wrapInner() function can take any string or object that could be passed to the $() factory function to specify a DOM structure"
      //RL* Basically this means target elemen body and create a new div class called 'parallaxImg-page' presumably this div is going to be our loading screen.
      $("body").wrapInner( "<div class='parallaxImg-page'></div>");
      //RL* Target element body and access css to make the loading page full screen.
      //I'm assuming this is done because about the parallax system requries the height and width to actually work. The string below ensures that.
      $("body").css({
        height: '100%',
        width: '100%'
      })
      //RL* prepend accord to jQuery documentation is 
      //RL* "The .prepend() method inserts the specified content as the first child of each element in the jQuery collection (To insert it as the last child, use .append()). "
      //RL* The string below basically says to creat a div class called 'parallaxingImg-loading-page' inside the body.
      $("body").prepend("<div class='parallaxImg-loading-page'></div>")
      //RL* target the newly mad div above and add the following class for the css. I can change the background color here etc.
      $(".parallaxImg-loading-page").css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        background: '#333',
      })
      //RL* String below adds another div inside the previous one. This one will have the text Loading page.
      $(".parallaxImg-loading-page").prepend("<div class='parallaxImg-loading-text'>Loading Page</div>")
      //RL* string below adds the css to the div we just made above.
      $(".parallaxImg-loading-text").css({
        width: '300px',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'text-align': 'center',
        'padding-top': loadingMaringTop + 'px'
      })

      //RL* The .hide is jQuery to hide an element. This hides all the divs we made above. Obviously that doesn't make any sense but im assuming code below will
      //RL* it fade in and fade out?
      $(".parallaxImg-page").hide()
    }

  })

  //RL* jQuery "Description: Load data from the server and place the returned HTML into the matched elements."
  //RL* "$(selector).load(url,data,function(response,status,xhr))" -W3Schools
  //RL* Target the window and load the function? According to the documentation there should be an URL etc. But nothing is there so...
  //RL* it is loading the stuff below it? I noticed that you have to bind the scroll wheel to the movement of the images so this script has to run in order for the 
  //RL* Parallax to work.
  $(window).load(function() {
    $(".parallax-move").css({
      //RL*I think this is saying the value of opacity will be the same as parallaxSettings's initialOpacity which is stated above. Which is set to 0.
      'opacity' : parallaxSettings.initialOpacity
    });

    //RL*This is saying if we have parallaxSettings's pageLoader set to true that we will run this code?
    if (parallaxSettings.pageLoader) {
      //RL* .fadeout is "Description: Hide the matched elements by fading them to transparent." -jQuery
      //RL* this is what gives that nice fade back in when the page is finished loading. I'm assuming the 600 is in milliseconds.
      $(".parallaxImg-loading-page").fadeOut('600', function() {
        //RL* After that, parallaxImg-page will fade in. This class was created above and basically wraps the entired parallax element in the HTML. You can see this
        //RL* in action by loading the page and opening element inspector. This class was not made in HTML and is injected in via Javascript.
        $(".parallaxImg-page").fadeIn()
        //RL* "this is a reference to the html DOM element that is the source of the event." -Anders Abel (Microsoft)
        //RL* The source of this element is .parallaxImg-loading-page so the $ below is targetting that.
        //RL* .remove is "Description: Remove the set of matched elements from the DOM." -jQuery. So the code will remove that element.
        $(this).remove()
        //RL* after that parallaxImgInit will load which is all the code to set up the movements of the parallax system.
        parallaxImgInit();
      })
    }
    //RL* If the pageloader was set to false, than this function will run immediately instead.
    else {
      parallaxImgInit();
    }

    /* Scroll event to trigger the function */
    //RL* .bind is "Description: Attach a handler to an event for the elements." -jQuery
    //RL* (e) is e is the short var reference for event object which will be passed to event handlers.
    //RL* I think the string below states that in the window, bind the scroll event to parallaxImageScroll. That way when your mouse scrolls, 
    //RL* parallaxImgScroll will do something at the same time.
    $(window).bind('scroll',function(e){
      parallaxImgScroll();
    });

  });

  /* Initial setup of the elements */
  function parallaxImgInit() {

    //RL* "Description: Iterate over a jQuery object, executing a function for each matched element. " -jQuery
    //RL* So the string below is target element parallax-img-container run the following statements.
    $(".parallax-img-container").each(function() {
      //RL* "Description: Get the current computed width for the first element in the set of matched elements." -jQuery
      //RL* make a variable named widthOfContainer which equals .parallax-img-containers width...I think
      var widthOfContainer = $(this).width();
      //RL* "Description: Get the current computed height for the first element in the set of matched elements." -jQuery
      var heightOfContainer = $(this).height();
      //RL* .children is "Description: Get the children of each element in the set of matched elements, optionally filtered by a selector."
      //RL* make a variable setOfElements is equal to parallax-img-container's children.
      //RL*... To be honest i have no idea what my explaination of the string below even means... Like how is it even used?
      var setOfElements = $(this).children();
      //RL* The string below is a for loop... i = 0 and if i is less than setOfElements.length then add 1 to i...
      //RL* What is the for loop for? My guess is var setOfElements gets the number of classes in parallax-img-container and then the for loop
      //RL* computes how many there are? So if I have 6 images in the container than it will apply the followed statements 6 times?
      for (i = 0; i < setOfElements.length ; i++) {
        //RL* create a variable named classApplied which is equal to the value of setOfElements if it has the attribut 'class'?
        //RL* In order for the parallax to work, the HTML images we use have to have 'class' parallax-move.
        var classApplied = $(setOfElements[i]).attr('class');
        //RL* the following code is if classApplied does not equal parallax-move then give the elements the following CSS. 
        //RL* I'm assuming this is to prevent any conflicts?
        //RL* When you open up the element inspector in chrome any elements in the parallax container without parallax move have the following CSS applied.
        if (classApplied != "parallax-move") {
          $(setOfElements[i]).css({
            "z-index": 100,
            "position": "relative"
          })
        }
        // for all the elements that have the class "parallax-move"
        else {

          // if the element has a Speed declared
          //RL* .hasData ="Description: Determine whether an element has any jQuery data associated with it" -jQuery
          if ($(setOfElements[i]).hasData('ps-speed')) {
            //scrollSpeed is equal to what the scroll speed which was stated in the HTML.
            scrollSpeed = $(setOfElements[i]).data('ps-speed');
          }
          //otherwise, the Javascript string below will give it a random scroll speed.
          else {
            //RL* "The Math.floor() function returns the largest integer less than or equal to a given number." - MDN
            //RL* I think the math floor is a way to round the number?
            //RL* "he Math.random() function returns a floating-point, pseudo-random number in the range 0–1 (inclusive of 0, but not 1)"
            //RL* that makes sense because if math random gives a floating point then floor with round it to a whole number.
            var ranNumSpeed = Math.floor((Math.random() * 100) + 1);
            if(ranNumSpeed < 10) {
              var scrollSpeed = "0.0" + ranNumSpeed;
            }
            else {
              var scrollSpeed = "0." + ranNumSpeed;
            }
          }

          //RL* if the element has a vertical position declared
          //RL* this checks to see if ps-vertical-position is declared in the CSS. If it is then it will use that data for the scrolling.
          if ($(setOfElements[i]).hasData('ps-vertical-position')) {
            //RL* TopPosition is the same value as what we stated in the HTML.
            TopPosition = $(setOfElements[i]).data('ps-vertical-position');
          }
          else {
            //RL* This just makes another random variable to use as TopPosition the same way we made from speed. With Math floor and random.
            var TopPosition = Math.floor(Math.random() * (heightOfContainer - (heightOfContainer/4)) + 1);
          }

          //if the element has an horizontal position declared
          //RL* The code down here is for the hoziontal position.
          if ($(setOfElements[i]).hasData('ps-horizontal-position')) {
            var leftPosition = $(setOfElements[i]).data('ps-horizontal-position');
            var rightPosition = undefined;
          }
          else if ($(setOfElements[i]).hasData('ps-horizontal-position-right')) {
            var rightPosition = $(setOfElements[i]).data('ps-horizontal-position-right');
            var leftPosition = undefined;
          } else {
            var leftPosition = Math.floor(Math.random() * (widthOfContainer - 100) + 50);
            var rightPosition = undefined;
          }

          //if the element has a z-index declared
          //RL*This code here is for the z-index
          if ($(setOfElements[i]).hasData('ps-z-index')) {
            var zPosition = $(setOfElements[i]).data('ps-z-index');
          }
          else {
            var zPosition = Math.floor(Math.random() * 10 + 1);
          }

          //RL* We made an array at the beginning of this system called parallaxElementsArray
          //RL* the .push according to W3Schools is "The push() method adds new items to the end of an array, and returns the new length."
          //RL* so we are adding new variables to the parallaxElementsArray
          parallaxElementsArray.push({
            "element" : $(setOfElements[i]),
            "scrollSpeed" : scrollSpeed,
            "horizontalPagePosition" : leftPosition,
            "horizontalPagePositionRight" : rightPosition,
            "verticalPagePosition" : TopPosition,
            "opacity" : parallaxSettings.initialOpacity,
            "privateScrolled" : 0
          });

          /* Apply initial position */
          //RL* console.log is "The Console method log() outputs a message to the web console. 
          //RL*The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects." -MDN
          //RL* Im not entirely sure why it even needs to be printed? I dont see it anywhere on the webpage...
          //RL* One thing I noticed is when inputing values in HTML depending on whether you use negatives or positive the parallax system will initially place
          //RL* the content on either the left position in CSS or the right position via CSS. That hasn't been addressed yet so maybe its something to do with it here?
          //RL* The if uses left in the CSS and the else uses right which makes me believe it to be so.
          console.log(leftPosition, rightPosition)
          if (leftPosition) {
            //RL* this applies the values into the CSS
            $(setOfElements[i]).css({
              "bottom": TopPosition,
              "left": leftPosition,
              "z-index": zPosition
            })
          } else {
            $(setOfElements[i]).css({
              "bottom": TopPosition,
              "right": rightPosition,
              "z-index": zPosition
            })
          }
        }
      }
    });

    
    $(".parallax-img-container").css({
      position: "relative",
      overflow: "hidden"
    });

  }

  /* Move the images while scrolling the page */
  function parallaxImgScroll() {

    scrolled = $(window).scrollTop();

    for (i = 0; i < parallaxElementsArray.length; i++) {

      alpha = parallaxElementsArray[i].opacity;

      /* Calculate the distance between the element and the top of the document */
      var distanceFromTop = $(parallaxElementsArray[i].element).offset().top;
      var elementHeight = $(parallaxElementsArray[i].element).height();

      if (isVisible(distanceFromTop, elementHeight)) {

        /* if scrolling down */
        if (lastestScrolled < scrolled) {
          /* unless parallaxSettings.opacitySpeed = 1, make the element appear progressively */
          if (parallaxSettings.initialOpacity != 1) {
            alpha = alpha + parallaxSettings.opacitySpeed;
            if (alpha > 1) {
              alpha = 1;
            }
          } else {
            alpha = parallaxSettings.initialOpacity;
          }
          //save the scrolling for this element
          parallaxElementsArray[i].privateScrolled = parallaxElementsArray[i].privateScrolled + (scrolled - lastestScrolled);
        }
        else if (scrolled == 0) {
          alpha = parallaxSettings.initialOpacity;
          parallaxElementsArray[i].privateScrolled = 0;
        /* else.. if scrolling up */
        }
        else {
          /* unless parallaxSettings.opacitySpeed = 1, make the element appear progressively */
          if (parallaxSettings.initialOpacity != 1) {
            alpha = alpha - parallaxSettings.opacitySpeed;
            if (alpha < parallaxSettings.initialOpacity) {
              alpha = parallaxSettings.initialOpacity;
            }
          } else {
            alpha = parallaxSettings.initialOpacity;
          }
          //save the scrolling for this element
          parallaxElementsArray[i].privateScrolled = parallaxElementsArray[i].privateScrolled - (lastestScrolled - scrolled);
        }

        $(parallaxElementsArray[i].element).css({
          "opacity" : alpha,
          'bottom': (parallaxElementsArray[i].verticalPagePosition + (parallaxElementsArray[i].privateScrolled * parallaxElementsArray[i].scrollSpeed)) + 'px'
          });

        /* save the opacity in the elements object */
        parallaxElementsArray[i].opacity = alpha;
      }
    }
    lastestScrolled = scrolled;

    /* check if the element is visible on screen */
    function isVisible(distance, height) {
      //if it went up and off the screen
      if ([distance + height] < scrolled) {
        return false;
      }
      //if if didnt appear from belog yet
      else if ([scrolled + $(window).height()] < distance) {
        return false;
      }
      //if it is being displayed on screen
      else {
        return true;
      }
    }
  }

}

/* check if a data attribute exists */
$.fn.hasData = function(attrName) {
  return (typeof $(this).data(attrName) != 'undefined');
};

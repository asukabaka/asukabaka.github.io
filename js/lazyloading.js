// GOOGLE WEB FUNDEMENTALS BY JEREMY WAGNER
// https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video
//Wagner's Notes --------------------------------------------------------------------------------------------------------------------------------
//This code uses getBoundingClientRect in a scroll event handler to check if any of img.lazy elements are in the viewport. 
//A setTimeout call is used to delay processing, and an active variable contains the processing state which is used to throttle function calls. 
//As images are lazy loaded, they're removed from the elements array. 
//When the elements array reaches a length of 0, the scroll event handler code is removed. 
//-----------------------------------------------------------------------------------------------------------------------------------------------

//Ray's notes on this code
//Lazy loading is when images are only loaded as the user scrolls down the page. This is often seen in websites that infinitely scroll down because it saves unnesscary
// transfer of data for both the user and the server. In HTML placeholder blurred images which inherently cost less data are instantly loaded in as usual, while more data heavy content
// are set to load in as the user scrolls down. This code in particular is based on the JS function Event Listener which instructs JS to constantly check to see if the 
// browser is doing X event.


document.addEventListener("DOMContentLoaded", function() {
  //"The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, 
  //without waiting for stylesheets, images, and subframes to finish loading."-MOZILLA MDN
  let lazyImages = [].slice.call(document.querySelectorAll("img.cyberpunk_hifumi_resize"));
  //This code specifically targets all elements that are img.cyberpunk_hifumi_resize
  //specifically it sets the "lazyImages" in JS to be whatever class you need to to be in your HTML. I set mine to be img.cyberpunk_hifumi_resize
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      //=== means strict equality in both value and type.
      active = true;

      setTimeout(function() {
      //setTimeout means the script will run every 200milliseconds to see if the user is scrolling or viewport has changed. The value 200 is given below.
        lazyImages.forEach(function(lazyImage) {
          if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
            lazyImage.src = lazyImage.dataset.src; //data-src="" and data-srcset="" in HTML is the final image you want loaded while just plain src="" is the blurred one.
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");
            //I think this line of code says when a class named Lazy Image goes inside the client's rectangle, set the lazy image to display none?
            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
              //These 3 event listeners are for scrolling, resizing the viewport, or changing orientation from landscape to portrait or vice versa.
              //I THINK this means when you have lazy loaded all images it "turns off" the code from running to save processing power?
              //If there are no listeners there is nothing for setTimeout to do.
            }
          }
        });

        active = false;
      }, 200);
    }
  };

  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
  //These 3 event listeners are for scrolling, resizing the viewport, or changing orientation from landscape to portrait or vice versa.
});
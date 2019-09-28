// GOOGLE WEB FUNDEMENTALS BY JEREMY WAGNER
// https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video

//Ray's notes on this code
//Lazy loading is when images are only loaded as the user scrolls down the page. This is often seen in websites that infinitely scroll down because it saves unnesscary
// transfer of data for both the user and the server. In HTML placeholder blurred images which inherently cost less data are instantly loaded in as usual, while more data heavy content
// are set to load in as the user scrolls down. This code in particular is based on the JS function Event Listener which instructs JS to constantly check to see if the 
// browser is doing X event.


document.addEventListener("DOMContentLoaded", function() {
  let lazyImages = [].slice.call(document.querySelectorAll("img.cyberpunk_hifumi_resize"));
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      active = true;

      setTimeout(function() {
        lazyImages.forEach(function(lazyImage) {
          if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");

            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
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
});
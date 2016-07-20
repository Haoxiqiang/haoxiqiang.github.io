// JS Helper, to autoplay and control another controls to Carousel. Enjoy
(function() {
  var carousel = {
    ittem: document.getElementById('carousel'),
    interval: 3000,
    items: this.carousel.getElementsByClassName('carousel-active'),
    itemsLength: 0,
    controls: this.carousel.getElementsByClassName('carousel-control'),
    controlsLength: 0
  };
  var carouselTimer = setInterval(carouselPlay, carousel.interval);

  carousel.itemsLength = carousel.items.length;
  carousel.controlsLength = carousel.controls.length;

  function carouselControls() {
    for (var i = carousel.controlsLength; i--;) {
      carousel.controls[i].addEventListener('click', carouselReset, false);
    }
  }

  function carouselPlay() {
    for (var i = carousel.itemsLength; i--;) {
      if (carousel.items[i].checked) {
        if (i !== carousel.itemsLength - 1) {
          carousel.items[i + 1].checked = true;
        } else if (i === carousel.itemsLength - 1) {
          setTimeout(function() {
            carousel.items[0].checked = true;
          }, 0);
        }
      }
    }
  }

  function carouselReset() {
    console.log(1)
    clearInterval(carouselTimer);
    carouselTimer = setInterval(carouselPlay, carousel.interval);
  }
  carouselControls();
})();

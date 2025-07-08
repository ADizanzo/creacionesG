function main() {

(function () {
   'use strict';

    $('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

    // Show Menu on Book
    $(window).bind('scroll', function() {
        var navHeight = $(window).height() - 500;
        if ($(window).scrollTop() > navHeight) {
            $('.navbar-default').addClass('on');
        } else {
            $('.navbar-default').removeClass('on');
        }
    });

    $('body').scrollspy({ 
        target: '.navbar-default',
        offset: 80
    });

    // Hide nav on click
    $(".navbar-nav li a").click(function (event) {
      var toggle = $(".navbar-toggle").is(":visible");
      if (toggle) {
        $(".navbar-collapse").collapse('hide');
      }
    });

    // Portfolio isotope filter
    $(window).on('load', function() {
        var $container = $('.portfolio-items');
        $container.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });
    });

    // Nivo Lightbox 
    $('.portfolio-item a').nivoLightbox({
        effect: 'slideDown',  
        keyboardNav: true
    });

}());


}
main();

function calcularMesesDesde(fechaBaseStr) {
  const base = new Date(fechaBaseStr);
  const hoy = new Date();
  return (hoy.getFullYear() - base.getFullYear()) * 12 + (hoy.getMonth() - base.getMonth());
}

document.addEventListener('DOMContentLoaded', function () {
  // Toggle listas
  const toggles = document.querySelectorAll('.toggle-list');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const targetList = document.getElementById(targetId);
      targetList.style.display = (targetList.style.display === 'none' || targetList.style.display === '') ? 'block' : 'none';
    });
  });

  const prices = document.querySelectorAll('.menu-item-price');
  const storedPrices = JSON.parse(localStorage.getItem('updatedPrices') || '{}');

  prices.forEach(priceEl => {
    const id = priceEl.getAttribute('data-id');
    if (!id) {
      console.warn('Elemento sin data-id:', priceEl);
      return;
    }

    const priceText = priceEl.textContent.trim();
    const priceMatch = priceText.match(/\$ ?([\d.,]+)/);
    if (!priceMatch) return;

    const currentDate = new Date();
    const key = `price-${id}`;
    const stored = storedPrices[key];

    if (stored) {
      const monthsElapsed = calcularMesesDesde(stored.baseDate);
      const updatedPrice = Math.round(stored.originalPrice * Math.pow(1.05, monthsElapsed));
      priceEl.textContent = `$${updatedPrice}`;
    } else {
      const originalPrice = parseFloat(priceMatch[1].replace('.', '').replace(',', '.'));
      priceEl.textContent = `$${Math.round(originalPrice)}`; // Mostrar el original por ahora
      storedPrices[key] = {
        originalPrice,
        baseDate: '2025-07-01'
      };
    }
  });

  // Guardar precios base en localStorage
  localStorage.setItem('updatedPrices', JSON.stringify(storedPrices));
});

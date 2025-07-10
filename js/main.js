function main() { 
  (function () {
    'use strict';

    $('a.page-scroll').click(function () {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top - 40
          }, 900);
          return false;
        }
      }
    });

    // Show Menu on Book
    $(window).bind('scroll', function () {
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
    $(".navbar-nav li a").click(function () {
      var toggle = $(".navbar-toggle").is(":visible");
      if (toggle) {
        $(".navbar-collapse").collapse('hide');
      }
    });

    // Portfolio isotope filter
    $(window).on('load', function () {
      var $container = $('.portfolio-items');
      $container.isotope({
        filter: '*',
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });
      $('.cat a').click(function () {
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
  })();
}
main();

// Utilidad para calcular meses transcurridos
function calcularMesesDesde(fechaBaseStr) {
  const base = new Date(fechaBaseStr);
  const hoy = new Date();
  return (hoy.getFullYear() - base.getFullYear()) * 12 + (hoy.getMonth() - base.getMonth());
}

document.addEventListener('DOMContentLoaded', function () {
  const baseDate = new Date("2025-07-01");
  const today = new Date();
  const monthsElapsed = (today.getFullYear() - baseDate.getFullYear()) * 12 + (today.getMonth() - baseDate.getMonth());
  if (monthsElapsed <= 0) return;

  const increaseFactor = Math.pow(1.05, monthsElapsed);
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
    if (!priceMatch) {
      console.warn(`Precio no válido en el producto con ID ${id}:`, priceText);
      return;
    }

    const raw = priceMatch[1].replace(/\./g, '').replace(/,/g, '.');
    const originalPrice = parseFloat(raw);
    if (isNaN(originalPrice)) {
      console.warn(`No se pudo parsear el precio original (${raw}) para ID: ${id}`);
      return;
    }

    // Guardar original SOLO si no está en localStorage
    if (!storedPrices[`price-${id}`]) {
      storedPrices[`price-${id}`] = {
        originalPrice: originalPrice,
        baseDate: "2025-07-01"
      };
    }

    const base = storedPrices[`price-${id}`];
    const updatedPrice = Math.round(base.originalPrice * increaseFactor);
    priceEl.textContent = `$${updatedPrice}`;
  });

  localStorage.setItem('updatedPrices', JSON.stringify(storedPrices));
});

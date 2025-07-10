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
  // Toggle listas desplegables
  const toggles = document.querySelectorAll('.toggle-list');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const targetList = document.getElementById(targetId);
      targetList.style.display = (targetList.style.display === 'none' || targetList.style.display === '') ? 'block' : 'none';
    });
  });

  const baseDate = '2025-07-01';
  const monthsElapsed = calcularMesesDesde(baseDate);
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

    const key = `price-${id}`;
    let originalPrice;

    if (storedPrices[key]) {
      originalPrice = storedPrices[key].originalPrice;
    } else {
      const raw = priceMatch[1]
        .replace(/\./g, '')     // Quitar separador de miles
        .replace(/,/g, '.');    // Convertir decimal europeo a punto

      originalPrice = parseFloat(raw);

      storedPrices[key] = {
        originalPrice: originalPrice,
        baseDate: baseDate
      };
    }

    const updatedPrice = Math.round(originalPrice * Math.pow(1.05, monthsElapsed));
    priceEl.textContent = `$${updatedPrice}`;
  });

  // Guardar en localStorage
  localStorage.setItem('updatedPrices', JSON.stringify(storedPrices));
});
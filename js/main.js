
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
    // check if window is small enough so dropdown is created
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
            keyboardNav: true,                            
        });

}());


}
main();


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

  // --- Actualización de precios con persistencia local ---
  const baseDate = new Date("2025-07-01");
  const today = new Date();
  const monthsElapsed = (today.getFullYear() - baseDate.getFullYear()) * 12 + (today.getMonth() - baseDate.getMonth());
  if (monthsElapsed <= 0) return;

  const increaseFactor = Math.pow(1.05, monthsElapsed);
  const prices = document.querySelectorAll('.menu-item-price');

  // Cargar datos desde localStorage
  const storedPrices = JSON.parse(localStorage.getItem('updatedPrices') || '{}');


prices.forEach(priceEl => {
  const id = priceEl.getAttribute('data-id');
  if (!id) {
    console.warn('Elemento sin data-id:', priceEl);
    return; // Evitar errores si falta el atributo
  }

  const priceText = priceEl.textContent.trim();
  const priceMatch = priceText.match(/\$ ?([\d.,]+)/);
  if (!priceMatch) return;

  const originalPrice = parseFloat(priceMatch[1].replace('.', '').replace(',', '.'));
  const key = `price-${id}`;

  // Si ya está guardado, usarlo
  if (storedPrices[key]) {
    priceEl.textContent = `$${storedPrices[key]}`;
  } else {
    // Calcular nuevo precio y guardar
    const updatedPrice = Math.round(originalPrice * increaseFactor);
    priceEl.textContent = `$${updatedPrice}`;
    storedPrices[key] = updatedPrice;
  }
});


  // Guardar precios en localStorage
  localStorage.setItem('updatedPrices', JSON.stringify(storedPrices));
});
(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function() {
		setTimeout(function() { 
			if($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
   $.Scrollax();



   // Burger Menu
	var $nav = $('#ftco-nav');
	var $navToggle = $('.js-fh5co-nav-toggle');

	var navIsOpen = function() {
		return $nav.hasClass('show');
	};

	var closeNav = function() {
		if ( navIsOpen() ) {
			$nav.collapse('hide');
		}
	};

	var burgerMenu = function() {

		// Bootstrap's collapse plugin owns the open/close state; we only mirror
		// it onto the toggle so the icon and aria state stay in sync.
		$nav.on('show.bs.collapse', function(){
			$navToggle.addClass('active').attr('aria-expanded', true);
			$('body').addClass('nav-open');
		});

		$nav.on('hide.bs.collapse', function(){
			$navToggle.removeClass('active').attr('aria-expanded', false);
			$('body').removeClass('nav-open');
		});

		// Tapping anywhere outside the open menu closes it.
		$(document).on('click', function(event){
			if ( !navIsOpen() ) return;
			if ( $(event.target).closest('#ftco-nav, .js-fh5co-nav-toggle').length ) return;
			closeNav();
		});

		// Escape closes it and returns focus to the toggle.
		$(document).on('keydown', function(event){
			if ( event.key === 'Escape' && navIsOpen() ) {
				closeNav();
				$navToggle.focus();
			}
		});

		// Never leave a collapsed menu stranded open when the viewport grows
		// past the breakpoint and the links become a normal inline row.
		var resizeTimer;
		$(window).on('resize', function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function(){
				if ( window.innerWidth >= 992 && navIsOpen() ) {
					$nav.removeClass('show');
					$navToggle.removeClass('active').attr('aria-expanded', false);
					$('body').removeClass('nav-open');
				}
			}, 150);
		});

	};
	burgerMenu();


	var onePageClick = function() {


		$(document).on('click', '#ftco-nav a[href^="#"]', function (event) {
	    event.preventDefault();

	    var href = $.attr(this, 'href');
	    var $target = $(href);

	    if ( !$target.length ) return;

	    var scrollToTarget = function() {
	    	// Offset by the fixed bar's real height so the section heading
	    	// never ends up hidden underneath it.
	    	var $bar = $('.ftco-navbar-light');
	    	var offset = $bar.css('position') === 'fixed' ? $bar.outerHeight() : 70;

	    	$('html, body').animate({
	    	    scrollTop: $target.offset().top - offset
	    	}, 500);
	    };

	    // Close the mobile menu first. The collapsing panel changes the page
	    // height, so only measure the target once it has finished collapsing.
	    if ( navIsOpen() ) {
	    	$nav.one('hidden.bs.collapse', scrollToTarget);
	    	closeNav();
	    } else {
	    	scrollToTarget();
	    }
		});

	};

	onePageClick();
	

	// The hero is a static panel now, so this only runs if a slider is present.
	var carousel = function() {
		if (!$('.home-slider').length) return;
		$('.home-slider').owlCarousel({
	    loop:true,
	    autoplay: true,
	    margin:0,
	    animateOut: 'fadeOut',
	    animateIn: 'fadeIn',
	    nav:false,
	    autoplayHoverPause: false,
	    items: 1,
	    navText : ["<span class='ion-md-arrow-back'></span>","<span class='ion-chevron-right'></span>"],
	    responsive:{
	      0:{
	        items:1
	      },
	      600:{
	        items:1
	      },
	      1000:{
	        items:1
	      }
	    }
		});
	};
	carousel();

	$('nav .dropdown').hover(function(){
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function(){
		var $this = $(this);
			// timer;
		// timer = setTimeout(function(){
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
			$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
	  console.log('show');
	});

	// scroll
	var scrollWindow = function() {
		$(window).scroll(function(){
			var $w = $(this),
					st = $w.scrollTop(),
					navbar = $('.ftco_navbar'),
					sd = $('.js-scroll-wrap');

			if (st > 150) {
				if ( !navbar.hasClass('scrolled') ) {
					navbar.addClass('scrolled');	
				}
			} 
			if (st < 150) {
				if ( navbar.hasClass('scrolled') ) {
					navbar.removeClass('scrolled sleep');
				}
			} 
			if ( st > 350 ) {
				if ( !navbar.hasClass('awake') ) {
					navbar.addClass('awake');	
				}
				
				if(sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if ( st < 350 ) {
				if ( navbar.hasClass('awake') ) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if(sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	

	var counter = function() {
		
		$('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();


	var contentWayPoint = function() {
		var i = 0;
		$('.ftco-animate').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .ftco-animate.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};
	contentWayPoint();


})(jQuery);


/* ===================================================================
 * Hola - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";

    var cfg = {
        scrollDuration : 800, // smoothscroll duration
        mailChimpURL   : ''   // mailchimp url
    },

    $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


    /* Preloader
     * -------------------------------------------------- */
    var ssPreloader = function() {

        $("html").addClass('ss-preload');

        $WIN.on('load', function() {

            // force page scroll position to top at page refresh
            // $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');
        
        });
    };


    /* pretty print
     * -------------------------------------------------- */
    var ssPrettyPrint = function() {
        $('pre').addClass('prettyprint');
        $( document ).ready(function() {
            prettyPrint();
        });
    };


    /* Move header
     * -------------------------------------------------- */
    var ssMoveHeader = function () {

        var hero = $('.page-hero'),
            hdr = $('header'),
            triggerHeight = hero.outerHeight() - 170;


        $WIN.on('scroll', function () {

            var loc = $WIN.scrollTop();

            if (loc > triggerHeight) {
                hdr.addClass('sticky');
            } else {
                hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.addClass('offset');
            } else {
                hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.addClass('scrolling');
            } else {
                hdr.removeClass('scrolling');
            }

        });

        // $WIN.on('resize', function() {
        //     if ($WIN.width() <= 768) {
        //             hdr.removeClass('sticky offset scrolling');
        //     }
        // });

    };


    /* Mobile Menu
     * ---------------------------------------------------- */ 
    var ssMobileMenu = function() {

        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');

        toggleButton.on('click', function(event){
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        nav.find('a').on("click", function() {

            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });

    };


    /* Masonry
     * ---------------------------------------------------- */ 
    var ssMasonryFolio = function () {

        var containerBricks = $('.masonry');

        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.masonry__brick',
                resize: true
            });
        });
    };


    /* photoswipe
     * ----------------------------------------------------- */
    var ssPhotoswipe = function() {
        var items = [],
            $pswp = $('.pswp')[0],
            $folioItems = $('.item-folio');

            // get items
            $folioItems.each( function(i) {

                var $folio = $(this),
                    $thumbLink =  $folio.find('.thumb-link'),
                    $title = $folio.find('.item-folio__title'),
                    $caption = $folio.find('.item-folio__caption'),
                    $titleText = '<h4>' + $.trim($title.html()) + '</h4>',
                    $captionText = $.trim($caption.html()),
                    $href = $thumbLink.attr('href'),
                    $size = $thumbLink.data('size').split('x'),
                    $width  = $size[0],
                    $height = $size[1];
         
                var item = {
                    src  : $href,
                    w    : $width,
                    h    : $height
                }

                if ($caption.length > 0) {
                    item.title = $.trim($titleText + $captionText);
                }

                items.push(item);
            });

            // bind click event
            $folioItems.each(function(i) {

                $(this).on('click', function(e) {
                    e.preventDefault();
                    var options = {
                        index: i,
                        showHideOpacity: true
                    }

                    // initialize PhotoSwipe
                    var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                    lightBox.init();
                });

            });

    };


    /* slick slider
     * ------------------------------------------------------ */
    var ssSlickSlider = function() {
        
        $('.testimonials__slider').slick({
            arrows: true,
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: "<div class=\'slick-prev\'><i class=\'im im-arrow-left\' aria-hidden=\'true\'></i></div>",
            nextArrow: "<div class=\'slick-next\'><i class=\'im im-arrow-right\' aria-hidden=\'true\'></i></div>",       
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

    };


    /* Highlight the current section in the navigation bar
     * ------------------------------------------------------ */
    var ssWaypoints = function() {

        var sections = $(".target-section"),
            navigation_links = $(".header-nav li a");

        sections.waypoint( {

            handler: function(direction) {

                var active_section;

                active_section = $('section#' + this.element.id);

                if (direction === "up") active_section = active_section.prevAll(".target-section").first();

                var active_link = $('.header-nav li a[href="#' + active_section.attr("id") + '"]');

                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");

            },

            offset: '5%'

        });
        
    };


   /* Stat Counter
    * ------------------------------------------------------ */
    var ssStatCount = function() {

        var statSection = $(".s-stats"),
        stats = $(".stats__count");

        statSection.waypoint({

            handler: function(direction) {

                if (direction === "down") {

                    stats.each(function () {
                        var $this = $(this);

                        $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                            duration: 4000,
                            easing: 'swing',
                            step: function (curValue) {
                                $this.text(Math.ceil(curValue));
                            }
                        });
                    });

                } 

                // trigger once only
                this.destroy();

            },

            offset: "90%"

        });
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    var ssSmoothScroll = function() {

        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
        
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing', function () {
                window.location.hash = target;
            });

        });
    };


    /* Placeholder Plugin Settings
     * ------------------------------------------------------ */
    var ssPlaceholder = function() {
        $('input, textarea, select').placeholder();  
    };


    /* Alert Boxes
     * ------------------------------------------------------ */
    var ssAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };


    /* Contact Form
     * ------------------------------------------------------ */
    var ssContactForm = function() {

        /* Contact Form  ------------------------------------------*/
        $('#contactForm').on('submit', function (e) {

            e.preventDefault();                       // stop normal form submit
            var $form    = $(this);
            var sLoader  = $('.submit-loader');

            $.ajax({
                type:        'POST',
                url:         'https://formspree.io/f/xdkgdgen',   // ← your endpoint
                data:        $form.serialize(),
                dataType:    'json',                              // tells jQuery to expect JSON
                headers:     { 'Accept': 'application/json' },    // tells Formspree to send JSON
                beforeSend:  function () {
                    sLoader.slideDown('slow');
                },
                success:     function (data) {
                    sLoader.slideUp('slow');
                    $('.message-warning').fadeOut();
                    $form.fadeOut();
                    $('.message-success').fadeIn();               // ✔ show success box
                },
                error:       function (xhr) {
                    sLoader.slideUp('slow');
                    let errMsg = 'Something went wrong. Please try again.';
                    if (xhr.responseJSON && xhr.responseJSON.errors) {
                        errMsg = xhr.responseJSON.errors.map(e => e.message).join('<br>');
                    }
                    $('.message-warning').html(errMsg).slideDown('slow');
                }
            });
        });

    };


   /* Back to Top
    * ------------------------------------------------------ */
    var ssBackToTop = function() {

        var pxShow  = 500,   // height on which the button will show
        fadeInTime  = 400,   // how slow/fast you want the button to show
        fadeOutTime = 400,   // how slow/fast you want the button to hide
        scrollSpeed = 300,   // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
        goTopButton = $(".go-top")

        // Show or hide the sticky footer button
        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };


    /* Modal Popup for Projects - New Content
    * ----------------------------------------------------- */
    var ssProjectModal = function() {

        // Open modal when thumbnail is clicked
        $('.thumb-link').on('click', function(e) {
            e.preventDefault();
            var modalID = $(this).data('modal');
            var $modal = $('#' + modalID);
    
            // Reset scroll position to top
            $modal.find('.modal-content').scrollTop(0);
    
            // Disable body scrolling
            $('body').addClass('modal-open');
    
            // Show the modal by adding .is-visible
            $modal.addClass('is-visible');
        });
    
        // Close modal when close button is clicked
        $('.modal .close').on('click', function() {
            var $modal = $(this).closest('.modal');
    
            // Hide the modal by removing .is-visible
            $modal.removeClass('is-visible');
    
            // Enable body scrolling
            $('body').removeClass('modal-open');
        });
    
        // Close modal when clicking outside the modal content
        $('.modal').on('click', function(e) {
            if ($(e.target).is('.modal')) {
                $(this).removeClass('is-visible');
    
                // Enable body scrolling
                $('body').removeClass('modal-open');
            }
        });
    
        // Close modal on 'Esc' key press
        $(document).on('keydown', function(e) {
            if (e.key === "Escape") {
                $('.modal.is-visible').removeClass('is-visible');
                $('body').removeClass('modal-open');
            }
        });
    };
    
    /* Services Carousel Functionality
    * ------------------------------------------------------ */
    var ssServicesCarousel = function() {

    var $slidesContainer = $('.slides-container');
    var $slides = $('.service-slide');
    var slideCount = $slides.length;
    var currentIndex = 0;

    function updateSlidePosition() {
        var translateX = -currentIndex * 100; // Move by 100% per slide
        $slidesContainer.css('transform', 'translateX(' + translateX + '%)');
    }

    var $nextButtons = $('.nav-arrow.next');
    var $prevButtons = $('.nav-arrow.prev');

    $nextButtons.on('click', function() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlidePosition();
    });

    $prevButtons.on('click', function() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlidePosition();
    });

    // Optional: Add keyboard navigation
    $(document).on('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlidePosition();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateSlidePosition();
        }
    });
    };


    
    /* Coffee Counter Functionality
     * ------------------------------------------------------ */
    var ssCoffeeCounter = function() {

        // Set the start date for the coffee counter (Year, Month - 1, Day)
        var startDate = new Date(2024, 6, 20); // Year / Month / Day

        // Function to calculate the total number of coffees
        function calculateTotalCoffees() {
            var now = new Date();
            var totalCoffees = 0;
            var currentDate = new Date(startDate);

            // Only proceed if current time is between 09:00 and 20:00
            var currentHour = now.getHours();
            if (currentHour < 9 || currentHour >= 18) {
                // It's before 09:00 or after 20:00, so exclude today from the count
                now.setDate(now.getDate() - 1);
                now.setHours(0, 0, 0, 0); // Reset to midnight
            } else {
                // Include today, reset time to midnight
                now.setHours(0, 0, 0, 0);
            }

            while (currentDate <= now) {
                var day = currentDate.getDate();
                var month = currentDate.getMonth();
                var year = currentDate.getFullYear();

                // Create a seed based on the date
                var seed = year * 10000 + month * 100 + day;

                // Generate a pseudo-random number between 2 and 3
                var coffeesThisDay = generateCoffeesPerDay(seed);

                totalCoffees += coffeesThisDay;

                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return totalCoffees;
        }

        // Seeded random number generator to get 2 or 3 coffees per day
        function generateCoffeesPerDay(seed) {
            var x = Math.sin(seed) * 10000;
            var randomNum = x - Math.floor(x);

            return randomNum < 0.5 ? 1 : 3;
        }

        // Update the coffee counter on the page
        function updateCoffeeCounter() {
            var totalCoffees = calculateTotalCoffees();

            // Find the element where the coffee count is displayed
            var $coffeeCounterElement = $('#coffee-counter');

            // Update the text content with the total coffees
            if ($coffeeCounterElement.length) {
                $coffeeCounterElement.text(totalCoffees);
            } else {
                console.error('Coffee counter element not found.');
            }
        }

        // Call the function to update the counter
        updateCoffeeCounter();
    };
    
 
    
    




   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssPrettyPrint();
        ssMoveHeader();
        ssMobileMenu();
        ssMasonryFolio();
        /*ssPhotoswipe();*/
        ssSlickSlider();
        ssWaypoints();
        ssStatCount();
        ssSmoothScroll();
        ssPlaceholder();
        ssAlertBoxes();
        ssContactForm();
        ssBackToTop();
        ssProjectModal();
        ssServicesCarousel();
        ssCoffeeCounter();

    })();


})(jQuery);

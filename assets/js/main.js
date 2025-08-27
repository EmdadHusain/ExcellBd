jQuery(document).ready(function ($) {
  // Make the navigation bar sticky after scrolling 195px and show a scroll-to-top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 195) {
      $('nav').addClass('sticky');
      $('.scroll_icon').css('display', 'block');
    } else {
      $('nav').removeClass('sticky');
      $('.scroll_icon').css('display', 'none');
    }
  });

  // Scroll smoothly to top when the icon is clicked
  $('.scroll_icon').click(function () {
    $('html,body').animate({ scrollTop: 0 });
  });

  // function toggleIcon($icon, plus = true){
  //   if(plus){
  //     if($icon.hasClass('fa-plus')){
  //       $icon.removeClass('fa-plus').addClass('fa-minus');
  //     }
  //     }else{
  //       if($icon.hasClass('fa-minus')){
  //         $icon.removeClass('fa-minus').addClass('fa-plus');
  //       }
  //     }
  //   }

  // Function to clear all inline styles and reset to CSS defaults
  function removeInlineStyle() {
    // let $screenWidth = $(window).width();
    const screenWidth = $(window).width();

    if (screenWidth > 1023) {
      // Desktop: Remove all inline styles and reset icons
      $('.main_menu,.main_menu ul ul,.megamenu').removeAttr('style'); //why it's not working , and why many of setTimeout
      // $("").removeAttr("style");

      // Reset all mobile icons to plus
      $('.mobile-icon').removeClass('fa-minus').addClass('fa-plus');
      $('.nav_search_area').addClass('hidden');
      // console.log($('.nav_search_area'));
      $('.nav_search_icon,#menuBtn').removeClass('!hidden');
    }
    // else {
    //   // Mobile: Keep main menu closed by default, reset submenus
    //   $(".main_menu ul ul").removeAttr("style");

    //   // Reset all mobile icons to plus
    //   $(".mobile-icon").removeClass("fa-minus").addClass("fa-plus");
    // }
  }

  function manageRightClassPrecise() {
    screenWidth = $(window).width(); // Update screen width
    const $menuItems = $('.main_menu > ul > li');

    // Remove all existing right classes first
    $menuItems.removeClass('right');

    if (screenWidth > 1023) {
      const containerWidth = $('nav .containerC').width();
      const containerOffset = $('nav .containerC').offset();

      // Check if containerOffset exists to prevent errors
      if (!containerOffset) return;

      const containerRightEdge = containerOffset.left + containerWidth;

      $menuItems.each(function (index) {
        const $item = $(this);
        const itemOffset = $item.offset();

        // Check if itemOffset exists
        if (!itemOffset) return;

        const itemLeft = itemOffset.left;

        // Get all submenu levels for this item
        const $allSubmenus = $item.find('ul');
        let maxDepth = 0;
        let maxSubmenuWidth = 220; // Default width

        // Calculate the maximum depth and width needed
        $allSubmenus.each(function () {
          const $submenu = $(this);
          const depth = $submenu.parents('ul').length;
          const submenuWidth = $submenu.outerWidth() || 220;

          maxDepth = Math.max(maxDepth, depth);
          maxSubmenuWidth = Math.max(maxSubmenuWidth, submenuWidth);
        });

        // Total width needed = submenu width × maximum depth
        const totalWidthNeeded = maxSubmenuWidth * maxDepth;

        // Calculate if submenu would go off-screen on the right
        const rightEdge = itemLeft + totalWidthNeeded;

        // If submenu would exceed container width, add right class
        if (rightEdge > containerRightEdge) {
          $item.addClass('right');
        }
      });
    }
  }

  // Function to handle specific items that should always be right-aligned on desktop
  function handleSpecificRightItems() {
    const screenWidth = $(window).width();

    if (screenWidth > 1095) {
      // You can specify which items should always be right-aligned
      // For example, last 3 items
      const $menuItems = $('.main_menu > ul > li');
      const totalItems = $menuItems.length;

      // Add right class to last 3 items (adjust as needed)
      $menuItems.slice(-3).addClass('right');
    }
  }

  // Function to close all descendant submenus and reset icons
  function closeAllDescendants($parentElement) {
    // Find all descendant ul elements that are submenus (not the main menu ul)
    $parentElement
      .find('li ul, .megamenu')
      .not('.megamenu ul, .megamenu li ul')
      .slideUp();
    // $parentElement.find('ul li.mega_li ul').slideDown();

    // Also close any megamenus within the parent element // wrong
    // $(".megamenu").find('ul').slideUp(); //

    // Reset all mobile icons in descendants from minus to plus
    $parentElement.find('li .mobile-icon').each(function () {
      if ($(this).hasClass('fa-minus')) {
        $(this).removeClass('fa-minus').addClass('fa-plus');
      }
    });
  }

  // Function to bind/unbind mobile events based on screen size
  function handleMobileEvents() {
    const screenWidth = $(window).width();
    $('#menuBtn').off('click.menuBtn');
    // Menu toggle code - Close all submenus when main menu is closed
    $('#menuBtn').on('click.menuBtn', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const $mainMenu = $('.main_menu');

      if ($mainMenu.is(':visible')) {
        // If main menu is visible, close all submenus first, then close main menu
        closeAllDescendants($mainMenu);
        $mainMenu.slideUp();
      } else {
        // If main menu is hidden, open it
        $mainMenu.slideDown();
      }
    });

    // Remove any existing mobile event handlers to prevent duplicates
    $('.mobile-icon').off('click.mobile');

    if (screenWidth <= 1023) {
      // Bind mobile click handler
      $('.mobile-icon').on('click.mobile', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $this = $(this);
        const $submenu = $this.closest('a').next('ul');
        const $megamenu = $this.closest('a').next('.megamenu');
        const $parentLi = $this.closest('li');
        //  $megamenu.slideToggle();
        if ($megamenu.length) {
          if ($megamenu.is(':visible')) {
            $megamenu.slideUp(800);
          } else {
            // $megamenu.slideDown();
            $megamenu.slideDown(800);
          }
          $this.toggleClass('fa-plus fa-minus');
        } else if ($submenu.length) {
          if ($submenu.is(':visible')) {
            // If submenu is visible, close it and all its descendants
            closeAllDescendants($parentLi);
            $submenu.slideUp();
          } else {
            // If submenu is hidden, open it
            $submenu.slideDown();
          }
          $this.toggleClass('fa-plus fa-minus');
        }
      });
    }
  }

  //search Icon Toggle
  $header_search_input = $('.search_area #header_search_input');
  $search_close_icon = $('.search_area .close_icon');

  $header_search_input.on('input', function () {
    $has_value = $(this).val().length > 0;
    // $search_close_icon.toggleClass('inline-block',$has_value);
    $search_close_icon.toggleClass('!hidden', !$has_value);

    // if ($(this).val().length > 0) {
    //   // $(".search_area .close_icon").removeClass('!hidden').addClass("inline-block");
    //   $search_close_icon.toggleClass('!hidden inline-block');
    // }else {
    //   // $(".search_area .close_icon").removeClass('inline-block').addClass("!hidden");
    //  $search_close_icon.toggleClass('!hidden inline-block');
    // }
  });

  $('.search_area .close_icon').on('click', function () {
    $(this).addClass('!hidden');
    // $('.nav_search_area').removeClass('hidden');
    $header_search_input.val('').focus();
  });

  function manageNavSearchIcons() {
    const screenWidth = $(window).width();
    if (screenWidth < 1024) {
      // nav-search_area remove
      const $nav_search_icon = $('.nav_search_icon');
      const $nav_search_area = $('.nav_search_area');
      // const $nav_search_close_icon = $(".nav_search_close_icon");
      $nav_search_icon.off('click.nav_search_icon');
      $nav_search_icon.on('click.nav_search_icon', function () {
        $(this).addClass('!hidden');
        $nav_search_area.removeClass('hidden');
        if (screenWidth < 420) {
          $('#menuBtn').addClass('!hidden');
        }
      });
      $nav_search_close_icon = $('.nav_search_close_icon');
      $nav_search_close_icon.off('click.nav_search_close_icon');
      $nav_search_close_icon.on('click.nav_search_close_icon', function () {
        $nav_search_area.addClass('hidden');
        $nav_search_icon.removeClass('!hidden');
        $('#menuBtn').removeClass('!hidden');
      });
    }
  }

  //hero Carousel
  let hero_swiper = new Swiper('.hero_swiper', {
    slidesPerView: 1,
    grabCursor: true,
    autoplay: {
      delay: 5500,
      disableOnInteraction: false,
    },
    loop:true,
    effect: 'fade',
    speed: 2500, // Fade animation duration
    fadeEffect: {
      crossFade: true, // Optional: makes fade smooth
    },

    // effect: 'creative',
    // creativeEffect: {
    //   prev: {
    //     opacity: 0,
    //     translate: [0, 0, -400],
    //     // translate: ['-100%', 0, 0], // Move previous slide to left
    //   },
    //   next: {
    //     opacity: 0,
    //     translate: ['100%', 0, 0],
    //     // translate: ['0%'`, 0, 0], // Bring next slide from left
    //   },
    // },
  });
  function feature_swiper_activation() {
    const screenWidth = $(window).width();
    // Destroy existing swiper instance if it exists
    if (window.featured_swiper instanceof Swiper) {
      window.featured_swiper.destroy(true, true);
      window.featured_swiper = null;
    }

    if (screenWidth < 768) {
      $('.feature_sec .containerC').removeClass('swiper').addClass('swiper');
      $('.feature_box_wrapper')
        .removeClass('swiper-wrapper')
        .addClass('swiper-wrapper');
      $('.feature_box').removeClass('swiper-slide').addClass('swiper-slide');
      $('.feature_pagination')
        .removeClass('swiper-pagination')
        .addClass('swiper-pagination');
      window.featured_swiper = new Swiper('.feature_sec .containerC', {
        slidesPerView: 1,
        // spaceBetween: 20, // Space between slides
        grabCursor: true,
        // autoplay: {
        //   delay: 500,
        //   disableOnInteraction: false,
        // },
        loop: true, // Enable looping
        pagination: {
          el: '.swiper-pagination',
          clickable: true, // Make pagination bullets clickable
        },
        effect: 'fade',
        speed: 1500, // Fade animation duration
        fadeEffect: {
          crossFade: true, // Optional: makes fade smooth
        },
      });
      // console.log('swiper activated :', screenWidth);
    } else {
      $('.feature_sec .containerC').removeClass('swiper');
      $('.feature_box_wrapper').removeClass('swiper-wrapper');
      $('.feature_box').removeClass('swiper-slide');
      $('.feature_pagination').empty();
      return;
    }
  }

  // Initialize on page load
  setTimeout(function () {
    removeInlineStyle(); // Reset styles first
    manageRightClassPrecise();
    handleSpecificRightItems();
    handleMobileEvents(); // Initialize mobile events
    manageNavSearchIcons();
    feature_swiper_activation();
  }, 200);

  // Recalculate on window resize
  $(window).on('resize', function () {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function () {
      removeInlineStyle(); // Reset styles first, why it's and all functions r not working
      manageRightClassPrecise();
      handleSpecificRightItems();
      handleMobileEvents(); // Re-bind mobile events on resize
      manageNavSearchIcons();
      feature_swiper_activation();
    }, 200);
  });
});

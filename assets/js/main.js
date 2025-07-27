jQuery(document).ready(function ($) {
        $(window).scroll(function(){
          if($(this).scrollTop() > 195 ){
            $('nav').addClass('sticky');
            $('.scroll_icon').css("display","block");
          }else{
            $('nav').removeClass('sticky');
            $('.scroll_icon').css("display","none");
          }         
        });

        $('.scroll_icon').click(function(){
          $('html,body').animate({
            scrollTop:0
          })
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
          const screenWidth = $(window).width();

          if (screenWidth > 1023) {
            // Desktop: Remove all inline styles and reset icons
            $(".main_menu,.main_menu ul ul,.megamenu").removeAttr("style");
            // $("").removeAttr("style");

            // Reset all mobile icons to plus
            $(".mobile-icon").removeClass("fa-minus").addClass("fa-plus");
          }
          // else {
          //   // Mobile: Keep main menu closed by default, reset submenus
          //   $(".main_menu ul ul").removeAttr("style");

          //   // Reset all mobile icons to plus
          //   $(".mobile-icon").removeClass("fa-minus").addClass("fa-plus");
          // }
        }

        function manageRightClassPrecise() {
          const screenWidth = $(window).width();
          const $menuItems = $(".main_menu > ul > li");

          // Remove all existing right classes first
          $menuItems.removeClass("right");

          if (screenWidth > 1023) {
            const containerWidth = $(".containerC").width();
            const containerOffset = $(".containerC").offset().left;
            const containerRightEdge = containerOffset + containerWidth;

            $menuItems.each(function (index) {
              const $item = $(this);
              const itemOffset = $item.offset().left;
              const itemWidth = $item.outerWidth();

              // Get all submenu levels for this item
              const $allSubmenus = $item.find("ul");
              let maxDepth = 0;
              let maxSubmenuWidth = 220; // Default width

              // Calculate the maximum depth and width needed
              $allSubmenus.each(function () {
                const $submenu = $(this);
                const depth = $submenu.parents("ul").length;
                const submenuWidth = $submenu.outerWidth() || 220;

                maxDepth = Math.max(maxDepth, depth);
                maxSubmenuWidth = Math.max(maxSubmenuWidth, submenuWidth);
              });

              // Total width needed = submenu width × maximum depth
              const totalWidthNeeded = maxSubmenuWidth * maxDepth;

              // Calculate if submenu would go off-screen on the right
              // Submenu starts from the left edge of the item, not the right edge
              const rightEdge = itemOffset + totalWidthNeeded;

              // If submenu would exceed container width, add right class
              if (rightEdge > containerRightEdge) {
                $item.addClass("right");
                console.log(
                  `Item ${index + 1}: Added right class - Max depth: ${maxDepth}, Width needed: ${totalWidthNeeded}`
                );
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
            const $menuItems = $(".main_menu > ul > li");
            const totalItems = $menuItems.length;

            // Add right class to last 3 items (adjust as needed)
            $menuItems.slice(-3).addClass("right");
          }
        }

        // Function to close all descendant submenus and reset icons
        function closeAllDescendants($parentElement) {
          // Find all descendant ul elements that are submenus (not the main menu ul)
          $parentElement.find("li ul, .megamenu").not('.megamenu ul, .megamenu li ul').slideUp(); 
                    // $parentElement.find('ul li.mega_li ul').slideDown(); 

          // Also close any megamenus within the parent element // wrong
          // $(".megamenu").find('ul').slideUp(); // 
          


          // Reset all mobile icons in descendants from minus to plus
          $parentElement.find("li .mobile-icon").each(function () {
            if ($(this).hasClass("fa-minus")) {
              $(this).removeClass("fa-minus").addClass("fa-plus");
            }
          });
        }

        // Function to bind/unbind mobile events based on screen size
        function handleMobileEvents() {
          const screenWidth = $(window).width();

          // Remove any existing mobile event handlers to prevent duplicates
          $(".mobile-icon").off("click.mobile");

          if (screenWidth <= 1023) {
            // Bind mobile click handler
            $(".mobile-icon").on("click.mobile", function (e) {
              e.preventDefault();
              e.stopPropagation();

              const $this = $(this);
              const $submenu = $this.closest("a").next("ul");
              const $megamenu = $this.closest('a').next('.megamenu');
              const $parentLi = $this.closest("li");
              //  $megamenu.slideToggle();
               if($megamenu.length){
                if($megamenu.is(":visible")){
                  $megamenu.slideUp(800);
                  
                }else{
                  // $megamenu.slideDown();  
                  $megamenu.slideDown(800);
                }
                $this.toggleClass('fa-plus fa-minus');
               
               }
               else if ($submenu.length ) {
               
                if ($submenu.is(":visible")) {
                  // If submenu is visible, close it and all its descendants
                  closeAllDescendants($parentLi);
                  $submenu.slideUp();                  
                }else {
                  // If submenu is hidden, open it
                  $submenu.slideDown();                  
                }
                $this.toggleClass('fa-plus fa-minus');
              }
            });
          }
        }

        // Initialize on page load
        setTimeout(function () {
          removeInlineStyle(); // Reset styles first
          manageRightClassPrecise();
          handleSpecificRightItems();
          handleMobileEvents(); // Initialize mobile events
        }, 100);

        // Recalculate on window resize
        $(window).on("resize", function () {
          clearTimeout(window.resizeTimer);
          window.resizeTimer = setTimeout(function () {
            removeInlineStyle(); // Reset styles first
            manageRightClassPrecise();
            handleSpecificRightItems();
            handleMobileEvents(); // Re-bind mobile events on resize
          }, 150);
        });

        // Menu toggle code - Close all submenus when main menu is closed
        $("#menuBtn").on("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const $mainMenu = $(".main_menu");

          if ($mainMenu.is(":visible")) {
            // If main menu is visible, close all submenus first, then close main menu
            closeAllDescendants($mainMenu);
            $mainMenu.slideUp();
          } else {
            // If main menu is hidden, open it
            $mainMenu.slideDown();
          }
        });

        //search Icon Toggle
        $header_search_input = $('.search_area #header_search_input');

         $header_search_input.on("input", function () {
          if ($(this).val().length > 0) {
            $(".search_area .close_icon").removeClass('!hidden').addClass("inline-block");
          } else {
            $(".search_area .close_icon").removeClass('inline-block').addClass("!hidden");
          }
        });
        $(".search_area .close_icon").on("click", function () {
          $(this).removeClass('inline-block').addClass("!hidden");
          $header_search_input.val("").focus();
          
        });
      });
    
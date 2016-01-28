(function( SiteListing, $, undefined ) {


  /** ~~Start Slider JS -- Add existing images to
  /* main slider then add wistia and instagram ~~ */
  SiteListing.Slider = SiteListing.Slider || {};

  SiteListing.Slider.init = function() {
    var dfd = $.Deferred();
    $('#prime-content').imagesLoaded( function() {
      if (typeof $.fn.slick === "function" && $('.template').attr('data-template')) {
      
        SiteListing.Slider.activateSlideShow();
        SiteListing.Slider.addVideoToSlider();
        SiteListing.Slider.addInstagramToSlider();
        dfd.resolve();
      }

    });
    return dfd.promise();
  }
  SiteListing.Slider.activateSlideShow = function() {

    // IMPORTANT Slick 'initialized' needs to be binded before slick is called on the element
    $('.sub-slider').on('init', function(event, slick) {
      var mainSlides = [];

      $(slick['$slides']).each(function(i,v) {

        var imgHref = $(v).attr('data-href'),
            origImgLoaded = $('.main-slider').find('img:first-of-type').attr('data-href');

        if (typeof imgHref !== 'undefined' && imgHref !== origImgLoaded) {
          var slideElement = '<a href="'+imgHref+'" class="" id=""><img itemprop="image" src="thumbnail.asp?file='+imgHref+'&maxx=400&maxy=0" align="middle" border="0" id="large" name="large" alt="" /></a>';
          $('.main-slider').slick('slickAdd', slideElement);
        }
      });
    });

    $('.main-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      centerMode: false,
      arrows: false,
      asNavFor: '.sub-slider'
    });
    $('.sub-slider').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      variableWidth: true,
      centerMode: false,
      asNavFor: '.main-slider',
      prevArrow: '<button type="button" class="fa fa-chevron-left slick-prev">Previous</button>',
      nextArrow: '<button type="button" class="fa fa-chevron-right slick-next">Next</button>',
      focusOnSelect: true
    });
  }
  SiteListing.Slider.addVideoToSlider = function() {
    var video_embed_codes = '';

    if( embed_data = $( '.field10' ).data( 'field10' ) ) {
      video_embed_codes = embed_data.split( ' ' );
    }

    function getData(embed_code) {
      var baseUrl = "https://fast.wistia.com/oembed/?url=";
      var accountUrl = encodeURIComponent("https://home.wistia.com/medias/");
      return $.getJSON(baseUrl + accountUrl + embed_code + "&format=json&callback=?");
    }

    /* ~~ Variable Declaration ~~ */
    var AJAX = [], video_data = {}, video_markup_main, video_markup_sub = '', video_markup_product_page = '', imgUrl, videoData, slideHtml;

    if( video_embed_codes ) {
      $.each( video_embed_codes, function( i, embed_code ) {
        if (embed_code !== "") {
          AJAX.push( getData( embed_code ) );
        }
      });

      $.when.apply($, AJAX).done(function(){

        for(var i = 0; i < AJAX.length; i++){
          if( arguments[i].length ) {
            video_data[video_embed_codes[i]] = arguments[i][0];
          } else {
            video_data[video_embed_codes[i]] = arguments[i][0];
          }
        }
        $.each( video_data, function( i, video ) {
          /* Add videos to sub slick slider */
          video_markup_main = '';
          video_markup_main += '<a href="#" class="video_popup" data-video="'+ i +'" id="listing_main_image_link">';
          video_markup_main += '<i class="fa fa-play play-button" style="font-size: 7em;position: absolute;text-decoration: none;"></i>';
          video_markup_main +=  '<img itemprop="image" src="'+ video.thumbnail_url +'" align="middle" border="0" id="large" name="large" alt="'+ video.title +'" width="100%" data-href="'+ video.thumbnail_url +'" />';
          video_markup_main += '</a>';

          $('.main-slider').slick('slickAdd', video_markup_main).slick('setPosition');

          /* Add videos to sub slick slider */
          video_markup_sub = '';
          video_markup_sub += '<a data-caption="'+ video.title +'" rel="thumb-id:listing_main_image_link" rev="thumbnail.asp?file='+ video.thumbnail_url +'&amp;maxx=400&amp;maxy=0">';
          video_markup_sub +=  '<img border="0" src="'+ video.thumbnail_url + '&' + 'image_crop_resized=75x75" alt="" name="" />';
          video_markup_sub += '</a>';

          $('.sub-slider').slick('slickAdd', video_markup_sub).slick('setPosition');

          /* Add videos to page*/
          video_markup_product_page = '';
          video_markup_product_page += '<div class="padd-top col-md-4 col-sm-4"><a href="#" class="video_popup" data-video="'+ i +'" id="listing_main_image_link">';
          video_markup_product_page += '<i class="fa fa-sm fa-play play-button" style="font-size: 3em;position: absolute;text-decoration: none;"></i>';
          video_markup_product_page +=  '<img itemprop="image" src="'+ video.thumbnail_url +'" align="middle" border="0" id="large" name="large" alt="'+ video.title +'" width="100%" data-href="'+ video.thumbnail_url +'" />';
          video_markup_product_page += '</a></div>';

          $('.product-videos').append(video_markup_product_page);

        });

        $('.video_popup').on( 'click', function( e ) {
          e.preventDefault();
          var video = $(this).data('video');
          // console.log(video_data[video]);
          vex.open({
            content: video_data[video].html,
            contentCSS: { 'padding': '0', 'width': '960px' }
          });
        });
      });
    }
  }
  SiteListing.Slider.addInstagramToSlider = function() {

    // ---- FIELD 4: Instagram Hashtag ---- //
    var instagramHashtag = $( '.field4' ).data( 'field4' );
    if( instagramHashtag != null ) {
      // var instaText = "<h6 style='text-align:center; text-transform: uppercase;'>TAG PHOTOS OF YOUR SALON WITH #"+instagramHashtag+" AND MENTION @STANDISHSTUFF TO SEE YOUR PHOTOS BELOW!</h6>";
      // console.log( 'Instagram', instagramHashtag, instaText );
      // The limit parameter does not seem to work, this is an Instagram API issue. (not an issue with instafeed) I've implemented a bit of css to limit the display to 3 instead.
      var feed = new Instafeed({
        get: 'tagged',
        tagName: instagramHashtag,
        clientId: '87b875b4c64341998ef11099c0a71f76',
        mock: true,
        limit: 3,
        success: function(data) {
          // console.log(data);
          $(data.data).each(function(i, v) {
            var classname, dataVideo, instaHeight;
            /* Add conditions for instagram video! */
            if (v.type === "video") {
              classname = 'video_popup';
              dataVideo = v.videos.low_bandwidth.url;
            }
            else {
              classname = '';
              dataVideo = false;
            }
            // Set the height of the main slide instagram photo
            instaHeight = $('#product-actions-wrapper').height();
            // console.log(instaHeight);
            /* Add instagram to main slick slider */
            var instagram_markup_main = '';
            instagram_markup_main += '<a href="'+v.link+'" class="'+classname+'" data-video-insta="'+ dataVideo +'" id="listing_main_image_link">';
            if (v.type === "video") {
              instagram_markup_main += '<i class="fa fa-play play-button" style="font-size: 7em;position: absolute;text-decoration: none;"></i>';
            }
            instagram_markup_main +=  '<img itemprop="image" src="'+ v.images.standard_resolution.url +'" align="middle" border="0" id="large" name="large" alt="'+  v.caption.text +'" style="max-height:'+instaHeight+'px;" data-href="'+ v.images.standard_resolution.url +'" />';
            instagram_markup_main += '</a>';
            $('.main-slider').slick('slickAdd', instagram_markup_main);
            /* Add instagram to sub slick slider */
            var instagram_markup_sub = '';
            instagram_markup_sub += '<a data-caption="'+ v.caption.text +'" rel="thumb-id:listing_main_image_link" rev="thumbnail.asp?file='+ v.images.thumbnail.url +'&amp;maxx=400&amp;maxy=0">';
            instagram_markup_sub +=  '<img border="0" src="'+ v.images.thumbnail.url +'" alt="" name="" width="75" height="75" />';
            instagram_markup_sub += '</a>';

            $('.sub-slider').slick('slickAdd', instagram_markup_sub);
          });
        }
      });
      feed.run();
    }
  }

  // ---- ADD PRICE SALE CORNERTAG ---- //
  SiteListing.salePrice = function() {
    // SalePrice display and sale cornertag activation on Listing Page
    // SalePrice Checker
    var price = $('#price').text().replace('$','').replace(',',''),
    price = parseInt(price);
    var saleprice = $('#saleprice').text().replace('$','').replace(',','');

    if (typeof saleprice != undefined && saleprice != 0) {
      saleprice = parseInt(saleprice);
      $('.pricebox').addClass('sale-cornertag');
      $('.strike-perhaps').addClass('hidden');


      if( price != saleprice ) {
        $('#price.price').text('$' + saleprice);
      }
    }
    else {
      $('#saleprice').parent().hide();
    }
  }

  // ---- ADD PRODUCT BADGES ---- //
  SiteListing.doBadges = function() {
    // ---- FIELD 8: BADGES ---- //
    var badges = $( '.field8' ).data( 'field8' );
    var $badges = $( '.badges' );
    var $badges_list = $( '.badges-list' );

    var badgetext = {
      'free-shipping': {
        'title': 'Free Shipping',
        'class': 'free-shipping',
        'tooltip': 'This product qualifies for free shipping!'
      },
      'fire-retardant': {
        'title': 'Fire Retardant',
        'class': 'fire-retardant',
        'tooltip': 'When you shop at Standish, you can rest assured that your chairs meet the California TB117 Fire Retardant Standards.'
      },
      'heavy-duty': {
        'title': 'Heavy Duty Hardware',
        'class': 'heavy-duty',
        'tooltip': 'At Standish, we provide you with quality parts on your equipment, such as cabinet hinges that are able to withstand everyday salon and spa use.'
      },
      'iron-life': {
        'title': '50% Longer Iron Life',
        'class': 'iron-life',
        'tooltip': 'On many of our stations, the appliance holders are made of iron, and powder-coated steel. Even better, they\'re ventilated.'
      },
      'no-sales-tax': {
        'title': 'No Sales Tax',
        'class': 'no-sales-tax',
        'tooltip': ''
      },
      'ten-thousand-rub': {
        'title': '10,000 Rub Count',
        'class': 'ten-thousand-rub',
        'tooltip': 'Leather chairs are not build to withstand the salon lifestyle--they will not hold up. We use vinyl that is certified over 10,000 rubs on the Wyzenbeek rub test.'
      },
      'swap-base': {
        'title': 'Swappable Bases for Free',
        'class': 'swap-base',
        'tooltip': 'At Standish, we let you pick out whichever base you want for your chair top, at no extra charge!'
      },
      'new-arrival': {
        'title': 'New Arrival',
        'class': 'new-arrival',
        'tooltip': ''
      },
      'service': {
        'title': 'Personal Service',
        'class': 'service',
        'tooltip': ''
      },
      'warranty': {
        'title': '2-5 Yr. Warranty',
        'class': 'warranty',
        'tooltip': 'We understand that products need some love in order to stay looking new and beautiful. The quality of our products is something that we stand firmly behind, which is why we have the best warranty out there.'
      },
      'color': {
        'title': 'Free Color Variations',
        'class': 'color',
        'tooltip': ''
      },
      'returns': {
        'title': 'No Hassle Return Policy',
        'class': 'returns',
        'tooltip': 'At Standish, we will offer you a 30-day money-back guarantee on all products.'
      },
      'hardwood': {
        'title': 'Real Hardwood',
        'class': 'hardwood',
        'tooltip': ''
      },
      'extra-wide': {
        'title': 'Extra Wide',
        'class': 'extra-wide',
        'tooltip': ''
      },
      'double-stitched': {
        'title': 'Double Stitching',
        'class': 'double-stitched',
        'tooltip': ''
      },
      'inspected': {
        'title': 'Guaranteed To Pass Inspection',
        'class': 'inspected',
        'tooltip': 'All of our products pass fire retardant codes and meet Universal Plumbing Code (UPC) specifications.'
      },
      'inspected': {
        'title': 'Guaranteed To Pass Inspection',
        'class': 'inspected',
        'tooltip': 'All of our products pass fire retardant codes and meet Universal Plumbing Code (UPC) specifications.'
      },
      'made-usa': {
        'title': 'Made in the USA',
        'class': 'made-usa',
        'tooltip': 'Proudly Made in the USA!'
      },
      'gluten-free': {
        'title': 'Gluten Free',
        'class': 'gluten-free',
        'tooltip': "We want to respect your skin, and in doing so, we've taken into account gluten allergies and offer a product that is gluten-free."
      },
      'paraben-free': {
        'title': 'Paraben Free',
        'class': 'paraben-free',
        'tooltip': "Our products are delivered to you fresh, so you don't have to worry about extra additives and preservatives like Parabens."
      }, 
      'vegan': {
        'title': 'Vegan',
        'class': 'vegan',
        'tooltip': "We love your skin, we love the environment, and we love animals. With this gluten-free product, you have something to benefit all three."
      },
      'oil-free': {
        'title': 'Oil Free',
        'class': 'oil-free',
        'tooltip': "Keep your pores clear and your skin looking great when you use this oil-free product"
      },
      'soap-free': {
        'title': 'Soap Free',
        'class': 'soap-free',
        'tooltip': "We want to make sure you get the most out of this product, and by not using soap as ingredient, we do just that!"
      },
      'hypoallergenic': {
        'title': 'Hypoallergenic',
        'class': 'hypoallergenic',
        'tooltip':  "Sensitive skin? Don't worry, we've got you covered. This product is hypoallergenic and thoughtful of all skin types."
      },
      'sulfate-free': {
        'title': 'Sulfate Free',
        'class': 'sulfate-free',
        'tooltip': "You want the best for your skin and so do you. With Sulfate-Free products, we're able to do just that."
      }
    }

    if( badges ) {
      badges = badges.split(/(\s+)/);
      $.each( badges, function( i, v ) {
        var badgeslug = v.trim();
        if( typeof( badgetext[badgeslug] ) != 'undefined' ) {
          //console.log( badgetext[badgeslug].title );
          //href="http://www.standishsalongoods.com/quality#' + badgetext[badgeslug].class + '"
          $badges_list.append( '<a href="http://www.standishsalongoods.com/quality#' + badgetext[badgeslug].class + '" style="display:block;color:#696969;" data-toggle="popover" data-placement="right" class="col-xs-12 col-md-1 col-sm-1 standish-tooltip badge-product badge-' + badgetext[badgeslug].class + '" title="' + badgetext[badgeslug].title + '"><i></i><div class="hidden-sm hidden-md hidden-lg badge-text">' + badgetext[badgeslug].title + '</div></a>' );
        }     
      });

    } else {
      $badges.remove();
    }
  }

  // ---- ADD GRID EFFECT TO THE PRODUCT REVIEWS Using Isotope ---- //
  SiteListing.commenceGrid = function() {

    var $container = $('.grid');
    $container.imagesLoaded(function(){
      $container.masonry({
            itemSelector : '.grid-item',
            percentPosition: true,
            gutterWidth: 20
      });
    });
  }

  // ---- FIELD 1: Get info about the brand! ---- //
  SiteListing.getBrand = function() {
    var brand = $( '.field1' ).data( 'field1' );

    var url = "https://spreadsheets.google.com/feeds/list/15lkOyeqw1lP0njGihJXj5AnrSYnB8DIQ06bHVnctwzs/od6/public/values?alt=json-in-script";
    $.ajax({
      url:url,
      dataType:"jsonp",
      success:function(data) {

        $(data.feed.entry).each(function(i,v) {
          if ( v['gsx$keyterm']['$t'] === brand ) {
            $('#sub-resources-about-brand p').append(v['gsx$blurb']['$t']);
          }

        });

      }
    });

  }

  // ---- FIELD 3: Swap out availability text if product ---- //
  // ---- is custom made and needs more time to ship ---- //
  SiteListing.getAvailability = function() {
    // ---- FIELD 3: Availability Text ---- //
    var availability = $( '.field3' ).data( 'field3' );
    if( availability != null ) {
      var availabilityText = $( '.availability' );
      if( availability != '' ){
        availabilityText.text( availability.replace() );
      }
    } 
  }
  
  // ---- FIELD 5: Notify me when the price drops ---- //
  SiteListing.priceDropForm = function() {
    // ---- FIELD 5: Price Drop Notification Form ---- //
    var priceDropForm = $( '.field5' ).data( 'field5' );
    if( priceDropForm != null ) { 
    var priceDropTitle = $('<h4 class="priceDropTitle">Notify Me When The Price Drops!</h4><div class="priceDropForm"></div>');
    var priceDropButton = $('<a class="button medium priceDropButton">I want to be the first to know &raquo;</a>');
    $('.product-options').append( priceDropTitle, priceDropButton );
    }
    // ---- HUBSPOT PRICE DROP NOTIFICATION DROPDOWN ---- //
    $(document).on('click', '.priceDropButton', function( e ) {
      e.preventDefault();
      vex.open({
        // content: '<p>Please provide your email address</p>',
        afterOpen: function() {
          hbspt.forms.create({
            css: '',
            portalId: '239485',
            formId: priceDropForm,
            target: '.vex-content',
            submitButtonClass: 'hs-button primary medium button',
            onFormReady: function() {
              $( '.vex-content .hs-input' ).first().focus();
            }
          });
        }
      });
    });
  }

  // ---- FIELD 7: Product Details List ---- //
  // ---- @todo this doesn't have to be formatted in JS ---- //
  SiteListing.productDetailsFormat = function() {

    var details = $( '.field7' ).data( 'field7' );
    var $detailsList = $( '.details-list' );

    if( details ){
      $detailsList.find( 'li' ).remove();
      $.each( details.split( '\n' ), function( i, v ){
        $detailsList.append( '<li class="col-md-6"><span>' + v + '</li></span>' );
      });
    } else {
      $('.product-details').hide();
    }
  }

  // ---- FIELD 2: BROCHURE LINK ---- //
  SiteListing.brochureDownload = function() {
    var brochure = $( '.field2' ).data( 'field2' );
    var brochureLink = $( '.brochure-download a' );
    if( brochure !== '' ){
      brochureLink.text( 'Download Brochure' ).attr( 'href', brochure );
    }
    // ---- BROCHURE LINK CALLBACK DOWNLOAD HUBSPOT FORM ---- //
    // Hubspot + Vex Popup form
    $('.brochure-download a').first().on( 'click', function( e ) {
      e.preventDefault();
      vex.open({
        // content: '<p>Please provide your email address</p>',
        afterOpen: function() {
          hbspt.forms.create({
            portalId: '239485',
            formId: '253a1f08-bebc-40c3-ab80-88ac7e518e74',
            target: '.vex-content',
            redirectUrl: $( '.brochure-download a' ).attr('href'),
            onFormReady: function() {
              if( !$( '.vex-content .hs_email' ).length > 0 ) {
                $( '.vex-content .hs-button' ).click();
              }
            }
          });
        }
      });
    });
  }

  // ---- IMAGE COLOR CHANGING FEATURE -- TITLE ---- //
  SiteListing.changeColors = function() {
    color_list = [];
    $('.showcase a').each( function( i, v ) {
      if( $(v).data('caption') ) {
        color_list.push( $(v).data('caption').trim().toLowerCase() );
      }
    });
  }

  // ---- IMAGE COLOR CHANGING FEATURE -- SLIDESHOW ---- //
  SiteListing.changeColorsSlides = function() {
    $('.option-row').each( function( i, v ) {
      if( $(v).find('label').text().toLowerCase().indexOf("color") ) {
        $(v).on('change', function( e ) {
          // image_click( $(v).find('select')[0].selectedIndex + 1 );  // Match Index
          current_color_text = $(v).find('select option:selected').text().trim().toLowerCase();
          image_click( $.inArray( current_color_text, color_list ) + 1 );
        });
      }
    });
  }

  SiteListing.financing = function() {
    // ---- PRICEBOX FINANCING FEATURE ---- //
    var interest_rate, term_years, price, yearly_interest, total_interest, payment;
    // Do the math
    interest_rate = 0.12;
    term_years = 3;
    price = Number( $('#price').text().replace("$", "").replace(",", "") );
    yearly_interest = Math.round( ( price * interest_rate ) * 100 ) / 100;
    total_interest = Math.round( ( yearly_interest * term_years ) * 100 ) / 100;
    payment = ( Math.round( ( ( total_interest + price ) / ( term_years * 12 ) ) * 100 ) / 100 ).toFixed(2);

    // console.log( "PRICE: ", price, yearly_interest, total_interest, payment );
    // Add Financing option link
    if( price > 1000 ) {
      $(".pricebox .left-price").append('<a href="/financing.html" class="financing">* or as low as $' + payment + '/month</a>');
    }
  }

  

})(window.Standish.SiteListing = window.Standish.SiteListing || {}, jQuery);

// ---- INITIALIZE EVERYTHING ---- //
(function($) {
  $(function() {
    $('#loadingDiv').height($('.product_left').height());

    var sitelisting = Standish.SiteListing.Slider.init().then(function() {
      $('.main-slider').show();
      $('.sub-slider').show();
      $('#loadingDiv').hide();
    });

    Standish.SiteListing.salePrice();
    Standish.SiteListing.doBadges();
    Standish.SiteListing.commenceGrid();
    Standish.SiteListing.getBrand();
    Standish.SiteListing.getAvailability();
    Standish.SiteListing.productDetailsFormat();
    Standish.SiteListing.changeColors();
    Standish.SiteListing.changeColorsSlides();

    // Dont activate these for now
    // SiteListing.financing();
    // SiteListing.priceDropForm();
    // SiteListing.brochureDownload();


  });
} (jQuery));
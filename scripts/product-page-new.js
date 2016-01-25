;(function($) {
  $.SiteListing = (function() {});
  window.SiteListing = window.SiteListing || {};

  /** ~~Start Slider JS -- Add existing images to
  /* main slider then add wistia and instagram ~~ */
  window.SiteListing.Slider = window.SiteListing.Slider || {};

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
      centerMode: true,
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
            console.log(instaHeight);
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

  // ---- ADD GRID EFFECT TO THE PRODUCT REVIEWS ---- //
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

  


  // ---- INITIALIZE EVERYTHING ---- //
  $(function() {
    $('#loadingDiv').height($('.product_left').height());

    var sitelisting = SiteListing.Slider.init().then(function() {
      $('.main-slider').show();
      $('.sub-slider').show();
      $('#loadingDiv').hide();
    });

    SiteListing.salePrice();
    SiteListing.doBadges();
    SiteListing.commenceGrid();

  });

})(jQuery)
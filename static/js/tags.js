(function($){
  var tagnameWeight = {};
  $(function(){
    $('.org-ul').each(function(){
      var key = $(this).parent().prev().attr('id');
      tagnameWeight[key] = $(this).children().length;
    });
    var $tagCloudHtml = $('<div id="tag-cloud"></div>');
    // sort the keys(case insensitive)
    var keys = Object.keys(tagnameWeight).sort(function(a, b){
      return a.toUpperCase() > b.toUpperCase();
    });
    for(var i = 0; i < keys.length; ++i){
      var key = keys[i];
      var $link = $('<a rel="" href=""></a>');
      $link.text(key);
      $link.attr('rel', tagnameWeight[key]);
      $link.attr('href', '#' + key);

      $tagCloudHtml.append($link);
    }
    $wrapper = $('<div id="tag-cloud-wrapper"><h1 class="title">Tag Cloud</h1></div>');
    $('#content').before($wrapper);
    $wrapper.append($tagCloudHtml);
  });

  $.fn.tagcloud.defaults = {
    size: {start: 14, end: 18, unit: 'pt'},
    color: {start: '#00e', end: '#f52'}
  };

  $(function(){
    $('#tag-cloud a').tagcloud();
  });

  $(function(){
    $("#tag-cloud a").click(function() {
      // only show the select entry.
      $($(this).attr("href")).parent().show().siblings().hide();
      $('#content').css('min-height', '300px');
      // scroll to the selected entry
      $("html, body").animate({
	scrollTop: $($(this).attr("href")).offset().top + "px"
      }, {
	duration: 500,
	easing: "swing"
      });
      return false;
    });
  });
})(jQuery);

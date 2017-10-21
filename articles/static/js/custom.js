// 固定右侧的table-of-contents
$(function(){
  $tb = $("#table-of-contents");
  if ($tb.length <= 0) {
    return 0;
  }
  var initial_doc_top = $tb.offset().top;
  var fixed_top = 30;
  $(window).scroll(function(){
    var scrolls = $(this).scrollTop();
    if (scrolls > initial_doc_top - 30) {
      $tb.css("position", "fixed");
      $tb.css("top", "30px");
    } else {
      $tb.removeAttr("style");
    }
  });
})

// 回到顶部
$(function() {
  $(window).scroll(function(){
    if ($(window).scrollTop()>200){
      $("#fixed-back-to-top").fadeIn(1500);
    } else {
      $("#fixed-back-to-top").fadeOut(1500);
    }
  });

  $("a.back-to-top").click(function(){
    $('body,html').animate({scrollTop:0},1000);
    return false;
  });
})

// 给导航栏对应的项加上css属性
$(function(){
  var pathname = location.pathname;
  var currentPage = pathname.substring(pathname.lastIndexOf('/') + 1);

  var $liEntries = $('#site-nav > li');
  if (currentPage === '' || currentPage === "index.html"){
    var $homeLi = $($liEntries[0]);
    $homeLi.addClass('current-page');
  } else if (currentPage === 'about.html'){
    var $aboutLi = $($liEntries[1]);
    $aboutLi.addClass('current-page');
  } else if(currentPage === 'tags.html'){
    var $tagsLi = $($liEntries[2]);
    $tagsLi.addClass('current-page');
  } else{
    var $homeLi = $($liEntries[0]);
    $homeLi.addClass('current-page');
  }
})

$(function() {
  $("#site-nav-btn").click(function(){
    $("#site-nav").toggleClass("mobi-hid");
  });
})

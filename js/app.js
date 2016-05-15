(function ($) {
  "use strict";

  $(function () {
    initVideoboxes();
  });

  function initVideoboxes() {
    var $boxes = $('.video-box');
    if (!$boxes.length) { return; }
    
    $boxes.each(function (i, el) {
      var $el = $(el);

      // Setting object instance to the el data
      $el.data('videoBox', new window.VideoCustom($el));
    });
  }


}(jQuery))
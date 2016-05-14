"use strict";
/**
 * Create custom components for the video
 *   Single component is a function which returns object
 *     with template which fires after elemtn is going trough the processEl function
 *   This will allow us to extend player with our own custom components which will
 *     have access to the video.js api.
 */
window.VideoCustom = (function ($) {

  /**
   * Class constructor - init functionality
   */
  function Constructor(cnt) {
    this.$cnt = $(cnt);
    this.videoSrc = this.$cnt.data('src');
    this.createVideo(function () {
      this.videoEvents();
      this.createNavigation();
      this.eventNamespace = 'videoExtension';
    }.bind(this));
  };

  // Extend our class with video.js prototype
  Constructor.prototype = Object.create(window.VideoExt.prototype);

  /**
   * Create navigation elements as a jQuery object
   *   and append it into container
   */
  Constructor.prototype.createNavigation = function () {
    this.$nav = $('<div class="navigation"></div>');

    var $actionBtn = $('<div class="action-btn"></div>').append(
      this.processEl(this.playButton()),
      this.processEl(this.pauseButton()),
      this.processEl(this.repeatButton())
    );

    var $overlayBtns = $('<div class="overlay-btns"></div>').append(
      this.processEl(this.playButton()),
      this.processEl(this.pauseButton()),
      this.processEl(this.repeatButton())
    );

    this.$nav.append(
      $actionBtn,
      this.processEl(this.timeProgress()),
      this.processEl(this.progressBar()),
      this.processEl(this.muteButton()),
      this.processEl(this.volumeBar()),
      this.processEl(this.fullScreenButton())
    );
    this.$cnt.append(this.$nav, $overlayBtns);
  }

  /**
   * Processing custom component.
   *   You need to use this function as a middleware of the component
   *     it will return jQuery selection of the component tpl
   *     and fire callback with jQuery element as a parameter
   * @param  {Object} el component element
   * @return {Object}    jQuery selection of component tpl
   */
  Constructor.prototype.processEl = function (el) {
    var $el = $(el.tpl);
    el.cb($el);
    return $el;
  }

  /**
   * Play button component
   * @return {Object} component
   */
  Constructor.prototype.playButton = function () {
    var self = this;
    return {
      tpl: '<span class="play"><i class="fa fa-play" aria-hidden="true"></i></span>',
      cb: function ($el) {
        $el.off('click.' + self.eventNamespace).on('click.' + self.eventNamespace, function () {
          self.play();
        });
      }
    }
  }

  /**
   * Pause button component
   * @return {Object} component
   */
  Constructor.prototype.pauseButton = function () {
    var self = this;
    return {
      tpl: '<span class="pause"><i class="fa fa-pause" aria-hidden="true"></i></span>',
      cb: function ($el) {
        $el.off('click.' + self.eventNamespace).on('click.' + self.eventNamespace, function () {
          self.pause();
        });
      }
    }
  }

  /**
   * Repeat button component
   * @return {Object} component
   */
  Constructor.prototype.repeatButton = function () {
    var self = this;
    return {
      tpl: '<span class="repeat"><i class="fa fa-repeat" aria-hidden="true"></i></span>',
      cb: function ($el) {
        $el.off('click.' + self.eventNamespace).on('click.' + self.eventNamespace, function () {
          self.play();
        });
      }
    }
  }

  /**
   * Mute button component
   * @return {Object} component
   */
  Constructor.prototype.muteButton = function() {
    var self = this;
    return {
      tpl: '<span class="mute"><i class="fa fa-volume-down" aria-hidden="true"></i></span>',
      cb: function ($el) {
        $el.off('click.' + self.eventNamespace).on('click.' + self.eventNamespace, function () {
          self.toggleMute();
        });
      }
    }
  };

  /**
   * Progress bar component
   * @return {Object} component
   */
  Constructor.prototype.progressBar = function () {
    var self = this;
    return {
      tpl: '<div class="progress-bar"><span class="progress"></span></div>',
      cb: function ($el) {
        var clicked = false;
        var $progress = $el.children();
        self.$cnt.on('videoProgress', function (e, time) {
          setProgress(time);
        })
        $el.on('mousedown', function (e) {
          clicked = true;
          handler(e, this);
        });
        $el.on('mouseup', function () {
          clicked = false;
        });
        $el.on('mouseout', function (e) {
          clicked = false;
        });
        $el.on('mousemove', function (e) {
          if (!clicked) { return; }
          handler(e, this);
        });
        function handler(e, el) {
          var $el = $(el);
          var x = e.pageX - $el.offset().left;
          var percents = x / $el.width();
          console.log(el.offsetLeft);
          self.setTime(percents, true);
        }
        function setProgress(time) {
          $progress.css({width: time.percent + '%'});
        }
        setProgress(self.getCurrentTime());
      }
    }
  }

  /**
   * Time progress component
   * @return {Object} component
   */
  Constructor.prototype.timeProgress = function () {
    var self = this;
    return {
      tpl: '<div class="time-progress"><span class="current-time"></span>' +
        '<span class="remaining-time"></span> / <span class="total-time"></span></div>',
      cb: function ($el) {
        var $currentTime = $el.find('.current-time');
        var $remainingTime = $el.find('.remaining-time');
        var $totalTime = $el.find('.total-time');
        self.$cnt.on('videoProgress', function (e, t) {
          setProgress(t);
        });
        $el.on('click', function () {
          $el.toggleClass('remaining');
        });
        function setProgress(t) {
          $currentTime.html(HP.toTime(Math.round(t.time)));
          $remainingTime.html(HP.toTime(Math.round(t.total - t.time)));
          $totalTime.html(HP.toTime(Math.round(t.total)));
        }
        setProgress(self.getCurrentTime());
      }
    }
  }

  /**
   * Full screen button component
   * @return {Object} component
   */
  Constructor.prototype.fullScreenButton = function () {
    var self = this;
    return {
      tpl: '<span class="full-screen"><i class="fa fa-expand" aria-hidden="true"></i></span>',
      cb: function ($el) {
        $el.on('click', function () {
          self.goFullScreen();
        });
      }
    }
  }

  /**
   * Volume bar component
   * @return {Object} component
   */
  Constructor.prototype.volumeBar = function () {
    var self = this;
    return {
      tpl: '<div class="volume-progress"><span class="progress"></span></div>',
      cb: function ($el) {
        var clicked = false;
        var $progress = $el.children();
        self.$cnt.on('volumeChange', function (e, volume) {
          $progress.css({width: (volume * 100) + '%'});
        })
        $el.on('mousedown', function (e) {
          clicked = true;
          handler(e, this);
        });
        $el.on('mouseup', function () {
          clicked = false;
        });
        $el.on('mouseout', function (e) {
          clicked = false;
        });
        $el.on('mousemove', function (e) {
          if (!clicked) { return; }
          handler(e, this);
        });
        function handler(e, el) {
          var $el = $(el);
          var x = e.pageX - $el.offset().left;
          var percents = x / $el.width();
          self.setVolume(percents);
        }

      }
    }
  }

  return Constructor;
}(jQuery));
console.log(window.VideoControls);
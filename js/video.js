"use strict";

// TODO - fullscreen button

/**
 * Video basic layer:
 *   Creating video element and basic events
 *   for working with video API
 */
window.VideoExt = (function ($) {

  /**
   * Class constructor - init functionality
   */
  function Constructor(cnt) {
    this.$cnt = $(cnt);
    this.videoSrc = this.$cnt.data('src');
    this.createVideo(function () {
      this.videoEvents();
    }.bind(this));
  }

  /**
   * Set diferrent actions on all kind of video events
   */
  Constructor.prototype.videoEvents = function () {
    // TODO: mute bug

    // On pause switch classes and stop progress event
    this.video.addEventListener('pause', function () {
      this.switchClass('pause');
      this.stopProgressInterval();
    }.bind(this));

    // On play switch classes and start progress event
    this.video.addEventListener('play', function () {
      this.switchClass('play');
      this.startProgressInterval();
    }.bind(this));

    // On video end switch classes and stop progress event
    this.video.addEventListener('ended', function () {
      this.switchClass('ended');
      this.stopProgressInterval();
    }.bind(this));

    // On mute add class to the container
    this.onMute = function () {
      this.$cnt.addClass('mute');
    }.bind(this);

    // On unmute remove class from the container
    this.onUnMute = function () {
      this.$cnt.removeClass('mute');
    }.bind(this);

    // On volume change check for mute state and trigger custom event
    this.video.addEventListener('volumechange', function () {
      if (this.video.muted === true) {
        this.onMute();
      } else {
        this.onUnMute();
      }
      this.$cnt.trigger('volumeChange', this.video.volume);
    }.bind(this));
  }

  /**
   * Starting video progress interval which fires
   *   events repeatedly when video is playing
   */
  Constructor.prototype.startProgressInterval = function () {
    clearInterval(this.pInterval);
    this.pInterval = setInterval(function () {
      this.$cnt.trigger('videoProgress', this.getCurrentTime());
    }.bind(this), 100);
  }

  /**
   * Stop video progress interval
   */
  Constructor.prototype.stopProgressInterval = function () {
    clearInterval(this.pInterval);
  }

  /**
   * Create html video element and wait till it loads
   * @param  {Function} cb callback function which fires after video is loaded
   */
  Constructor.prototype.createVideo = function (cb) {
    var $video = $('<video src="' + this.videoSrc + '"></video>');
    this.video = $video.get(0);
    this.$cnt.append($video);
    this.video.addEventListener('loadeddata', function () {
      this.$cnt.addClass('loaded');
      cb();
    }.bind(this));
  }

  /**
   * Switch video action class on the video conainer
   *   with the one which provided as a parameter
   * @param  {String} cls class which will be added to the container element
   */
  Constructor.prototype.switchClass = function (cls) {
    this.$cnt.removeClass('play pause ended').addClass(cls)
  }

  /**
   * Starts video playing
   */
  Constructor.prototype.play = function () {
    this.video.play();
  }

  /**
   * Pause video playing
   */
  Constructor.prototype.pause = function () {
    this.video.pause();
  }

  /**
   * Get time object from the video
   * @return {Object} - which contains current time in seconds,
   *                    current time in percents and total time in seconds
   */
  Constructor.prototype.getCurrentTime = function () {
    return {
      time: this.video.currentTime,
      percent: this.video.currentTime / this.video.seekable.end(0) * 100,
      total: this.video.seekable.end(0)
    }
  }

  /**
   * Set playback time for the video
   * @param {Number} time     time for the video
   * @param {Boolean} percents - set this flag to true if you pass the time in percents
   */
  Constructor.prototype.setTime = function (time, percents) {
    if (percents) { time = this.video.seekable.end(0) * time; }
    this.video.currentTime = time;
    this.$cnt.trigger('videoProgress', this.getCurrentTime());
  }

  /**
   * Set volue for the video (range from 0 to 1)
   */
  Constructor.prototype.setVolume = function (n) {
    if (n > 1) {
      n = 1;
    } else if (n < 0) {
      n = 0;
    }
    this.video.volume = n;
  }

  /**
   * Go in full screen mode with fallback for different browsers
   */
  Constructor.prototype.goFullScreen = function () {
    if (this.video.requestFullscreen) {
      this.video.requestFullscreen();
    } else if (this.video.msRequestFullscreen) {
      this.video.msRequestFullscreen();
    } else if (this.video.mozRequestFullScreen) {
      this.video.mozRequestFullScreen();
    } else if (this.video.webkitRequestFullscreen) {
      this.video.webkitRequestFullscreen();
    }
  }

  /**
   * Toggling mute state for the video
   */
  Constructor.prototype.toggleMute = function () {
    if (this.video.muted === true) {
      this.video.muted = false;
    } else {
      this.video.muted = true;
    }
  }

  return Constructor;
}(jQuery));
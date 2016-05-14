/**
 * Object with helper functions
 */
window.HP = {
  /**
   * Conver seconds to the time format
   * @param  {Number} s seconds
   * @return {String}   timee in a fancy format
   */
  toTime: function (s) {
    var totalSec = s;
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    var hFormat = (hours < 10 ? "0" + hours + ':' : hours + ':');
    var mFormat = (minutes < 10 ? "0" + minutes + ':' : minutes + ':');
    var sFormat = (seconds  < 10 ? "0" + seconds : seconds);
    if (hFormat === '00:') { hFormat = ''; }

    return hFormat + mFormat + sFormat;
  }
}
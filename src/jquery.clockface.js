/*
Copyright (C) 2013 James THompson @jameslouiz

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function ($) {

  // Check for countdown
  if (!$.fn.countdown) throw new Error('Countdown Clock requires countdown.js');

  var Clockface = function (element, options) {
    this.setup(element, options);
  };

  Clockface.Defaults = $.extend({}, $.fn.countdown.Constructor.Defaults, {
    hoursLeft: 0,
    minutesLeft: 0,
    secondsLeft: 0,
    millisecondsLeft: 0
  });

  // Bind the constructor
  Clockface.prototype.constructor = Clockface;

  // Clockface extends countdown.js
  Clockface.prototype = $.extend({}, $.fn.countdown.Constructor.prototype);

  /**
   * Initialise each element and setup params
   * @param element - Object to bind countdown to
   * @param options - Object of options to be extended
   */
  Clockface.prototype.setup = function(element, options)
  {
    this.$element = $(element);
    this.options = $.extend({}, Clockface.Defaults, options);

    this.unit = this.$element.find('[data-countdown-unit]');
    this.segHeight = this.unit.find('li').outerHeight();

    this.unit.find('ul').css('top', -this.segHeight * 9);
    this.wheels = [];

    var scope = this;
    this.unit.each(function(){
      var $this = $(this),
          digit = $this.find('ul');
      scope.wheels[$this.data('countdown-unit')] = digit;
    });

    this.selectors = {
      hours: {
        '0': $(this.wheels['hours'][0]),
        '1': $(this.wheels['hours'][1])
      },
      minutes: {
        '0': $(this.wheels['minutes'][0]),
        '1': $(this.wheels['minutes'][1])
      },
      seconds: {
        '0': $(this.wheels['seconds'][0]),
        '1': $(this.wheels['seconds'][1])
      },
      milliSec: {
        '0': $(this.wheels['milliSec'][0]),
        '1': $(this.wheels['milliSec'][1])
      }
    };

    this.setClock();
  };

  Clockface.prototype.update = function(remaining)
  {

    this.selectors.milliSec[0].css({top: -this.segHeight * remaining['milliSec'][0]});
    this.selectors.milliSec[1].css({top: -this.segHeight * remaining['milliSec'][1]});

    if (this.iterator == 1 || this.counting == false) {
      this.selectors.hours[0].css({top: -this.segHeight * remaining['hours'][0]}, 100);
      this.selectors.hours[1].css({top: -this.segHeight * remaining['hours'][1]}, 100);
      this.selectors.minutes[0].css({top: -this.segHeight * remaining['minutes'][0]}, 100);
      this.selectors.minutes[1].css({top: -this.segHeight * remaining['minutes'][1]}, 100);
      this.selectors.seconds[0].css({top: -this.segHeight * remaining['seconds'][0]}, 100);
      this.selectors.seconds[1].css({top: -this.segHeight * remaining['seconds'][1]}, 100);
    }

    if (this.iterator == 100) {
      this.iterator = 0;
    }
  };






  // CLOCKFACE PLUGIN DEFINITION

  var old = $.fn.clockface;

  $.fn.clockface = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data('jl.clockface'),
        options = typeof option == 'object' && option;

      if (!data) $this.data('jl.clockface', (new Clockface(this, options)));

    })
  };

  $.fn.clockface.Constructor = Clockface;

  // Countdown NO CONFLICT
  $.fn.clockface.noConflict = function () {
    $.fn.clockface = old;
    return this
  };





})(jQuery);
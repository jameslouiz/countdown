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

    //used to fix method calling issues on un-instantiated objects
    $.bind = function (object, method) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function () {
        var args2 = [this].concat(args, $.makeArray(arguments));
        return method.apply(object, args2);
      };
    };

    var Countdown = function (element, options) {
      this.init(element, options);
    };

    Countdown.Defaults = {
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
      millisecondsLeft: 0
    };

    Countdown.prototype = {
      $element: null,
      anchor: null, // Will store the Date() on start,
      ticker: null, // stores a new Date Obj on refresh,
      interval: null,
      counting: false,
      iterator: 0,
      remaining: {
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
        milliSec: null
      },
      hooks: {
        finished: null
      }
    };

    Countdown.prototype.callHooks = function(hook)
    {
      if (typeof this.options.hooks[hook] == 'function'){
        this.options.hooks[hook](this);
      } else {
        throw('Not a function:'+hook);
      }
    };

    /**
    * Initialise each element and setup params
    * @param element - Object to bind countdown to
    * @param options - Object of options to be extended
    */
    Countdown.prototype.init = function(element, options)
    {
      this.$element = $(element);
      this.options = $.extend({}, Countdown.Defaults, options);

      this.setClock();
    };

    /**
     * Sets the clock using based on times passed in remaining
     * @param remaining Object of remaining times
     */
    Countdown.prototype.setClock = function(remaining)
    {
      var
        setTimes,
        options = {
        hours: this.options.hoursLeft,
        minutes: this.options.minutesLeft,
        seconds: this.options.secondsLeft,
        milliSec: this.options.millisecondsLeft
      };

      if (typeof remaining == 'undefined') {
        setTimes = options;
      }
      else {
        setTimes = remaining;
      }

      this.update(this.prettyTime(setTimes));
    };

    /**
    * Start
    */
    Countdown.prototype.start = function()
    {
      var scope = this;
      if (!this.counting) {
        this.anchor = new Date();

        // Setup Start Times
        this.anchor.setHours(this.anchor.getHours()+this.options.hoursLeft);
        this.anchor.setMinutes(this.anchor.getMinutes()+this.options.minutesLeft);
        this.anchor.setSeconds(this.anchor.getSeconds()+this.options.secondsLeft);
        this.anchor.setMilliseconds(this.anchor.getMilliseconds()+this.options.millisecondsLeft);

        this.interval = setInterval(function(){
          scope.refresh();
          scope.iterator++;
        },10);
        this.counting = true;
      }
    };

    /**
     * Reset
     */
    Countdown.prototype.reset = function()
    {
      this.pause();
      this.setClock();
    };

    /**
     * Pause
     */
    Countdown.prototype.pause = function()
    {
      if (this.counting) {
        clearInterval(this.interval);
        this.counting = false;
      }
    };

    /**
     * Clear
     */
    Countdown.prototype.clear = function()
    {
      this.pause();
      var zero = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliSec: 0
      };
      this.setClock(zero);
    };

    /**
     * Refresh
     */
    Countdown.prototype.refresh = function()
    {
      this.ticker = new Date(); // Updates with date object
      this.diff = this.anchor - this.ticker; // Get time elapsed
      this.diff = new Date(this.diff); // Format time elapsed

      // Create an object of all the remaining times
      this.remaining = {
          hours: this.diff.getHours(),
          minutes: this.diff.getMinutes(),
          seconds: this.diff.getSeconds(),
          milliSec: this.diff.getMilliseconds()
      };

      // When the time is up, set everything to 0 and clear interval
      if ( this.ticker >= this.anchor ) {
        this.clear();
        this.callHooks('finished');
      } else {
        this.update(this.prettyTime(this.remaining));
      }


    };

    Countdown.prototype.update = function(remaining)
    {
      for (var x in remaining) {
        this.$element.find('[data-countdown-unit='+x+']').text(remaining[x].join(''));
      }
    };

    /**
     * Makes the time strings pretty
     */
    Countdown.prototype.prettyTime = function(remaining) {

      // Probably need a better way of doing this
      var milliSec = remaining.milliSec;
      if (milliSec < 10) {
        milliSec = '00'+milliSec;
      }
      else if(milliSec < 100) {
        milliSec = '0'+milliSec;
      }

      // Stash the values in an object to use later
      var stash = {
        hours: remaining.hours < 10 ? '0'+remaining.hours : remaining.hours,
        minutes: remaining.minutes < 10 ? '0'+remaining.minutes : remaining.minutes,
        seconds: remaining.seconds < 10 ? '0'+remaining.seconds : remaining.seconds,
        milliSec: milliSec
      };

      // return new object with times with prepended 0 and as a string
      return {
        hours: stash.hours.toString(),
        minutes: stash.minutes.toString(),
        seconds: stash.seconds.toString(),
        milliSec: stash.milliSec.toString()
      }

    };

    // COUNTDOWN PLUGIN DEFINITION

    var old = $.fn.countdown;

    $.fn.countdown = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('jl.countdown'),
                options = typeof option == 'object' && option;

            if (!data) $this.data('jl.countdown', (data = new Countdown(this, options)));
        })
    };

    $.fn.countdown.Constructor = Countdown;


    // Countdown NO CONFLICT

    $.fn.countdown.noConflict = function () {
        $.fn.countdown = old;
        return this
    }


})(jQuery);
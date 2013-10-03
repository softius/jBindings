Object.prototype.follow = function(cb, cb_call) 
{
	cb_call = typeof cb_call !== 'undefined' ? cb_call : true

	jBindings.bind(this, cb)

	if (cb_call) {
		cb(this)
	}
}

var jBindings = {
	bind: function(dp, cb, src)    {
		src = typeof src !== 'undefined' ? src : dp
    	if (dp.tagName) {
    		(function () {
    			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    			var observer = new MutationObserver(function(mutations) {
    				mutations.forEach(function(mutation) {
    					cb(src)
    				})
    			})
    			observer.observe(dp, {attributes: true, childList: true, characterData: true, subtree: true})
    			if ('INPUT' == dp.tagName) {
					dp.addEventListener('input', function() {
    					cb(src)
    				})
    			} else if ('SELECT' == dp.tagName) {
    				dp.addEventListener('change', function() {
    					cb(src)
    				})
    			}
    		})()
    		return 
    	}

		for (var i in dp) {
	        if (dp.hasOwnProperty(i)) {
				if (dp[i] instanceof Object) {
	                jBindings.bind(dp[i], cb, src)
	            } else if (!(dp[i] instanceof Function)) {
	            	(function(src, dp, i) {
	            		var l_val = dp[i]

	            		if (delete dp[i]) {
	            			Object.defineProperty(
	            				dp,
	            				i,
	            				{
	            					enumerable: true,
	            					configurable: true, 
	            					get: function() {
	            						return l_val
	            					},
	            					set: function(val) {
	            						l_val = val
	            						cb(src)
	            					}
	            				}
	            			);
	            		}
	            	})(src, dp, i)
	            }
	        } 
	    }
	}
}

if (window.jQuery) {
	(function($) {
		$.fn.follow = function(cb, cb_call) {
			return this.each(function() {
				$(this).get(0).follow(cb, cb_call)
			});
		}
	}( jQuery ));
}
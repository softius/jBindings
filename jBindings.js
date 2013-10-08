Object.prototype.follow = function(source_prop, target, target_prop)
{
    var cb = null
    var cb_call = true

    // We create a valid Function in the case that `cb` is not Function
    // This is the case where follow is call on a variable/object level i.e. $('#id').follow('prop', variable)
    if (Object.prototype.toString.call(source_prop) != '[object Function]') {
        cb = (function(source_prop, target, target_prop) {
            return function(source) {
                target[target_prop] = source[source_prop]
            }
        })(source_prop, target, target_prop)
        cb_call = true
    } else {
        cb = source_prop
        cb_call = typeof target !== 'undefined' ? target : true
    }
    
    jBindings.bind(this, cb)
    if (cb_call) {
        cb(this)
    }
}

var jBindings = {
    bind: function(dp, cb, src)    {
        src = typeof src !== 'undefined' ? src : dp
        if (dp.tagName) {
            this.bindHTMLElement(dp, cb, src)
        } else {
            this.bindObject(dp, cb, src)
        }
    },
    bindHTMLElement: function(dp, cb, src) {
            (function () {
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        cb(src)
                    })
                })
                observer.observe(dp, {attributes: true, childList: true, characterData: true, subtree: true})
                if ('INPUT' == dp.tagName) {
                    if ('radio' == dp.type) {
                        dp.addEventListener('click', function() {
                            cb(src)
                        })
                    } else {
                        dp.addEventListener('input', function() {
                            cb(src)
                        })
                    }
                } else if ('SELECT' == dp.tagName) {
                    dp.addEventListener('change', function() {
                        cb(src)
                    })
                }
            })()
    },
    bindObject: function(dp, cb, src) {
        for (var i in dp) {
            if (dp.hasOwnProperty(i)) {
                if (dp[i] instanceof Object) {
                    jBindings.bindObject(dp[i], cb, src)
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
        $.fn.follow = function(source_prop, target, target_prop) {
            return this.each(function() {
                $(this).get(0).follow(source_prop, target, target_prop)
            });
        }
    }( jQuery ));
}
/**
 *  Ajax Autocomplete for jQuery, version 1.1.2
 *  (c) 2010 Tomas Kirda
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
 *
 *  Last Review: 03/18/2010
 */
(function (e) {
    function l(b, a, c) {
        a = "(" + c.replace(m, "\\$1") + ")";
        return b.replace(new RegExp(a, "gi"), "<strong>$1</strong>")
    }

    function i(b, a) {
        this.el = e(b);
        this.el.attr("autocomplete", "off");
        this.suggestions = [];
        this.data = [];
        this.badQueries = [];
        this.selectedIndex = -1;
        this.currentValue = this.el.val();
        this.intervalId = 0;
        this.cachedResponse = [];
        this.onChangeInterval = null;
        this.ignoreValueChange = false;
        this.serviceUrl = a.serviceUrl;
        this.isLocal = false;
        this.options = {
            autoSubmit: false,
            minChars: 1,
            maxHeight: 300,
            deferRequestBy: 0,
            width: 0,
            highlight: true,
            params: {},
            fnFormatResult: l,
            delimiter: null,
            zIndex: 9999
        };
        this.initialize();
        this.setOptions(a)
    }
    var m = new RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g");
    e.fn.autocomplete = function (b) {
        return new i(this.get(0), b)
    };
    i.prototype = {
        killerFn: null,
        initialize: function () {
            var b, a, c;
            b = this;
            a = Math.floor(Math.random() * 1048576).toString(16);
            c = "Autocomplete_" + a;
            this.killerFn = function (d) {
                if (e(d.target).parents(".autocomplete").size() === 0) {
                    b.killSuggestions();
                    b.disableKillerFn()
                }
            };
            if (!this.options.width) this.options.width = this.el.width();
            this.mainContainerId = "AutocompleteContainter_" + a;
            e('<div id="' + this.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + c + '" style="display:none; width:300px;"></div></div></div>').appendTo("body");
            this.container = e("#" + c);
            this.fixPosition();
            window.opera ? this.el.keypress(function (d) {
                b.onKeyPress(d)
            }) : this.el.keydown(function (d) {
                b.onKeyPress(d)
            });
            this.el.keyup(function (d) {
                b.onKeyUp(d)
            });
            this.el.blur(function () {
                b.enableKillerFn()
            });
            this.el.focus(function () {
                b.fixPosition()
            })
        },
        setOptions: function (b) {
            var a = this.options;
            e.extend(a, b);
            if (a.lookup) {
                this.isLocal = true;
                if (e.isArray(a.lookup)) a.lookup = {
                    suggestions: a.lookup,
                    data: []
                }
            }
            e("#" + this.mainContainerId).css({
                zIndex: a.zIndex
            });
            this.container.css({
                maxHeight: a.maxHeight + "px",
                width: a.width
            })
        },
        clearCache: function () {
            this.cachedResponse = [];
            this.badQueries = []
        },
        disable: function () {
            this.disabled = true
        },
        enable: function () {
            this.disabled = false
        },
        fixPosition: function () {
            var b = this.el.offset();
            e("#" + this.mainContainerId).css({
                top: b.top + this.el.innerHeight() + "px",
                left: b.left + "px"
            })
        },
        enableKillerFn: function () {
            var b = this;
            e(document).bind("click", b.killerFn)
        },
        disableKillerFn: function () {
            var b = this;
            e(document).unbind("click", b.killerFn)
        },
        killSuggestions: function () {
            var b = this;
            this.stopKillSuggestions();
            this.intervalId = window.setInterval(function () {
                b.hide();
                b.stopKillSuggestions()
            }, 300)
        },
        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId)
        },
        onKeyPress: function (b) {
            if (!(this.disabled || !this.enabled)) {
                switch (b.keyCode) {
                case 27:
                    this.el.val(this.currentValue);
                    this.hide();
                    break;
                case 9:
                case 13:
                    if (this.selectedIndex === -1 || b.keyCode === 9) {
                        this.hide();
                        return
                    }
                    this.select(this.selectedIndex);
                    break;
                case 38:
                    this.moveUp();
                    break;
                case 40:
                    this.moveDown();
                    break;
                default:
                    return
                }
                b.stopImmediatePropagation();
                b.preventDefault()
            }
        },
        onKeyUp: function (b) {
            if (!this.disabled) {
                switch (b.keyCode) {
                case 38:
                case 40:
                    return
                }
                clearInterval(this.onChangeInterval);
                if (this.currentValue !== this.el.val())
                    if (this.options.deferRequestBy > 0) {
                        var a = this;
                        this.onChangeInterval = setInterval(function () {
                            a.onValueChange()
                        }, this.options.deferRequestBy)
                    } else this.onValueChange()
            }
        },
        onValueChange: function () {
            clearInterval(this.onChangeInterval);
            this.currentValue = this.el.val();
            var b = this.getQuery(this.currentValue);
            this.selectedIndex = -1;
            if (this.ignoreValueChange) this.ignoreValueChange = false;
            else b === "" || b.length < this.options.minChars ? this.hide() : this.getSuggestions(b)
        },
        getQuery: function (b) {
            var a;
            a = this.options.delimiter;
            if (!a) return e.trim(b);
            b = b.split(a);
            return e.trim(b[b.length - 1])
        },
        getSuggestionsLocal: function (b) {
            var a, c, d, g, f;
            c = this.options.lookup;
            d = c.suggestions.length;
            a = {
                suggestions: [],
                data: []
            };
            b = b.toLowerCase();
            for (f = 0; f < d; f++) {
                g = c.suggestions[f];
                if (g.toLowerCase().indexOf(b) === 0) {
                    a.suggestions.push(g);
                    a.data.push(c.data[f])
                }
            }
            return a
        },
        getSuggestions: function (b) {
            var a, c;
            if ((a = this.isLocal ? this.getSuggestionsLocal(b) : this.cachedResponse[b]) && e.isArray(a.suggestions)) {
                this.suggestions = a.suggestions;
                this.data = a.data;
                this.suggest()
            } else if (!this.isBadQuery(b)) {
                c = this;
                c.options.params.query = b;
                e.get(this.serviceUrl, c.options.params, function (d) {
                    c.processResponse(d)
                }, "text")
            }
        },
        isBadQuery: function (b) {
            for (var a = this.badQueries.length; a--;)
                if (b.indexOf(this.badQueries[a]) === 0) return true;
            return false
        },
        hide: function () {
            this.enabled = false;
            this.selectedIndex = -1;
            this.container.hide()
        },
        suggest: function () {
            if (this.suggestions.length === 0) this.hide();
            else {
                var b, a, c, d, g, f, j, k;
                b = this;
                a = this.suggestions.length;
                d = this.options.fnFormatResult;
                g = this.getQuery(this.currentValue);
                j = function (h) {
                    return function () {
                        b.activate(h)
                    }
                };
                k = function (h) {
                    return function () {
                        b.select(h)
                    }
                };
                this.container.hide().empty();
                for (f = 0; f < a; f++) {
                    c = this.suggestions[f];
                    c = e((b.selectedIndex === f ? '<div class="selected"' : "<div") + ' title="' + c + '">' + d(c, this.data[f], g) + "</div>");
                    c.mouseover(j(f));
                    c.click(k(f));
                    this.container.append(c)
                }
                this.enabled = true;
                this.container.show()
            }
        },
        processResponse: function (b) {
            var a;
            try {
                a = eval("(" + b + ")")
            } catch (c) {
                return
            }
            if (!e.isArray(a.data)) a.data = [];
            if (!this.options.noCache) {
                this.cachedResponse[a.query] = a;
                a.suggestions.length === 0 && this.badQueries.push(a.query)
            }
            if (a.query === this.getQuery(this.currentValue)) {
                this.suggestions = a.suggestions;
                this.data = a.data;
                this.suggest()
            }
        },
        activate: function (b) {
            var a, c;
            a = this.container.children();
            this.selectedIndex !== -1 && a.length > this.selectedIndex && e(a.get(this.selectedIndex)).removeClass();
            this.selectedIndex = b;
            if (this.selectedIndex !== -1 && a.length > this.selectedIndex) {
                c = a.get(this.selectedIndex);
                e(c).addClass("selected")
            }
            return c
        },
        deactivate: function (b, a) {
            b.className = "";
            if (this.selectedIndex === a) this.selectedIndex = -1
        },
        select: function (b) {
            var a;
            if (a = this.suggestions[b]) {
                this.el.val(a);
                if (this.options.autoSubmit) {
                    a = this.el.parents("form");
                    a.length > 0 && a.get(0).submit()
                }
                this.ignoreValueChange = true;
                this.hide();
                this.onSelect(b)
            }
        },
        moveUp: function () {
            if (this.selectedIndex !== -1)
                if (this.selectedIndex === 0) {
                    this.container.children().get(0).className = "";
                    this.selectedIndex = -1;
                    this.el.val(this.currentValue)
                } else this.adjustScroll(this.selectedIndex - 1)
        },
        moveDown: function () {
            this.selectedIndex !== this.suggestions.length - 1 && this.adjustScroll(this.selectedIndex + 1)
        },
        adjustScroll: function (b) {
            var a, c, d;
            a = this.activate(b).offsetTop;
            c = this.container.scrollTop();
            d = c + this.options.maxHeight - 25;
            if (a < c) this.container.scrollTop(a);
            else a > d && this.container.scrollTop(a - this.options.maxHeight + 25);
            this.el.val(this.getValue(this.suggestions[b]))
        },
        onSelect: function (b) {
            var a, c, d;
            a = this;
            c = a.options.onSelect;
            d = a.suggestions[b];
            b = a.data[b];
            a.el.val(a.getValue(d));
            e.isFunction(c) && c(d, b)
        },
        getValue: function (b) {
            var a, c;
            c = this;
            a = c.options.delimiter;
            if (!a) return b;
            c = c.currentValue;
            a = c.split(a);
            if (a.length === 1) return b;
            return c.substr(0, c.length - a[a.length - 1].length) + b
        }
    }
})(jQuery);
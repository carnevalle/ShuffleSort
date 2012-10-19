;(function($, window, undefined) {

    // Plugin defaults, these will be shared among all plugin instances
    var pluginName = 'shufflesort',
    defaults = {
        sortorder: "ASC"
    };

    // Plugin constructor, no need to modify this, use the init() method below

    function Plugin(element, options) {
        this.el = element;
        this.$el = $(element);
        this.$window = $(window);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Plugin prototype, use the init method for custom initialisation
    Plugin.prototype = {

        init: function() {
            this.items = this.$el.children();
            this.api = {
                'reorder': this.reorder
            };
        },

        reorder: function(property){

            var sortorder = this.options.sortorder;
            var sorteditems = this.$el.children();
            // sort based on timestamp attribute
            sorteditems.sort(function(a, b) {

             // convert to integers from strings
             a = $(a).attr(property);
             b = $(b).attr(property);

             // compare
             if (a > b) {
              return (sortorder === "ASC")? 1 : -1;
             } else if (a < b) {
              return (sortorder === "ASC")? -1 : 1;
             } else {
              return 0;
             }
            });

            this.animate(this.items, sorteditems);
        },

        animate: function(base, sorted){
            for (var i = 0, len = sorted.length; i < len; i++) {
                if(sorted[i] !== base[i]){
                    //this.animateTo($(sorted[i]), $(base[i]).offset());
                    this.animateTo($(sorted[i]), this.getClonedOffset($(base[i])));
                }
            }
            this.items = sorted;          
        },

        animateTo: function(item, destination){

            var itemOffset = this.getClonedOffset(item);
            var style = this.getElementStyle(item);
            var clone = item.clone();
            clone.css(style);
            
            item.css("opacity",0);

            clone
            .css('position', 'absolute')
            .css('left', itemOffset.left)
            .css('top', itemOffset.top);
            $("body").append(clone);

            clone.animate({
                left: destination.left,
                top: destination.top,
            }, 2000, function() {
                item
                .css("opacity",1);
                item.offset( {top: destination.top+parseFloat(item.css("marginTop")), left: destination.left+parseFloat(item.css("marginLeft"))});

                clone.remove();
            });
        },

        getElementStyle: function(el){
            var dom = el.get(0);
            var style;
            var returns = {};
            if(window.getComputedStyle){
                var camelize = function(a,b){
                    return b.toUpperCase();
                }
                style = window.getComputedStyle(dom, null);
                for(var i=0;i<style.length;i++){
                    var prop = style[i];
                    var camel = prop.replace(/\-([a-z])/g, camelize);
                    var val = style.getPropertyValue(prop);
                    returns[camel] = val;
                }
                return returns;
            }
            if(dom.currentStyle){
                style = dom.currentStyle;
                for(var prop in style){
                    returns[prop] = style[prop];
                }
                return returns;
            }
            return el.css();            
        },

        getClonedOffset: function(el){
            return {"left": el.offset().left - parseFloat(el.css("marginLeft")), "top": el.offset().top - parseFloat(el.css("marginTop"))};
        }
    };

    // Attach the plugin to the jQuery namespace, no need to modify this
    $.fn[pluginName] = function(methodOrOptions) {
        var _arguments = arguments;
        return this.each(function() {
            var plugin = $.data(this, 'plugin_' + pluginName);
            // If the plugin hasn't been attached yet, create a new one
            if (!plugin) {
                plugin = new Plugin(this, methodOrOptions);
                $.data(this, 'plugin_' + pluginName, plugin);
                return plugin;
                // If the plugin is there, look for a method in publicMethods
            } else {
                if (!plugin.api) {
                    $.error('You need to define a public API for the jQuery plugin "' + pluginName + '"');
                } else if (plugin.api[methodOrOptions]) {
                    return plugin.api[methodOrOptions].apply(plugin, Array.prototype.slice.call(_arguments, 1));
                    // Else it's an error
                } else {
                    $.error('The method "' + methodOrOptions + '" does not exist in the public API for the jQuery plugin "' + pluginName + '"');
                }
            }
        });
    };

}(jQuery, window));
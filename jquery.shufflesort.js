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
            this.isAnimating = false;

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
             if (parseInt(a) > parseInt(b)) {
              return (sortorder === "ASC")? 1 : -1;
             } else if (parseInt(a) < parseInt(b)) {
              return (sortorder === "ASC")? -1 : 1;
             } else {
              return 0;
             }
            });

            this.animate(this.items, sorteditems);
        },

        animate: function(base, sorted){

            if(this.isAnimating){
                this.clearanimation();
            }


            for (var i = 0, len = sorted.length; i < len; i++) {

                if(sorted[i] !== base[i]){
                    //this.animateTo($(sorted[i]), $(base[i]).offset());

                    var item = $(sorted[i]);

                    var curPosition = this.getClonedOffset($(base[i]));
                    var newPosition = this.getClonedOffset($(sorted[i]));
                    var deltaPosition = {
                        left: 0,
                        top: 0
                    }

                    if(curPosition.left < newPosition.left){
                        deltaPosition.left = curPosition.left - newPosition.left
                    }else{
                        deltaPosition.left = curPosition.left - newPosition.left
                    }

                    if(curPosition.top < newPosition.top){
                        deltaPosition.top =  curPosition.top - newPosition.top
                    }else{
                        deltaPosition.top =  curPosition.top - newPosition.top
                    }                    

                    this.animateTo($(sorted[i]), deltaPosition, $(base[i]));
                    this.isAnimating = true;
                }
            }
            this.items = sorted;

            var self = this;
            this.timer = setTimeout(function(){
                console.log("trying to reorder");
                self.reposition();
            },1100);
        },

        clearanimation: function(){
            if(typeof this.timer != "undefined"){
                clearTimeout(this.timer);
            }

            for (var i = 0, len = this.items.length; i < len; i++) {

                var item = $(this.items[i]);

                if( item.is(':animated') ){
                    item.stop(true, true);
                }
            }

            this.reposition();
        },

        reposition: function(){
            for (var i = 0, len = this.items.length; i < len; i++) {
                var item = $(this.items[i]);
                this.$el.append(item);
                
                item.css({
                    'top': 'auto',
                    'left': 'auto'
                })
            }            
        },

        animateTo: function(item, destination, order){
            var itemOffset = this.getClonedOffset(item);

            item
            .css("position", "relative");     

            var self = this;
            item.animate({
                left: destination.left,
                top: destination.top
            }, 1000, function() {
                
            });
        },

        getClonedOffset: function(el){
            //return {"left": el.offset().left - parseFloat(el.css("marginLeft")), "top": el.offset().top - parseFloat(el.css("marginTop"))};
            return {"left": el.position().left, "top": el.position().top};
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
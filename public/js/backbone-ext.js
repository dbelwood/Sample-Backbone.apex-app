var BackboneExt = BackboneExt || function() {
    var backbonePrototypes = [
        Backbone.Collection.prototype, 
        Backbone.Model.prototype, 
        Backbone.View.prototype,
        Backbone.Router.prototype
    ];

    var extensions = {

        dispatcher : _.extend({}, Backbone.Events,{cid : 'dispatcher'}),
        wrappedEvents : function(localEvents) {
            var local = localEvents || _.extend({},Backbone.Events);
            //note that 'this' is the Backbone implementation
            return {            
                dispatcher : BackboneExt.dispatcher,            
                trigger : function() {                                      
                    var args = _.toArray(arguments);                
                    // this._callbacks is an internal collection 
                    // currently backbone could 
                    if( this._callbacks ) {                             
                        local.trigger.apply(this,args);
                    }               
                    BackboneExt.dispatcher.trigger.apply(BackboneExt.dispatcher,args);
                    return this;            
                }

            };

        },
        extendBackbone : function() {
            var self = this;
            if( self.isExtended ) {
                return;
            }
            _.each(backbonePrototypes,function(proto) {
                _.extend(proto, self.autoBinder, self.wrappedEvents());
            });
        }
    };
    return extensions;
}();

BackboneExt.extendBackbone();
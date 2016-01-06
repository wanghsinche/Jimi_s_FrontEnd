define(['backbone','zepto'],function(Backbone,$){
	var testModel=Backbone.Model.extend({
		id:Date.now()
	});
	testModel.prototype.sync = function() { return null; };
	testModel.prototype.fetch = function() { return null; };
	testModel.prototype.save = function() { return null; };

	var testCollect=Backbone.Collection.extend({
		model:testModel,
		comparator:'id',
	});

	var testModelView=Backbone.View.extend({
		tagName:'li',
		initialize:function () {
			this.listenTo(this.model,'change',this.render);

		},
		render:function(){
			this.$el.html(this.model.id);
			return this;
		}
	});	

	var testCollectView=Backbone.View.extend({
		el:$('#container'),
		events:{
			'click #add':'addOne'
		},
		initialize:function(){
			this.render();
			this.listenTo(this.collection,'add',this.addOneTocol);
			this.listenTo(this.collection,'reset',this.addAllTocol);			
		},
		render:function(){
			this.$el.html('<ul></ul><button id="add">add</button>');
			return this;
		},
		addOneTocol:function(testModel){
			var view=new testModelView({model:testModel});
			this.$('ul').append(view.render().el);
		},
		addAllTocol:function(){
			this.collection.each(this.addOneTocol);
		},		
		addOne:function(){
			this.collection.create({id:Date.now()});
		},
	});
	var dataCol=new testCollect();
	var app=new testCollectView({collection:dataCol});
	dataCol.reset([{id:'1'},{id:'0'},{id:'2'},{id:'3'},]);
});

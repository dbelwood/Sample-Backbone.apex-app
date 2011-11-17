class Account extends Backbone.Model
	urlRoot: 'accounts'

class Accounts extends Backbone.Collection
	model: Account
	url: 'accounts'
	parse: (resp, xhr) ->
		_.each(resp, (result) ->
			delete result.attributes
		, @)
		resp

class AccountsRow extends Backbone.View
	tagName: "li"
	template: "#account_row"
	initialize: ->
		@app = @options.app

	events:
		"click div.account" : "viewDetails"
		
	render: =>
		try 
			@el = $(@el)
			compiledTemplate = Handlebars.compile($(@template).html())
			@el.append(compiledTemplate(@model.attributes))
			@delegateEvents()
			@el
		catch error
			console.log error
	
	viewDetails: =>
		@app.appView.selectedAccount.set @model.attributes


class AccountsList extends Backbone.View
	initialize: ->
		@collection.bind("reset", @render)
		@app = @options.app

	render: =>
		row = null
		@collection.each((account) ->
			row = new AccountsRow({model: account, app: @app})
			@el.append row.render()
		, @)

class AccountView extends Backbone.View
	template: "#account_template"
	initialize: ->
		@model.bind("change", @render)
	
	events:
		"#view_contacts": "viewContacts"

	render: =>
		try 
			@el = $("#account")
			@el.empty()
			compiledTemplate = Handlebars.compile($(@template).html())
			@el.append compiledTemplate(@model.attributes)
		catch error
			console.log error

	viewContacts: ->

class NewAccountView extends Backbone.View
	tagName: "div"
	template: "#new_account_template"
	initialize: ->
		@dialog = $(@el).dialog(
			autoOpen: false,
			modal: true,
			buttons: [
				{
					text: "OK",
					class: "ok",
					click: =>
						@dialog.dialog("close")
				},
				{
					text: "Cancel",
					click: =>
						@dialog.dialog("close")
				}
			]				
		)
		@model = new Account()

	events:
		"click .ok": "create"

	render: ->
		compiledTemplate = Handlebars.compile($(@template).html())
		$(@el).append compiledTemplate(@model.attributes)
		Backbone.ModelBinding.bind @

	open: ->
		@render()
		@dialog.dialog("open")
		@el = $(@el).parent()
		@delegateEvents()

	create: ->
		console.log "Create Account."
		console.log JSON.stringify(@model.toJSON())
		@model.save()

# Account Search assets
class @Industry extends Backbone.Model

class IndustryCollection extends Backbone.Collection
	model: Industry

class IndustryRow extends Backbone.View
	tagName: "tr"
	template: "#industry_row"
	render: =>
		try
			compiledTemplate = Handlebars.compile($(@template).html())
			$(@el).append compiledTemplate(@model.attributes)
			$(@el)
		catch error
			console.log error

class IndustryList extends Backbone.View
	template: "industry_rows"
	initialize: ->

	render: =>
		console.log "Rendering Industry list."
		try
			@collection.each((row) ->
				@el.append (new IndustryRow({model: row})).render()
			,@)
		catch error
			console.log error

class @AccountSearchParameters extends Backbone.Model
	urlRoot: 'search_parameters'
	defaults:
		industries: new IndustryCollection([new Industry()])
	
	parse: (obj) ->
		@get("industries").refresh(obj.industries)

class AccountSearchView extends Backbone.View
	initialize: ->
		@model = new AccountSearchParameters()
		@industry_view = new IndustryList({el: $("#industry_rows"), collection: @model.get("industries")})

	events:
		"click .search": "search"

	render: =>
		# Render industry list
		@industry_view.render()

		Backbone.ModelBinding.bind @

	search: ->

class AccountResults extends Backbone.View
	template: ""
	initialize: ->
		@collection.bind("reset", @render)

	render: =>

class AccountsView extends Backbone.View
	initialize: ->
		@app = @options.app
		@accounts = new Accounts()
		@accountsList = new AccountsList {el: $("#accounts"), collection: @accounts, app: @app}
		@accounts.fetch()
		@selectedAccount = new Account()
		@accountView = new AccountView {model: @selectedAccount}

	events:
		"click #newAccount": "newAccount"
	
	newAccount: ->
		(new NewAccountView()).open()

class AppView extends Backbone.View
	initialize: ->
		@accountsView = new AccountsView({el:$("#home")})
		@searchView = new AccountSearchView({el:$("#search")})
		BackboneExt.dispatcher.bind("tabs:accounts:view", @viewAccountTab)
		BackboneExt.dispatcher.bind("tabs:search:view", @viewSearchTab)
	
	render: =>
		# Apply tab styling
		$("#tabs").addClass("ui-tabs ui-widget ui-widget-content ui-corner-all")
		$("#tabs ul").addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all")
		#$("#tabs").tabs()

	viewAccountsTab: =>
		$("#search").removeClass("ui-tabs-selected").removeClass("ui-state-active")
		$("#accounts").addClass("ui-tabs-selected").addClass("ui-state-active")
		@accountsView.render()

	viewSearchTab: =>
		$("#accounts").removeClass("ui-tabs-selected").removeClass("ui-state-active")
		$("#search").addClass("ui-tabs-selected").addClass("ui-state-active")
		@searchView.render()


class AppRouter extends Backbone.Router
	routes:
		"home": "view"
		"search": "search"
		"*action": "view"

	initialize: (options) ->
		@app = options.app

	view: ->
		BackboneExt.dispatcher.trigger("tabs:accounts:view")

	search: ->
		BackboneExt.dispatcher.trigger("tabs:search:view")

	
class @App
	constructor: (@session_id) ->
		Backbone.Salesforce.sessionId = @session_id
		@appView = new AppView()
		@appRouter = new AppRouter({app: @})
		@appView.render()
		Backbone.history.start()
		
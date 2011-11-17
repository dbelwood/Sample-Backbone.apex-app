(function() {
  var Account, AccountResults, AccountSearchView, AccountView, Accounts, AccountsList, AccountsRow, AccountsView, AppRouter, AppView, IndustryCollection, IndustryList, IndustryRow, NewAccountView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Account = (function() {
    __extends(Account, Backbone.Model);
    function Account() {
      Account.__super__.constructor.apply(this, arguments);
    }
    Account.prototype.urlRoot = 'accounts';
    return Account;
  })();
  Accounts = (function() {
    __extends(Accounts, Backbone.Collection);
    function Accounts() {
      Accounts.__super__.constructor.apply(this, arguments);
    }
    Accounts.prototype.model = Account;
    Accounts.prototype.url = 'accounts';
    Accounts.prototype.parse = function(resp, xhr) {
      _.each(resp, function(result) {
        return delete result.attributes;
      }, this);
      return resp;
    };
    return Accounts;
  })();
  AccountsRow = (function() {
    __extends(AccountsRow, Backbone.View);
    function AccountsRow() {
      this.viewDetails = __bind(this.viewDetails, this);
      this.render = __bind(this.render, this);
      AccountsRow.__super__.constructor.apply(this, arguments);
    }
    AccountsRow.prototype.tagName = "li";
    AccountsRow.prototype.template = "#account_row";
    AccountsRow.prototype.initialize = function() {
      return this.app = this.options.app;
    };
    AccountsRow.prototype.events = {
      "click div.account": "viewDetails"
    };
    AccountsRow.prototype.render = function() {
      var compiledTemplate;
      try {
        this.el = $(this.el);
        compiledTemplate = Handlebars.compile($(this.template).html());
        this.el.append(compiledTemplate(this.model.attributes));
        this.delegateEvents();
        return this.el;
      } catch (error) {
        return console.log(error);
      }
    };
    AccountsRow.prototype.viewDetails = function() {
      return this.app.appView.selectedAccount.set(this.model.attributes);
    };
    return AccountsRow;
  })();
  AccountsList = (function() {
    __extends(AccountsList, Backbone.View);
    function AccountsList() {
      this.render = __bind(this.render, this);
      AccountsList.__super__.constructor.apply(this, arguments);
    }
    AccountsList.prototype.initialize = function() {
      this.collection.bind("reset", this.render);
      return this.app = this.options.app;
    };
    AccountsList.prototype.render = function() {
      var row;
      row = null;
      return this.collection.each(function(account) {
        row = new AccountsRow({
          model: account,
          app: this.app
        });
        return this.el.append(row.render());
      }, this);
    };
    return AccountsList;
  })();
  AccountView = (function() {
    __extends(AccountView, Backbone.View);
    function AccountView() {
      this.render = __bind(this.render, this);
      AccountView.__super__.constructor.apply(this, arguments);
    }
    AccountView.prototype.template = "#account_template";
    AccountView.prototype.initialize = function() {
      return this.model.bind("change", this.render);
    };
    AccountView.prototype.events = {
      "#view_contacts": "viewContacts"
    };
    AccountView.prototype.render = function() {
      var compiledTemplate;
      try {
        this.el = $("#account");
        this.el.empty();
        compiledTemplate = Handlebars.compile($(this.template).html());
        return this.el.append(compiledTemplate(this.model.attributes));
      } catch (error) {
        return console.log(error);
      }
    };
    AccountView.prototype.viewContacts = function() {};
    return AccountView;
  })();
  NewAccountView = (function() {
    __extends(NewAccountView, Backbone.View);
    function NewAccountView() {
      NewAccountView.__super__.constructor.apply(this, arguments);
    }
    NewAccountView.prototype.tagName = "div";
    NewAccountView.prototype.template = "#new_account_template";
    NewAccountView.prototype.initialize = function() {
      this.dialog = $(this.el).dialog({
        autoOpen: false,
        modal: true,
        buttons: [
          {
            text: "OK",
            "class": "ok",
            click: __bind(function() {
              return this.dialog.dialog("close");
            }, this)
          }, {
            text: "Cancel",
            click: __bind(function() {
              return this.dialog.dialog("close");
            }, this)
          }
        ]
      });
      return this.model = new Account();
    };
    NewAccountView.prototype.events = {
      "click .ok": "create"
    };
    NewAccountView.prototype.render = function() {
      var compiledTemplate;
      compiledTemplate = Handlebars.compile($(this.template).html());
      $(this.el).append(compiledTemplate(this.model.attributes));
      return Backbone.ModelBinding.bind(this);
    };
    NewAccountView.prototype.open = function() {
      this.render();
      this.dialog.dialog("open");
      this.el = $(this.el).parent();
      return this.delegateEvents();
    };
    NewAccountView.prototype.create = function() {
      console.log("Create Account.");
      console.log(JSON.stringify(this.model.toJSON()));
      return this.model.save();
    };
    return NewAccountView;
  })();
  this.Industry = (function() {
    __extends(Industry, Backbone.Model);
    function Industry() {
      Industry.__super__.constructor.apply(this, arguments);
    }
    return Industry;
  })();
  IndustryCollection = (function() {
    __extends(IndustryCollection, Backbone.Collection);
    function IndustryCollection() {
      IndustryCollection.__super__.constructor.apply(this, arguments);
    }
    IndustryCollection.prototype.model = Industry;
    return IndustryCollection;
  })();
  IndustryRow = (function() {
    __extends(IndustryRow, Backbone.View);
    function IndustryRow() {
      this.render = __bind(this.render, this);
      IndustryRow.__super__.constructor.apply(this, arguments);
    }
    IndustryRow.prototype.tagName = "tr";
    IndustryRow.prototype.template = "#industry_row";
    IndustryRow.prototype.render = function() {
      var compiledTemplate;
      try {
        compiledTemplate = Handlebars.compile($(this.template).html());
        $(this.el).append(compiledTemplate(this.model.attributes));
        return $(this.el);
      } catch (error) {
        return console.log(error);
      }
    };
    return IndustryRow;
  })();
  IndustryList = (function() {
    __extends(IndustryList, Backbone.View);
    function IndustryList() {
      this.render = __bind(this.render, this);
      IndustryList.__super__.constructor.apply(this, arguments);
    }
    IndustryList.prototype.template = "industry_rows";
    IndustryList.prototype.initialize = function() {};
    IndustryList.prototype.render = function() {
      console.log("Rendering Industry list.");
      try {
        return this.collection.each(function(row) {
          return this.el.append((new IndustryRow({
            model: row
          })).render());
        }, this);
      } catch (error) {
        return console.log(error);
      }
    };
    return IndustryList;
  })();
  this.AccountSearchParameters = (function() {
    __extends(AccountSearchParameters, Backbone.Model);
    function AccountSearchParameters() {
      AccountSearchParameters.__super__.constructor.apply(this, arguments);
    }
    AccountSearchParameters.prototype.urlRoot = 'search_parameters';
    AccountSearchParameters.prototype.defaults = {
      industries: new IndustryCollection([new Industry()])
    };
    AccountSearchParameters.prototype.parse = function(obj) {
      return this.get("industries").refresh(obj.industries);
    };
    return AccountSearchParameters;
  })();
  AccountSearchView = (function() {
    __extends(AccountSearchView, Backbone.View);
    function AccountSearchView() {
      this.render = __bind(this.render, this);
      AccountSearchView.__super__.constructor.apply(this, arguments);
    }
    AccountSearchView.prototype.initialize = function() {
      this.model = new AccountSearchParameters();
      return this.industry_view = new IndustryList({
        el: $("#industry_rows"),
        collection: this.model.get("industries")
      });
    };
    AccountSearchView.prototype.events = {
      "click .search": "search"
    };
    AccountSearchView.prototype.render = function() {
      this.industry_view.render();
      return Backbone.ModelBinding.bind(this);
    };
    AccountSearchView.prototype.search = function() {};
    return AccountSearchView;
  })();
  AccountResults = (function() {
    __extends(AccountResults, Backbone.View);
    function AccountResults() {
      this.render = __bind(this.render, this);
      AccountResults.__super__.constructor.apply(this, arguments);
    }
    AccountResults.prototype.template = "";
    AccountResults.prototype.initialize = function() {
      return this.collection.bind("reset", this.render);
    };
    AccountResults.prototype.render = function() {};
    return AccountResults;
  })();
  AccountsView = (function() {
    __extends(AccountsView, Backbone.View);
    function AccountsView() {
      AccountsView.__super__.constructor.apply(this, arguments);
    }
    AccountsView.prototype.initialize = function() {
      this.app = this.options.app;
      this.accounts = new Accounts();
      this.accountsList = new AccountsList({
        el: $("#accounts"),
        collection: this.accounts,
        app: this.app
      });
      this.accounts.fetch();
      this.selectedAccount = new Account();
      return this.accountView = new AccountView({
        model: this.selectedAccount
      });
    };
    AccountsView.prototype.events = {
      "click #newAccount": "newAccount"
    };
    AccountsView.prototype.newAccount = function() {
      return (new NewAccountView()).open();
    };
    return AccountsView;
  })();
  AppView = (function() {
    __extends(AppView, Backbone.View);
    function AppView() {
      this.viewSearchTab = __bind(this.viewSearchTab, this);
      this.viewAccountsTab = __bind(this.viewAccountsTab, this);
      this.render = __bind(this.render, this);
      AppView.__super__.constructor.apply(this, arguments);
    }
    AppView.prototype.initialize = function() {
      this.accountsView = new AccountsView({
        el: $("#home")
      });
      this.searchView = new AccountSearchView({
        el: $("#search")
      });
      BackboneExt.dispatcher.bind("tabs:accounts:view", this.viewAccountTab);
      return BackboneExt.dispatcher.bind("tabs:search:view", this.viewSearchTab);
    };
    AppView.prototype.render = function() {
      $("#tabs").addClass("ui-tabs ui-widget ui-widget-content ui-corner-all");
      return $("#tabs ul").addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all");
    };
    AppView.prototype.viewAccountsTab = function() {
      $("#search").removeClass("ui-tabs-selected").removeClass("ui-state-active");
      $("#accounts").addClass("ui-tabs-selected").addClass("ui-state-active");
      return this.accountsView.render();
    };
    AppView.prototype.viewSearchTab = function() {
      $("#accounts").removeClass("ui-tabs-selected").removeClass("ui-state-active");
      $("#search").addClass("ui-tabs-selected").addClass("ui-state-active");
      return this.searchView.render();
    };
    return AppView;
  })();
  AppRouter = (function() {
    __extends(AppRouter, Backbone.Router);
    function AppRouter() {
      AppRouter.__super__.constructor.apply(this, arguments);
    }
    AppRouter.prototype.routes = {
      "home": "view",
      "search": "search",
      "*action": "view"
    };
    AppRouter.prototype.initialize = function(options) {
      return this.app = options.app;
    };
    AppRouter.prototype.view = function() {
      return BackboneExt.dispatcher.trigger("tabs:accounts:view");
    };
    AppRouter.prototype.search = function() {
      return BackboneExt.dispatcher.trigger("tabs:search:view");
    };
    return AppRouter;
  })();
  this.App = (function() {
    function App(session_id) {
      this.session_id = session_id;
      Backbone.Salesforce.sessionId = this.session_id;
      this.appView = new AppView();
      this.appRouter = new AppRouter({
        app: this
      });
      this.appView.render();
      Backbone.history.start();
    }
    return App;
  })();
}).call(this);

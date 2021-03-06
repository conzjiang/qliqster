Qliqster.Views.SignInView = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = false;
  },

  className: "content",

  template: JST['nav/signIn'],

  events: {
    'click .toggle': 'toggleForm',
    'click .facebook-login': 'fbLogin',
    'click .demo-login': 'signInDemo',
    'submit form': 'signInUser'
  },

  toggleForm: function (event) {
    event.stopPropagation();
    this.newUser = !this.newUser;
    this.render();
  },

  fbLogin: function (e) {
    $(e.currentTarget).html("Signing in...");
  },

  signInDemo: function (e) {
    $(e.currentTarget).prop("disabled", true).html("Signing in...");

    Qliqster.currentUser.demoSignIn({
      success: this.reloadPage.bind(this)
    });
  },

  signInUser: function (event) {
    event.preventDefault();
    var $form = $(event.currentTarget);

    this.disableButton();

    Qliqster.currentUser.signIn({
      url: $form.attr("action"),
      data: $form.serializeJSON(),
      success: this.reloadPage.bind(this),
      error: function (data) {
        this.enableButton();
        this.renderErrors(data.responseJSON);
        this.$("input.first").select();
      }.bind(this)
    });
  },

  reloadPage: function () {
    if (window.location.hash) {
      window.location.reload();
    }
  },

  disableButton: function () {
    if (this.newUser) {
      this.setButton("Signing up...", true);
    } else {
      this.setButton("Signing in...", true);
    }
  },

  enableButton: function () {
    if (this.newUser) {
      this.setButton("Sign up", false);
    } else {
      this.setButton("Sign in", false);
    }
  },

  setButton: function (text, disabled) {
    this.$(".login").prop("disabled", disabled).html(text);
  },

  renderErrors: function (errors) {
    this.$('.errors').empty();

    _(errors || ["Something went wrong."]).each(function (error) {
      this.$('.errors').append('<li>' + error + '</li>');
    }.bind(this));
  },

  render: function () {
    var content = this.template({
      newUser: this.newUser,
      signedIn: Qliqster.currentUser.signedIn()
    });

    this.$el.html(content);
    this.$("input.first").focus();

    return this;
  }
});

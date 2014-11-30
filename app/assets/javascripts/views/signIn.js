Clickster.Views.SignInView = Backbone.View.extend({
  initialize: function (options) {
    this.newUser = false;
  },

  className: "content",

  template: JST['signIn'],

  events: {
    'click a': 'toggleForm',
    'submit form': 'signInUser'
  },

  toggleForm: function () {
    var $link = $(event.target);
    
    if (!$link.hasClass('selected')) {
      this.newUser = !this.newUser;
      this.render();
    }
  },

  signInUser: function () {
    event.preventDefault();
    var $form = $(event.target);
    var params = $form.serializeJSON();
    var that = this;

    $.ajax({
      url: $form.attr('action'),
      type: 'post',
      data: params,
      dataType: 'json',
      success: function () {
        Clickster.currentUser.fetch();
        Backbone.history.navigate('', { trigger: true });
      },
      error: function (data) {
        that.$('.errors').empty();

        _(data.responseJSON).each(function (error) {
          that.$('.errors').append('<li>' + error + '</li>');
        });

        that.$("input.first").select();
      }
    })
  },

  render: function () {
    var signedIn = !!Clickster.currentUser.id;
    var that = this;
    var $linkToSelect;

    var content = this.template({
      newUser: this.newUser,
      signedIn: signedIn
    });

    this.$el.html(content);

    if (this.newUser) {
      $linkToSelect = this.$('a.sign-up-link');
    } else {
      $linkToSelect = this.$('a.sign-in-link');
    }

    $linkToSelect.addClass("selected");
    this.$("input.first").focus();

    return this;
  }
});

Clickster.Views.TvCardView = Backbone.View.extend({
  initialize: function (options) {
    this.tv = options.tv;
  },

  tagName: "li",

  className: "group",

  template: JST["tv_shows/card"],

  events: {
    "touchmove .title": "toggleBlurb",
    "click .title": "toggleBlurb"
  },

  toggleBlurb: function (e) {
    var $content, isClosed;

    e.preventDefault();
    $content = this.$(".content");
    isClosed = parseInt($content.css("top"));

    if (isClosed && !this.closing) {
      $content.addClass("open");
    } else {
      $content.removeClass("open");
      this.closing = true;

      $content.one("transitionend", function () {
        this.closing = false;
      }.bind(this));
    }
  },

  render: function () {
    var content = this.template({ tv: this.tv });
    this.$el.html(content);

    if (this.tv.get("image_url")) {
      this.$(".image-block").css({
        "background-image": "url(" + this.tv.escape("image_url") + ")"
      });
    }

    return this;
  }
});
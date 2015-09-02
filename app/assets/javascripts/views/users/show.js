Clickster.Views.UserShowView = Backbone.View.extend({
  initialize: function (options) {
    this.user = options.user;
    this.selected = "Watchlists";

    this.listenTo(this.user, "sync", this.render);
    this.listenTo(this.user, "error", this.error);
  },

  className: "user-show max",

  template: JST["users/show"],
  watchlistsTemplate: JST["users/_watchlists"],
  followersTemplate: JST["users/_followers"],

  events: {
    "click .follow": "toggleFollow",
    "change input[type=radio]": "displayList"
  },

  toggleFollow: function () {
    var message;

    if (this.user.get("is_following")) {
      message = "Unfollowing...";
    } else {
      message = "Following...";
    }

    this.$(".follow").html(message).prop("disabled", true);

    this.user.follow({
      success: function () {
        setTimeout(function () {
          this.$(".follow").prop("disabled", false);
          this.setFollowStatus();
        }.bind(this), 1000);
      }.bind(this)
    });
  },

  displayList: function (e) {
    this.selected = $(e.currentTarget).val();
    this.renderSelected();
  },

  render: function () {
    var content = this.template({
      user: this.user
    });

    this.$el.html(content);
    this.renderImageTiles();
    this.setFollowStatus();
    this.renderSelected();

    return this;
  },

  error: function () {
    this.$el.removeClass("max").html(JST["404"]());
  },

  renderImageTiles: function () {
    var images = _.shuffle(this.user.showImages());
    var imageTileColors = Utils.imageTileColors;
    var rand = Utils.random;

    this.$(".image-tiles > li").each(function () {
      var imageIndex = rand(images.length);
      var colorIndex = rand(imageTileColors.length);

      $(this).find(".cover").css({ background: imageTileColors[colorIndex] });

      if (images.length && images[imageIndex]) {
        $(this).css({ "background-image": "url(" + images[imageIndex] + ")" });
      }
    });
  },

  setFollowStatus: function () {
    if (this.user.get("is_following")) {
      this.$(".follow").addClass("is-following").html("Following");
    } else if (this.user.get("is_current_user")) {
      this.$(".follow").addClass("me");
    } else {
      this.$(".follow").removeClass("is-following").html("Follow");
    }
  },

  renderSelected: function () {
    this["render" + this.selected]();
  },

  renderWatchlists: function () {
    var content = this.watchlistsTemplate({
      user: this.user,
      allStatuses: Clickster.LIST_STATUSES.concat(["Favorites"]),
      tvCard: JST["tv_shows/miniCard"]
    });

    this.$(".lists").html(content);
    this.ellipsis();
  },

  renderFollowers: function () {
    var content = this.followersTemplate({
      follows: {
        Following: this.user.idols(),
        Followers: this.user.followers()
      },
      userCard: JST["users/_user"]
    });

    this.$(".lists").html(content);
  }
});

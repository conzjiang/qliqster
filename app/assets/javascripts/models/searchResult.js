Qliqster.Models.SearchResult = Backbone.Model.extend({
  parse: function (resp) {
    this.tvResults().set(resp.tv_results);
    this.userResults().set(resp.user_results);

    delete resp.tv_results;
    delete resp.user_results;

    return this;
  },

  tvResults: function () {
    if (!this._tvResults) {
      this._tvResults = new Qliqster.Collections.TvShows();
    }

    return this._tvResults;
  },

  userResults: function () {
    if (!this._userResults) {
      this._userResults = new Qliqster.Collections.Users();
    }

    return this._userResults;
  },

  runQuery: function () {
    this.fetch({
      data: this.get("params"),
      success: function () {
        this.set({ showUsers: false });
      }.bind(this)
    });

    return this;
  },

  sortBy: function (comparator) {
    this.tvResults().comparator = comparator;
    return this.tvResults().sort();
  },

  textSearch: function (options) {
    var callback = function () {
      this.set({ showUsers: true });
    }.bind(this);

    this.fetch({
      url: this.url() + "/ids",
      data: {
        tv_ids: options.tvIds,
        user_ids: options.userIds
      },
      success: callback,
      error: callback
    });

    return this;
  }
});

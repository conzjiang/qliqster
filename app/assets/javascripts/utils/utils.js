(function (root) {
  var Utils = root.Utils = root.Utils || {};


  Utils.success = function (options) {
    var success;

    if (options && options.success) {
      success = options.success;
      delete options.success;
    }

    return success;
  };

  Utils.adjustImage = function (imageUrl, $image) {
    var img = new Image();

    img.onload = function () {
      if (this.width > this.height) {
        $image.addClass("big-width");
      } else {
        $image.addClass("big-height");
      }
    };

    img.src = imageUrl;
  };

  Utils.capitalize = function (string) {
    var firstLetter = string.charAt(0).toUpperCase();
    return firstLetter + string.slice(1);
  };

  Utils.dehyphenate = function (hyphenated) {
    var exceptions = Qliqster.genreExceptions;
    if (_(exceptions).has(hyphenated)) return exceptions[hyphenated];
    return Utils.capitalize(hyphenated.replace(/-/g, " "));
  };

  Utils.isGenre = function (genre) {
    return _.contains(_.keys(Qliqster.GENRES), genre);
  };

  Utils.matchGenre = function (genre) {
    var dbGenre;

    for (dbGenre in Qliqster.GENRES) {
      if (dbGenre.match(genre)) {
        return dbGenre;
      }
    }
  };

  Utils.hyphenate = function (string) {
    return string.toLowerCase().replace(/[\s\/]/g, "-");
  };

  Utils.imageDims = function (url) {
    var width, height;

    $("<img>").attr("src", url).load(function () {
      width = this.width;
      height = this.height;
    });

    return { width: width, height: height };
  };

  var imageTileColors = Utils.imageTileColors = [];
  var hue = 30;

  while (imageTileColors.length < 6) {
    var array = [hue, hue, hue, 0.7];
    imageTileColors.push("rgba(" + array.join(", ") + ")");
    hue += 30;
  }

  var NOUNS = {
    person: "people"
  };

  Utils.pluralize = function (num, word) {
    if (num === 1) {
      return num + " " + word;
    }

    if (NOUNS[word]) {
      return num + " " + NOUNS[word];
    } else {
      return num + " " + word + "s";
    }
  };

  var VERBS = {
    is: "are",
    has: "have",
    stopped: "stopped"
  };

  Utils.pluralizeVerb = function (num, verbPhrase) {
    var phrase = verbPhrase.split(" ");

    if (num !== 1) {
      if (VERBS[phrase[0]]) {
        phrase[0] = VERBS[phrase[0]];
      } else {
        phrase[0] = phrase[0].slice(0, -1);
      }
    }

    return phrase.join(" ");
  };

  Utils.random = function (max) {
    return Math.floor(Math.random() * max);
  };

  Utils.renderErrors = function (options) {
    var view = options.view;
    var $errorDisplay = view.$(".errors");
    var errors = options.errors;
    var fieldPrepend = options.fieldPrepend || "#";

    $errorDisplay.empty();

    for (var attr in errors) {
      var $li = $("<li>");
      $li.html(Utils.unSnakeCase(attr) + " " + errors[attr][0]);
      $errorDisplay.append($li);

      view.$(fieldPrepend + attr).parent().addClass("error");
    }
  };

  Utils.strip = function (string) {
    var str = stripPunctuation(string).toLowerCase().replace(/&/g, "and");
    return Utils.convertToNums(str).replace(/\s/g, "");
  };

  Utils.stripAll = function (items) {
    _(items).each(function (item) {
      item.pattern = Utils.strip(item.pattern);
    });

    return items;
  };

  // converts lowercased snakecase to capitalized words
  Utils.unSnakeCase = function (string) {
    return Utils.capitalize(string.replace(/\_/g, ' '));
  };

  // helpers
  function stripPunctuation(string) {
    return string.replace(/[\.,!?:'"]/g, "").replace(/[\/\-]/g, " ").trim();
  };
})(this);

(function() {
  var EncodeFormView, Encoder, chmodSync, existsSync, platform, spawn,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  spawn = require("child_process").spawn;

  platform = require("os").platform;

  chmodSync = require("fs").chmodSync;

  Encoder = (function() {

    function Encoder(_arg) {
      this.source = _arg.source, this.bitrate = _arg.bitrate, this.target = _arg.target, this.log = _arg.log;
      this.target || (this.target = this.source.replace(/\.wav$/, ".mp3"));
      this.bitrate || (this.bitrate = 128);
      switch (platform()) {
        case "darwin":
          this.pathToBin = "vendor/bin/osx/shineenc";
          break;
        case "win32":
          this.pathToBin = "vendor/bin/win32/shineenc.exe";
      }
      chmodSync(this.pathToBin, 0755);
    }

    Encoder.prototype.process = function() {
      var _this = this;
      this.log("Starting encoding process..");
      this.child = spawn(this.pathToBin, ["-b", this.bitrate, this.source, this.target]);
      this.child.stdout.on("data", function(data) {
        return _this.log("" + data);
      });
      this.child.stderr.on("data", function(data) {
        return _this.log("ERROR: " + data);
      });
      return this.child.on("exit", function(code) {
        return _this.log("Encoding process exited with code: " + code);
      });
    };

    return Encoder;

  })();

  existsSync = require("fs").existsSync;

  EncodeFormView = (function(_super) {

    __extends(EncodeFormView, _super);

    function EncodeFormView() {
      EncodeFormView.__super__.constructor.apply(this, arguments);
    }

    EncodeFormView.prototype.tagName = "form";

    EncodeFormView.prototype.events = {
      "submit": "onSubmit"
    };

    EncodeFormView.prototype.initialize = function(_arg) {
      this.log = _arg.log;
    };

    EncodeFormView.prototype.render = function() {
      var _this = this;
      this.$el.html("Please wait while loading..");
      $.ajax("https://raw.github.com/toots/nw-shine-encoder/master/templates/form.html", {
        success: function(data) {
          return _this.$el.html(data);
        },
        error: function() {
          return _this.$el.html("Sorry, the unicorn is hungover..");
        }
      });
      return this;
    };

    EncodeFormView.prototype.onSubmit = function(e) {
      var data;
      e.preventDefault();
      data = {
        source: this.$("input.file").val(),
        bitrate: parseInt(this.$("input.bitrate").val()),
        log: this.log
      };
      if (!existsSync(data.source)) return this.log("Source file does not exist!");
      return (new Encoder(data)).process();
    };

    return EncodeFormView;

  })(Backbone.View);

  $(function() {
    var form, log, logsElem;
    logsElem = $("div.logs");
    log = function(data) {
      return logsElem.html("" + (logsElem.html()) + "<br>" + (data.replace(/\n/, "<br>")));
    };
    form = new EncodeFormView({
      log: log
    });
    form.render().$el.appendTo($("div.form"));
    return log("All is good dude, I just loaded all my stuff!");
  });

}).call(this);

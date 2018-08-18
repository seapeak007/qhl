(function(b, f, a) {
	var d = b(f), i = b(document), e = 1, c = false;
	var g = function(j) {
		this.settings = b.extend({}, g.defaults, j);
		this.init();
	};
	g.prototype = {
		init : function() {
			this.create();
			if (this.settings.lock) {
				this.lock();
			}
			if (!isNaN(this.settings.time) && this.settings.time != null) {
				this.time();
			}
		},
		create : function() {
			var j = (this.settings.title == null) ? ""
					: '<div class="rDialog-header-' + this.settings.title
							+ '"></div>';
			var k = '<div class="rDialog-wrap">' + j
					+ '<div class="rDialog-content">' + this.settings.content
					+ '</div><div class="rDialog-footer"></div></div>';
			this.dialog = b("<div>").addClass("rDialog").css({
				zIndex : this.settings.zIndex + (e++)
			}).html(k).prependTo("body");
			if (b.isFunction(this.settings.ok)) {
				this.ok();
			}
			if (b.isFunction(this.settings.cancel)) {
				this.cancel();
			}
			this.size();
			this.position();
		},
		ok : function() {
			var k = this, j = this.dialog.find(".rDialog-footer");
			b("<a>", {
				href : "javascript:;",
				text : this.settings.okText
			}).on("click", function() {
				var l = k.settings.ok();
				if (l == a || l) {
					k.close();
				}
			}).addClass("rDialog-ok").prependTo(j);
		},
		cancel : function() {
			var k = this, j = this.dialog.find(".rDialog-footer");
			b("<a>", {
				href : "javascript:;",
				text : this.settings.cancelText
			}).on("click", function() {
				var l = k.settings.cancel();
				if (l == a || l) {
					k.close();
				}
			}).addClass("rDialog-cancel").appendTo(j);
		},
		size : function() {
			var k = this.dialog.find(".rDialog-content"), j = this.dialog
					.find(".rDialog-wrap");
			k.css({
				width : this.settings.width,
				height : this.settings.height
			});
		},
		position : function() {
			var m = this, k = d.width(), j = d.height(), l = 0;
			this.dialog.css({
				left : (k - m.dialog.width()) / 2,
				top : (j - m.dialog.height()) / 2 + l
			});
		},
		lock : function() {
			if (c) {
				return
			}
			this.lock = b("<div>").css({
				zIndex : this.settings.zIndex
			}).addClass("rDialog-mask");
			this.lock.appendTo("body");
			c = true;
		},
		unLock : function() {
			if (this.settings.lock) {
				if (c) {
					this.lock.remove();
					c = false;
				}
			}
		},
		close : function() {
			this.dialog.remove();
			this.unLock();
		},
		time : function() {
			var j = this;
			this.closeTimer = setTimeout(function() {
				j.close();
			}, this.settings.time);
		}
	};
	g.defaults = {
		content : "加载中...",
		title : "load",
		width : "auto",
		height : "auto",
		ok : null,
		cancel : null,
		okText : "确定",
		cancelText : "取消",
		time : null,
		lock : true,
		zIndex : 9999
	};
	var h = function(j) {
		return new g(j);
	};
	f.rDialog = b.rDialog = b.dialog = h;
})(window.jQuery || window.Zepto, window);
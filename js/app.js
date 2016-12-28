(function(w, $) {
	w.App = function(selector) {
		return document.getElementById(selector);
	};
	
	var ajaxOptions = {
		title: "操作",
		silent: false
	};
	
	$.extend(w.App, {
		path: function(url) {
			w.location.href = url;	
		},
		setUser: function(user) {
			var json = stringify(user);
			$.cookie('user', json, { expires: 1, path: '/' });
		},
		getUser: function() {
			var json = $.cookie('user');
			try {
				var user = JSON.parse(json);
				if(user) {
					return user;
				}
			} catch(e) { }
			this.path("login.html");
			return {};
		},
		clearUser: function() {
			$.removeCookie('user');
		},
		isArray: function(arr) {
			return Array.prototype.toString.apply(arr) == "[object Array]";
		},
		isFunction: function(obj) {
			return typeof obj === "function"; 
		},
		
		formatRole: function(role) {
			return ROLES_MAP[role] || "用户";
		},
		
		serialize: function(form) {
			var data = {};
			var unverified = [];
			$("input[name], textarea[name], select[name]", form).each(function() {
				var input = $(this);
				var type = this.type;
				var name = this.name;
				var require = input.attr("require");
				var title = input.prev().text();
				var value = $.trim(input.val());
				data[name] = value;
				
				if(require !== undefined) {
					if(value == "" || value == undefined) {
						unverified.push(title);
						input.addClass("validate");
						return;
					}
				}
				input.removeClass("validate");
			});
			
			if(unverified.length > 0) {
				layer.msg('请输入' + unverified.join("、"));
				return null;
			}
			
			return data;
		},
		post: function(url, data, callback, title, silent) {
			var title = title || "操作";
			$.post(HTTP_SERVER + url, data, function (rst) {
                if (rst && rst.code == 200) {
                		if(silent !== true) {
                    		layer.msg(title + '成功');
                    	}
                		callback.call(this, rst.result || rst.returnObject || true);
                } else {
                		callback.call(this, false);
                		layer.msg(rst.msg || (title + '失败'), { icon: 5 });
                }
            }, "json").fail(function () {
            		callback.call(this, false);
                layer.msg("服务器端错误，请稍后再试", {icon: 5});
            });
		},
		get: function(url, data, callback, title) {
			var title = title || '加载';
			w.App.post(url, data, callback, title, true);
		}
	});;
	
	function stringify(object){
        var string = JSON.stringify(object);
		if(typeof Array.prototype.map === "function") {
			return string;
       	}
		
        return string.replace(/\\u([0-9a-fA-F]{2,4})/g,function(string,matched){
            return String.fromCharCode(parseInt(matched,16));
        });
    }
})(window, jQuery);

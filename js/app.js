(function(w, $) {
	w.App = function(selector) {
		return document.getElementById(selector);
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
				return JSON.parse(json);
			} catch(e) { }
			return null;
		},
		clearUser: function() {
			$.removeCookie('user');
		},
		isArray: function(arr) {
			return Array.prototype.toString.apply(arr) == "[object Array]";
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

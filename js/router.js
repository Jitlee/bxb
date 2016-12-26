(function(w, doc, $, md5, app) {
	function router(selector, routes) {
		this.__ui = $(selector);
		this.routes = routes || [];
		this.__routes = mapRoutes(this.routes);
	}
	
	var fn = router.prototype;
	
	$.extend(fn, {
		replace: function(path) {
			var routerData = this.__routes[path];
			var reg = null;
			if(!routerData) {
				for(var key in routerData) {
					reg = new RegExp("/user/:user".replace(/\//g, "\\/").replace(/:\w+/g, "(\\w|\\d)+"), "g");
					if(!reg){
						continue;
					}
					if(reg.test(path)) {
						routerData  = routerData[key];
						break;
					}
				}
			}
			if(!routerData) {
				return;
			}
			
			this.current = routerData;
			
			if(!routerData.template) {
				return;
			}
			
			
			if(routerData.__template) {
				render(this, routerData);
				return;
			}
			
			$.ajax({
				url: routerData.template,
				dataType: "text",
				context: this,
				success: function(text) {
					var nodes = $(text);
					if(nodes.length == 0) {
						return;
					}
					
					var node = null;
					var nodeName = "";
					var templateXML = null;
					var template = "";
					var js = "";
					var id = routerData.__id;
					for(var i = 0, len = nodes.length; i < len; i++) {
						node = nodes[i];
						if(!node) {
							continue;
						}
						nodeName = node.nodeName.toLowerCase();
						if(nodeName == "template") {
							// 模版文件
							template = node.innerHTML;
							template = template.replace(/^\s*\<(\w+)/, "<$1 id=\"" + id + "\" ");
							routerData.__template = template;
						} else if(nodeName == "script" && typeof w["f_" + id] !== "function") {
							js = node.innerHTML;
							js = js.replace(/^\s*\<!--/, "").replace(/!--\>\s*$/, "");
							js = js.replace(/^\s*function/i, "function f_" + id);
							loadJavascript(js);
						}
					}
					render(this, routerData);
				}
			}).fail(function(evt) {
				console.log("加载模版失败")
			});
		}
	});
	
	function mapRoutes(routes, map, path, matches) {
		var path = path || "";
		var map = map || {};
		var matches = matches || [];
		var routerData = null;
		var fullPath = "";
		var newMatches = null;
		for(var i = 0, len = routes.length; i < len; i++) {
			routerData = routes[i];
			routerData.mathes = matches.slice();
			routerData.mathes.push(routerData);
			fullPath = path + routerData.path;
			routerData.__id = md5(fullPath);
			if(routerData.children) {
				mapRoutes(routerData.children, map, fullPath, routerData.mathes);
			} else {
				routerData.__path = fullPath;
				map[fullPath] = routerData;
			}
		}
		return map;
	}
	
	function loadJavascript(js) {
		var head = doc.getElementsByTagName('HEAD').item(0);
	    var script= doc.createElement("script");
	    script.type = "text/javascript";
	    script.innerHTML = js;
	    head.appendChild(script);
	}
	
	function render(router, routerData) {
		if(!routerData.__template) {
			router.__ui.html("");
			return;
		}
		if($("#" + routerData.__id).length > 0) {
			return;
		}
		
		router.__ui.html(routerData.__template);
		if(typeof w["f_" + routerData.__id] === "function") {
			w["f_" + routerData.__id].apply({
				$router: router,
				$user: app.getUser(),
				$el: app(routerData.__id)
			});
		}
	}
	
	w.Router = router;
})(window, document, jQuery, md5, App);

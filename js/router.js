(function(w, doc, $, md5, app) {
	function router(selector, routes) {
		this.__ui = $(selector);
		this.routes = routes || [];
		this.__routes = mapRoutes(this.routes);
		this.__watches = [];
		this.__views = [];
		this.history = [];
	}
	
	var fn = router.prototype;
	
	$.extend(fn, {
		back: function() {
			if(this.history.length > 1) {
				this.history.pop();
				var page = this.history.pop();
				this.replace(page.path);
			}
		},
		replace: function(path, extendParams, title) {
			var routerData = this.__routes[path];
			var reg = null;
			var params = {};
			if(!routerData) {
				
				if(path == "" || path == undefined || path == "/") {
					return;
				}
				
				var pathSplit = path.substr(1).split("/");
				var pathSplitLength = pathSplit.length;
				var keySplit = null;
				var matchCount = 0;
				for(var key in this.__routes) {
					keySplit = key.substr(1).split("/");
					if(keySplit.length != pathSplitLength) {
						continue;
					}
					matchCount = 0;
					params = {};
					for(var i = 0; i < pathSplitLength; i++) {
						if(pathSplit[i] == keySplit[i]) {
							matchCount++;
						} else if(keySplit[i].substr(0,1) == ":") {
							params[keySplit[i].substr(1)] = pathSplit[i];
							matchCount++;
						} else {
							break;
						}
					}
					if(matchCount == pathSplitLength) {
						routerData  = this.__routes[key];
						break;
					}
				}
			}
			if(!routerData) {
				return;
			}
			
			routerData.realPath = path;
			routerData.title = title || routerData.name;
			var historyItem = { name: title || routerData.name, path: path, route: routerData }
			if(this.history.length == 0) {
				this.history.push(historyItem);	
			} else {
				if(this.history[this.history.length - 1].route.matches.length == routerData.matches.length) {
					this.history[this.history.length - 1] = historyItem;
				} else {
					this.history.push(historyItem);	
				}
			}
			this.current = routerData;
			for(var i = 0, len = this.__watches.length; i < len; i++) {
				if(app.isFunction(this.__watches[i])) {
					this.__watches[i].call(this, routerData);
				}
			}
			
			$.extend(params, extendParams);
			
			renderRoute.call(this, routerData, params);
		},
		watch: function(watch) {
			if(this.current) {
				watch.call(this, this.current);
			}
			this.__watches.push(watch);
		}
	});
	
	function mapRoutes(routes, map, matches) {
		var map = map || {};
		var matches = matches || [];
		var routerData = null;
		var fullPath = "";
		var newMatches = null;
		for(var i = 0, len = routes.length; i < len; i++) {
			routerData = routes[i];
			routerData.matches = matches.slice();
			routerData.matches.push(routerData);
			fullPath = getFullPath(routerData.matches);
			routerData.__id = md5(fullPath);
			routerData.__path = fullPath;
			routerData.getMatches = getMatches;
			map[fullPath] = routerData;
			if(routerData.children) {
				mapRoutes(routerData.children, map, routerData.matches);
			}
		}
		return map;
	}
	
	function getMatches() {
		var matches = [];
		for(var i = 0, len = this.matches.length; i< len; i++) {
			if(matches.length > 0 && this.matches[i].path.indexOf(matches[matches.length - 1].path) == 0) {
				matches[matches.length - 1] = this.matches[i];
			} else {
				matches.push(this.matches[i]);	
			}
		}
		return matches;
	}
	
	function getFullPath(matches) {
		var buffer = [];
		var len = matches.length;
		var path = null;
//		if(matches[len - 1].path == "/bloc/schoolmgr/class/child/:blocId/:schoolId/:classId") {
//			debugger;
//		}
		while(len--) {
			path = matches[len].path.replace(/(\/\:\w+)+$/ig, "");
			if(buffer.length > 0 && buffer[0].indexOf(path) > -1) {
				continue;
			}
			
			buffer.unshift(matches[len].path);
		}
		return buffer.join("");
	}
	
	function renderRoute(routerData, params) {
		var needs = [];
		
		for(var i = 0, len = routerData.matches.length; i < len; i++) {
			if(routerData.matches[i].template) {
				if(needs.length > 0 && routerData.matches[i].path.indexOf(needs[needs.length - 1].path) == 0) {
					needs[needs.length - 1] = routerData.matches[i];
				} else if(needs.length > 0 && needs[needs.length -1].path.indexOf("/:") > -1){
					needs[needs.length - 1] = routerData.matches[i];
				} else if(!(i < len -1 && routerData.matches[i].path.indexOf("/:") > -1)) {
					needs.push(routerData.matches[i]);	
				}				
			}
		}
		
		if(needs.length == 0) {
			return;
		}
		
		this.__views.length = needs.length;
		loopRender.call(this, needs, 0, params);
	}
	
	function loopRender(routes, index, params) {
		var views = this.__views;
		if(!(index < views.length && index < routes.length)) {
			return;
		}
		
		var routerData = routes[index];
		
		if(views[index] && views[index].attr("__rid") == routerData.__id) {
			loopRender.call(this, routes, index + 1, params);
			return;
		}
		
		var view = 	$("router-view:first", index == 0 ? this.__ui : $("#" + routes[index - 1].__id));
		
		if(view.length ==  0) {
			return;
		}
		
		views[index] = view;
		loadTemplate.call(this, routerData, function() {
			if(render.call(this, view, routerData, params)) {
				loopRender.call(this, routes, index + 1, params);
			}
		});
	}
	
	function loadTemplate(routerData, callback) {
		if(routerData.__template) {
			callback.call(this);
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
				
				callback.call(this);
				
			}
		}).fail(function(evt) {
			console.log("加载模版失败")
		});
	}
	
	function loadJavascript(js) {
		var head = doc.getElementsByTagName('HEAD').item(0);
	    var script= doc.createElement("script");
	    script.type = "text/javascript";
	    script.innerHTML = js;
	    head.appendChild(script);
	}
	
	function render(routerView, routerData, params) {
		if(!routerData.__template) {
			routerView.html("");
			routerView.removeAttr("__rid");
			return false;
		}
		
		if($("#" + routerData.__id).length == 0) {
			routerView.attr("__rid", routerData.__id).html(routerData.__template);
			if(typeof w["f_" + routerData.__id] === "function") {
				w["f_" + routerData.__id].apply({
					$router: this,
					$user: app.getUser(),
					$el: app(routerData.__id),
					$params: params
				});
			}
		}
		return true;
	}
	
	w.Router = router;
})(window, document, jQuery, md5, App);

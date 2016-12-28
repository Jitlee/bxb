(function(w, $) {
	function mvc(router) {
		this.router = router;
		
		$(document.body).on("click", "[rpath]", function() {
			var $this = $(this);
			var path = $this.attr("rpath");
			var title = $this.attr("rtitle");
			var params = null;
			try {
				params = $.parseJSON($this.attr("rdata"));
			} catch(e) {}
			router.replace(path, params, title);
		});
		$(document.body).on("click", "[rback]", function() {
			router.back();
		});
	}
	w.Mvc = mvc;
})(window, jQuery);

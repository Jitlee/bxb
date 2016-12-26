(function(w, $) {
	function mvc(router) {
		this.router = router;
		
		$(document.body).on("click", "[vpath]", function() {
			var $this = $(this);
			var path = $this.attr("vpath");
			router.replace(path);
		});
	}
	w.Mvc = mvc;
})(window, jQuery);

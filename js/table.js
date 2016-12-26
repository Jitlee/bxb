(function(w,$) {
	function dataGrid(element) {
		this.el = element;
		var ths = this;
		var cAll = $("thead input[name=select]", element).click(function() {
			$("tbody input[name=select]", element).prop("checked", cAll.prop("checked"));
			onChanged.call(ths);
		});
		element.on("click", "input[name=select]", function() {
			var notAll = $("tbody input[name=select]:not(:checked)", element).length > 0;
			cAll.prop("checked", !notAll);
			onChanged.call(ths);
		});
		
		function onChanged() {
			if(typeof this.cb !== "function") {
				return;
			}
			var values = this.getSelectedValues();
			this.cb({ values: values, result: values.length > 0 });
		}
	}
	
	$.extend(dataGrid.prototype, {
		getSelectedValues: function() {
			var values = [];
			$("tbody input[name=select]:checked", this.el).each(function() {
				values.push($(this).val());
			});
			return values;
		}, change: function(callback) {
			this.cb = callback;
		}
	});
	
	w.DataGrid = dataGrid;
})(window, jQuery);

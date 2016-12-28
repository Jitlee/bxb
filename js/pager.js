(function () {
    var PAGE_SIZE = 15; // 分页大小
    var MAX_DISPLAY_PAGE_COUNT = 8; // 显示的页码最大数量

    function Pager(vm, url, params) {
        var params = $.extend({ page_size: PAGE_SIZE, last_req_time: 0 }, params);
        $.extend(vm, {
            pageNo: ko.observable(1), // 当前页码（从1开始）
            pageSize: PAGE_SIZE, // 分页大小
            recordCount: ko.observable(0), // 数据条数
            pageCount: ko.observable(0), // 最大页码
            list: ko.observableArray([]),

            // 页码
            pages: ko.observableArray([]),

            // 绑定事件
            gotoFirst: onGotoFirst, // 首页
            gotoPage: onGotoPage, // 跳转
            gotoLast: onGotoLast // 尾页
        });

        function page() {
            layer.load();
            params.page = vm.pageNo();
            App.get(url, params, function (data) {
                layer.closeAll('loading');
                if(data) {
	                params.last_req_time = data.last_req_time;
	                if(data.list && data.list.length > 0) {
	                		vm.list(data.list);
	                	} else {
	                		vm.list.removeAll();
	                	}
				    renderPages(data.total_count);
			    }
            })
	    }
	
	    function renderPages(recordCount) {
		    var pageNo = vm.pageNo();
		    var pageCount = Math.ceil(recordCount / PAGE_SIZE);
		    vm.recordCount(recordCount);
		    vm.pageCount(pageCount);
		
		    var pages = [];
		    if(pageNo > MAX_DISPLAY_PAGE_COUNT) {
			    pages.push({ text: 1, pageNo: 1 });
		    }
		    if(pageNo >= MAX_DISPLAY_PAGE_COUNT + 1) {
			    var minPageNo = Math.max(2, pageNo - MAX_DISPLAY_PAGE_COUNT);
			    pages.push({ text: "...", pageNo: minPageNo });
		    }
		
		    if(pageNo <= MAX_DISPLAY_PAGE_COUNT) {
			    var maxPageNo = Math.min(pageCount, MAX_DISPLAY_PAGE_COUNT);
			    for(var i = 0; i < maxPageNo; i++) {
				    pages.push({ text: i+1, pageNo: i + 1 });
			    }
		    } else if(pageNo >= pageCount - MAX_DISPLAY_PAGE_COUNT) {
			    var minPageNO = Math.max(1, pageCount - MAX_DISPLAY_PAGE_COUNT);
			    for(var i = 0, max = pageCount - minPageNO; i < max; i++) {
				    pages.push({ text: i + minPageNO + 1, pageNo: i + minPageNO + 1 });
			    }
		    } else {
			    for(var i = 0; i < MAX_DISPLAY_PAGE_COUNT; i++) {
				    pages.push({ text: i + pageNo, pageNo: i + pageNo });
			    }
		    }
		    if(pageNo < pageCount - MAX_DISPLAY_PAGE_COUNT - 1) {
			    var maxPageNo = Math.min(pageCount - 1, pageNo + MAX_DISPLAY_PAGE_COUNT);
			    pages.push({ text: "...", pageNo: maxPageNo });
		    } else if(pageNo <= MAX_DISPLAY_PAGE_COUNT && MAX_DISPLAY_PAGE_COUNT + 1 < pageCount) {
		 	    pages.push({ text: "...", pageNo: pageCount - 1 });
		    }
		    if(pageNo <= pageCount - MAX_DISPLAY_PAGE_COUNT
			    || (pageNo <= MAX_DISPLAY_PAGE_COUNT && MAX_DISPLAY_PAGE_COUNT < pageCount)) {
			    pages.push({ text: pageCount, pageNo: pageCount });
		    }
		    vm.pages(pages);
	    }
	
	    function onGotoFirst() {
		    if(vm.pageNo() == 1) {
			    return;
		    }
		
		    vm.pageNo(1);
		    page();
	    }
	
	    function onGotoPage() {
		    if(this.pageNo == vm.pageNo()) {
			    return;
		    }
		    vm.pageNo(this.pageNo);
		    page();
	    }
	
	    function onGotoLast() {
		    var pageCount = vm.pageCount();
		    if(pageCount < 2 || pageCount == vm.pageNo()) {
			    return;
		    }
		
		    vm.pageNo(pageCount);
		    page();
	    }

	    function setParams(newParams) {
	        $.extend(params, newParams);
	        vm.pageNo(1);
	        page();
	    }

	    this.page = page;
	    this.setParams = setParams;
	    this.vm = vm;
    }

    window.Pager = Pager;
})();
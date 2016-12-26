(function() {
	var routes = [
		{
			path: "/user",
			name: "用户管理",
			icon: "img/top-nav/device.png",
			children: [
				{
					path: "/system",
					name: "系统用户",
					template: "views/user/system.html"
				},
				{
					path: "/bloc",
					name: "集团列表",
					template: "views/user/bloc.html"
				},
				{
					path: "/school",
					name: "学校列表",
					template: "views/user/school.html"
				},
				{
					path: "/class",
					name: "班级列表",
					template: "views/user/class.html"
				},
				{
					path: "/teacher",
					name: "教师列表",
					template: "views/user/teacher.html"
				},
				{
					path: "/student",
					name: "学生列表",
					template: "views/user/student.html"
				},
				{
					path: "/patriarch",
					name: "家长列表",
					template: "views/user/patriarch.html"
				}
			]
		},
		{
			path: "/device",
			name: "设备管理",
			icon: "img/top-nav/device.png",
			children: [
				{
					path: "/group",
					name: "设备组列表",
					template: "view/device/group.html"
				},
				{
					path: "/wristband",
					name: "手环列表",
					template: "view/device/wristband.html"
				},
				{
					path: "/ruler",
					name: "身高尺",
					template: "view/device/ruler.html"
				},
				{
					path: "/scale",
					name: "健康秤",
					template: "view/device/scale.html"
				}
			]
		},
		{
			path: "/mall",
			name: "商城管理",
			icon: "img/top-nav/device.png",
			children: [
				{
					path: "/goods",
					name: "商品列表",
					template: "view/mall/goods.html"
				},
				{
					path: "/order",
					name: "订单列表",
					template: "view/mall/order.html"
				},
			]
		},
		{
			path: "/lesson",
			name: "讲堂管理",
			icon: "img/top-nav/device.png",
			children: [
				{
					path: "/list",
					name: "课堂列表",
					template: "view/lesson/list.html"
				}
			]
		},
		{
			path: "report",
			name: "报表管理",
			icon: "img/top-nav/device.png",
			children: [
				{
					path: "/student",
					name: "学生报表列表",
					template: "view/report/student.html"
				}
			]
		}
	];
	window.getRoutes = function() {
		return routes;
	}
})();

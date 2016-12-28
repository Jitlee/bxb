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
					template: "views/user/bloc.html",
					children: [
						{
							path: "/bloc/mgr",
							name: "集团管理",
							template: "views/user/bloc/mgr.html",
							children: [
								{
									path: "/school/:blocId",
									name: "学校列表",
									template: "views/user/bloc/school.html"
								},
								{
									path: "/class/:blocId",
									name: "班级列表",
									template: "views/user/school/class.html"
								},
								{
									path: "/teacher/:blocId",
									name: "教师列表",
									template: "views/user/bloc/teacher.html"
								},
								{
									path: "/parent/:blocId",
									name: "家长列表",
									template: "views/user/bloc/parent.html"
								}
							]
						},
						{
							path: "/bloc/schoolmgr",
							name: "学校管理",
							template: "views/user/school/mgr.html",
							children: [
								{
									path: "/class/:blocId/:schoolId",
									name: "班级列表",
									template: "views/user/school/class.html",
									children: [
										{
											path: "/bloc/schoolmgr/class/child/:blocId/:schoolId/:classId",
											name: "学生列表",
											template: "views/user/school/child.html",
										}
									]
								}, {
									path: "/child/:blocId/:schoolId",
									name: "学生管理",
									template: "views/user/school/child.html"
								}
							]
						},
						{
							hidden: true,
							path: "/bloc/parent/:blocId/:schoolId/:childId",
							name: "家长列表",
							template: "views/user/bloc/parent.html"
						}
					]
				},
				{
					path: "/school",
					name: "学校列表",
					template: "views/user/bloc/school.html"
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
					template: "views/device/group.html"
				},
				{
					path: "/wristband",
					name: "手环列表",
					template: "views/device/wristband.html"
				},
				{
					path: "/ruler",
					name: "身高尺",
					template: "views/device/ruler.html"
				},
				{
					path: "/scale",
					name: "健康秤",
					template: "views/device/scale.html"
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
					template: "views/mall/goods.html"
				},
				{
					path: "/order",
					name: "订单列表",
					template: "views/mall/order.html"
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
					template: "views/lesson/list.html"
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
					template: "views/report/student.html"
				}
			]
		}
	];
	window.getRoutes = function() {
		return routes;
	}
})();

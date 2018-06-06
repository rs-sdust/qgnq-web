$(function() {
	getcatalog();
	Ly.init("map");
	$(".sidebar-menu >ul").on("click", ".first", function() {

		$(".sidebar-submenu").slideUp(250);
		if ($(this).parent().hasClass("active")) {
			$(".sidebar-dropdown").removeClass("active");
			$(this).parent().removeClass("active");
		} else {
			$(".sidebar-dropdown").removeClass("active");

			$(this).next(".sidebar-submenu").slideDown(250);
			$(this).parent().addClass("active");
		}
	});
	$(".btnleft").click(function() {
		$(".sidebar-wrapper").toggleClass("toggled");
		$(".btnleft").toggleClass("btnleftclose");
	});
	$(".btnright").click(function() {
		if (!$(this).hasClass("hasopen")) {
			$(".rightsidebar").toggleClass("rightclose");
			$(".btnright").toggleClass("btnleftclose");
			$("#dateSearch").toggleClass("dateclose");
			$(".changebtn").toggleClass("dateclose");
			$(".legend").toggleClass("dateclose");
		}
	});
	$(".basemapchange").click(function() {
		if ($(this).hasClass("on")) {
			$(this).next(".mapselect").animate({
				width: "0px"
			}, 200, function() {
				$(this).prev(".basemapchange").removeClass("on");
				$(this).css("display", "none");
			});
		} else {
			$(this).next(".mapselect").css("display", "block");
			$(this).next(".mapselect").animate({
				width: "200px"
			}, 200, function() {
				$(this).prev(".basemapchange").addClass("on");
			});
		};
	});
	$(".mapselect div").click(function() {
		if (!$(this).hasClass("open")) {
			$(".mapselect .open").removeClass("open");
			$(this).addClass("open");
			$(this).parent(".mapselect").animate({
				width: "0px"
			}, 200, function() {
				$(this).prev(".basemapchange").removeClass("on");
				$(this).css("display", "none");
			});
			switch ($(this).attr("name")) {
			case "ditu":
				Ly.changeTilelayer(1);
				break;
			case "rsimage":
				Ly.changeTilelayer(2);
				break;
			case "dem":
				Ly.changeTilelayer(3);
				break;
			default:
				break;
			}
		}
	});
	$(".sidebar-menu >ul").on("click", ".sidebar-submenu >li", function() {
		$(this).find("input").get(0).checked = true;
		var timedata = {
			prodType: $(this).attr("param0"),
			cropType: $(this).attr("param1"),
			diseaseType: $(this).attr("param2")
		};
		$.ajax({
			type: "get",
			url: ipaddress + "api/data/GetAllDate",
			data: timedata,
			dataType: "json",
			async: false,
			success: function(json, status) {
				if (status == "success") {
					timeserice = JSON.parse(json);
					currentdate = timeserice[0].date;
				} else alert("wrong!");
			},
			error: function() {
				alert("时间序列数据加载失败，请联系管理员！");
			}
		});
		currentdate = timeserice[0].date;
		$("#dateSearch #inputandimg #date").text(currentdate);
		if (currentlevel < 1) {
			var provinitdata = {
				date: currentdate,
				level: "1",
				regionId: "0",
				prodType: $(this).attr("param0"),
				cropType: $(this).attr("param1"),
				diseaseType: $(this).attr("param2")
			}
			getInitdata(provinitdata);
		} else {
			var provinitdata = {
				date: currentdate,
				level: "1",
				regionId: "0",
				prodType: $(this).attr("param0"),
				cropType: $(this).attr("param1"),
				diseaseType: $(this).attr("param2")
			}
			if (!isEmpty(polygonjson)) Ly.map.removeLayer(polygonjson);
			if (!isEmpty(cityandcountyLayer)) Ly.map.removeLayer(cityandcountyLayer);
			$.ajax({
				type: "get",
				url: ipaddress + "api/data/GetProd",
				data: provinitdata,
				dataType: "json",
				success: function(json, status) {
					if (status == "success") {
						polyProvValue = JSON.parse(json);
						unit = polyProvValue.unit;
						currentlevel = parseInt(polyProvValue.level);
						polyProvValue.data.sort(sortById);
						getmaxminvalue(polyProvValue.data);
						addProvLayers(polyProvLayer);
						barchart(polyProvValue);
					} else alert("wrong!");
				},
				error: function() {
					alert("省级数据加载失败，请联系管理员！");
				}
			})
		}
	});
	var prevlevel;
	var countryjson;
	var allprovdis;
	$(".other").click(function() {
		if (!isEmpty(polygonjson)) Ly.map.removeLayer(polygonjson);
		if (!isEmpty(cityandcountyLayer)) Ly.map.removeLayer(cityandcountyLayer);
		if (!$(".btnright").hasClass("hasopen")) {
			$(".btnright").click();
			$(".btnleft").click();
			$(".btnright").addClass("hasopen");
			Ly.map.scrollWheelZoom.disable();
			prevlevel = currentlevel;
			currentlevel = 0;
			var provinitdata = {
				date: currentdate,
				level: currentlevel,
				regionId: "0",
				prodType: $('input:radio[name="radio"]:checked').parent("li").attr("param0"),
				cropType: $('input:radio[name="radio"]:checked').parent("li").attr("param1"),
				diseaseType: $('input:radio[name="radio"]:checked').parent("li").attr("param2")
			}
			$.ajax({
				type: "get",
				url: ipaddress + "api/data/GetProd",
				data: provinitdata,
				dataType: "json",
				success: function(json, status) {
					if (status == "success") {
						console.log(JSON.parse(json).data);
						allprovdis = L.geoJSON(polyProvLayer, {
							style: function(feature) {
								return {
									fillColor: "rgba(0,0,0,0)",
									weight: 1,
									opacity: 1,
									color: '#000',
									fillOpacity: 0.8
								}
							}
						}).addTo(Ly.map)
						Ly.map.fitBounds(allprovdis.getBounds());
						getmaxminvalue(JSON.parse(json).data.features);

						countryjson = L.geoJSON(JSON.parse(json).data, {
							style: function(feature) {
								return {
									fillColor: getColor(feature.properties.value, min_d[0], min_d[1]),
									weight: 1,
									opacity: 1,
									color: '#000',
									fillOpacity: 0.8
								}
							}
						}).addTo(Ly.map)
					} else alert("wrong!");
				},
				error: function() {
					alert("全国级数据加载失败，请联系管理员！");
				}
			});
		} else {
			$(".btnright").removeClass("hasopen");
			$(".btnright").click();
			$(".btnleft").click();
			Ly.map.scrollWheelZoom.enable();
			Ly.map.removeLayer(countryjson);
			Ly.map.removeLayer(allprovdis);

			if (prevlevel == 1) {
				$('input:radio[name="radio"]:checked').parent("li").click();
				currentlevel = 1;
			}
		}
	});
	$("#inputandimg #date").dateSelect();
	var start = getstartDate(currentdate);
	SetProgressTime(null, start, 7);
});
function getcatalog() {
	$.ajax({
		type: "get",
		url: ipaddress + "api/Dic/getcatalog",
		data: {
			"client": "web"
		},
		dataType: "json",
		success: function(data) {
			var datajson = JSON.parse(data);

			for (var i = 0; i < datajson.catalog.first.length; i++) {
				addFirstHTMLcode(datajson.catalog.first[i].name, datajson.catalog.first[i].id);
				if (datajson.catalog.first[i].second.length) {
					$.each(datajson.catalog.first[i].second, function(index, obj) {

						addSecondHTMLcode(obj.name, datajson.catalog.first[i].id, obj);
					})
				} else {
					addSecondHTMLcode(datajson.catalog.first[i].second.name, datajson.catalog.first[i].id, datajson.catalog.first[i].second);
				}
			}
			$(".0").prev(".first").click();
			$(".0").children("li:first").click();
		},
		error: function() {
			alert("目录加载失败，请联系管理员！");
		}
	});
};
function addFirstHTMLcode(name, id) {
	var str = null;
	str = '<li class="sidebar-dropdown"><a class="first"><i class="fa fa-leaf"></i><span>' + name + '</span></a><div class="sidebar-submenu' + ' ' + id + '"></div></li>';
	$(".sidebar-menu >ul").append(str);
};
function addSecondHTMLcode(name, id, param) {
	var senconddiv = "." + id;
	var str = '<li param0 ="' + param.param0 + '" param1 ="' + param.param1 + '" param2 ="' + param.param2 + '"><input name="radio" type="radio"><div class="radio_option"><a>' + name + '</a></div></li>';
	$(senconddiv).append(str);
};
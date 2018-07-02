/*
 * @Author: wk 
 * @Date: 2018-04-17 17:12:50 
 * @Last Modified by: wk
 * @Last Modified time: 2018-07-01 21:04:50
 */
;
//获取到的geojson
var polygonjson=[];
//省级图层,属性和图形分开，采用不同方法处理，保留图形，动态请求属性值 polyProvLayer存放图层，polyProvValue存放获得的值
var polyProvLayer = [];
var polyProvValue = [];
//市县级图层，属性和图形没有分开
var cityandcountyLayer = [];
//当前指定的范围id
var currentregionid = -1;
//上一级id
var oldRegionid = -1;
//存放当前的范围等级
var currentlevel = -1;
//当前的产品时间
var currentdate = "";
//当前数据的单位
var unit;
//存放渲染图层值的最大最小值与公差
var min_d = new Array();
//存放已有的产品时间
var timeserice = [];
//存放数据的颜色表
var mycolortable = {
    0:['#FAF9AF','#C3E790','#8ED079','#58BB62','#20A34D'],
    1:['#FD5A13','#FF9E00','#EDE647','#A3CC15','#51B310'],
    2:['#FFFF00','#FFE100','#FFC300','#FFA700','#FF8800'],
    3:['#89D4A5','#F1DEA2','#D79578','#D2584A'],
    4:['#15E1D2','#18BC14','#E2F903','#FEAD00','#FC2B03'],
    5:['#1A459F','#4D8ADD','#99CCCF','#EADA70','#F3A832','#E86E45','#D83410'],
    6:['#FFFFFF','#C7E4F2','#88C5E4','#5692CE','#306BA6','#234F78','#434472'],
    7:['#AAABAD']
}

//
var timebarstart = false;
//数据库地址
var ipaddress = "http://39.104.185.135/qgnq/";
//初始化地图map，默认地图的中心，大小层级，以及缩放的最大最小层级
var Ly = {
	map: {},
	defZoom: 4,
    defCenter: [37.69, 116.26],
	init: function (mapDiv) {
		this.map = L.map(mapDiv, {
			center: this.defCenter,
			zoom: this.defZoom,
			minZoom: 4,
            maxZoom: 16,
            doubleClickZoom:false,
			attributionControl: false,
            zoomControl: false,
            crs: L.CRS.EPSG3857,
            animate: true
        });
        // this.map.on("zoomstart", getnextjson(1));
        // this.mapSourceControl();
        
        this.changeTilelayer(1);
        this.map.on('zoomend', resetLayer);
	},
	changeTilelayer: function (m) {
		//控制地图底图
        var street =  L.layerGroup([
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']/*,noWrap:true*/}),
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']/*,noWrap:true*/})
                    ]);
        var img = L.layerGroup([
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']}),
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']})
                    ]);
        var dem = L.layerGroup([
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']}),
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']})
                    ]);
        switch(m){
            case 1:
                street.addTo(this.map);
                break;
            case 2:
                img.addTo(this.map);
                break;
            case 3:
                dem.addTo(this.map);
                break;
            default:
                alert("there are something wrong!")
                break;
            }
	},
    mapgeojsoninit:function(){
    },
    option:function(){ 
        // this.map.on('zoomend', resetLayer);
    }
};

//从数据库获取geojson,添加图层,加载初始化的数据

function getInitdata(initdata) {
    // polyProvValue 
    // console.log(initdata);
    /**
	* 获取省级数据
    */
   currentdate = initdata.date;
//    console.log(currentdate);
    $.ajax({
        type:"get",
        url:ipaddress+"api/data/GetProd",
        data:initdata,
        dataType:"json",
        success:function(json,status){
            if(status =="success")
            { 
                polyProvValue = JSON.parse(json);
                console.log(polyProvValue);
                console.log("polyProvValue");
                currentlevel = parseInt(polyProvValue.level);
                polyProvValue.data.sort(sortById);
                unit = polyProvValue.unit;
                getmaxminvalue(polyProvValue.data);
            }
            else
                alert("wrong!");
        },
        error: function () {  
                alert("省级数据加载失败，请联系管理员！"); 
            }
    }) 
	/**
	 * 根据路径获取到geojson数据
	 */
    $.ajax({
        type:"get",
        url:ipaddress+"api/map/GetMapData",
        dataType:"json",
        success:function(json,status){
            if(status =="success")
            {
                polyProvLayer = JSON.parse(json);
                polyProvLayer.features.sort(sortByPropertiesId);
                addProvLayers(polyProvLayer);
                //添加chart
                barchart(polyProvValue);

            }
            else
                alert("wrong!");
        },
        error: function (data) {  
                alert("省级矢量加载失败，请联系管理员！"); 
            }
    }) 
    // setLegend();
}
//添加省级geojson,并渲染，只针对于省级数据，市县级数据不能处理
function addProvLayers(states){
    // console.log(states);
    polygonjson = L.geoJSON(states,{
        style: function (feature) {
            return {
                    fillColor: getColor(polyProvValue.data[(feature.properties.id)].value,min_d[0],min_d[1]),
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.8,
                    }; },
        onEachFeature:function(feature, layer){
            layer.on({
                mouseover: highlightFeature,
                mouseout: function(e) {
                    polygonjson.resetStyle(e.target);        
                    var trList = $("tbody").children("tr");
                    for (var i=0;i<trList.length;i++){
                        var tdArr = trList.eq(i).find("td");
                        if(this.feature.properties.name == tdArr.eq(1).text())
                        {
                            $(trList.eq(i)).removeClass("hover");
                        }
                    }
                },
                dblclick:zoomToFeature,
                click: showtrendchart
            });
        }
        }).addTo(Ly.map);
    Ly.map.fitBounds(polygonjson.getBounds());
}

//每个Feature对象，附加事件和弹出功能。默认是与新创建的图层做什么：
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        dblclick:zoomToFeature,
        click: showtrendchart
    });
}

//设置Feature高亮
//通过e.target获得layer，设置灰色高亮  
function highlightFeature(e) {
    var layer = e.target; //触发事件的对象
    layer.setStyle({    
                weight: 5,
                color: '#fff',
                dashArray: '',
                fillOpacity: 1
            });
    layer.bringToFront();
    var trList = $("tbody").children("tr");
    for (var i=0;i<trList.length;i++){
        var tdArr = trList.eq(i).find("td");
        if(this.feature.properties.name == tdArr.eq(1).text())
        {
            $(trList.eq(i)).addClass("hover");
        }
    }
}

//设置重置高亮
function resetHighlight(e) 
{
    // console.log(e);
    cityandcountyLayer.resetStyle(e.target);
    var trList = $("tbody").children("tr");
    for (var i=0;i<trList.length;i++){
        var tdArr = trList.eq(i).find("td");
        if(this.feature.properties.name == tdArr.eq(1).text())
        {
            $(trList.eq(i)).removeClass("hover");
        }
    }
}
var timeoutID= null;
//设置Feature缩放 ，到点击的对象合适的大小    
function zoomToFeature(e) 
{
    //将地图视图尽可能大地设定在给定的地理边界内.
    clearTimeout(timeoutID);
    Ly.map.fitBounds(e.target.getBounds());
    getnextjson(e);
}

//单击事件绘制趋势
function showtrendchart(e){
    // console.log(e.sourceTarget.feature);
    clearTimeout(timeoutID);
    var gettrenddata = {
        start:currentdate,
        days:timeserice.length,
        level:currentlevel,
        regionId:e.sourceTarget.feature.properties.id,
        prodType: $('input:radio[name="radio"]:checked').parent("li").attr("param0"),
        cropType:$('input:radio[name="radio"]:checked').parent("li").attr("param1"),
        diseaseType:$('input:radio[name="radio"]:checked').parent("li").attr("param2")
    }
    timeoutID = window.setTimeout(function(){
        $.ajax({
            type:"get",
            url:ipaddress+"api/data/GetTrend",
            data:gettrenddata,
            dataType:"json",
            success:function(json,status){
                if(status =="success")
                {
                    console.log(json);
                    if(!isEmpty(json))
                        addEchartslinePlot(e.latlng,e.sourceTarget.feature,JSON.parse(json));         
                }
                else
                    alert("wrong!");
            },
            error: function (data) {alert("加载失败，请联系管理员！");}
        }) 
    },300)
   
}
//根据feature对象属性density提供对应的风格样式
function style(feature) 
{
    // console.log(feature);
    return {
            fillColor: getColor(feature.properties.value,min_d[0],min_d[1]),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8
            };
}
//根据d大小返回相应颜色
function getColor(attrvalue,minvalue,d) {
    var colortable = mycolortable[$('input:radio[name="radio"]:checked').parent("li").attr("param0")];
    // console.log(colortable);
    switch(colortable.length)
    {
    case 4 :
        return  attrvalue > (minvalue+3*d) ? colortable[3] :
                attrvalue > (minvalue+2*d)? colortable[2] :
                attrvalue > (minvalue+d) ? colortable[1] :
                attrvalue > minvalue ? colortable[0] : colortable[0];
    case 5 :
        return  attrvalue > (minvalue+4*d) ? colortable[4] :
                attrvalue > (minvalue+3*d) ? colortable[3] :
                attrvalue > (minvalue+2*d)? colortable[2]:
                attrvalue > (minvalue+d) ? colortable[1] :
                attrvalue > minvalue ? colortable[0] : colortable[0];
    case 7 :
        return  attrvalue > (minvalue+6*d) ? colortable[6] :
                attrvalue > (minvalue+5*d) ? colortable[5] :
                attrvalue > (minvalue+4*d) ? colortable[4] :
                attrvalue > (minvalue+3*d) ? colortable[3] :
                attrvalue > (minvalue+2*d)? colortable[2] :
                attrvalue > (minvalue+d) ? colortable[1] :
                attrvalue > minvalue ? colortable[0] : colortable[0];
    }

}
function getmaxminvalue(jsondata){
    var valuearr=new Array();
    if(currentlevel ==1 )
    {
        for(var i =0;i<jsondata.length;i++)
        {
            valuearr[i] = jsondata[i].value;
        }
    }
    else
    {
        for(var i =0;i<jsondata.length;i++)
        {
            valuearr[i] = jsondata[i].properties.value;
        }
    }
   
    var minvalue = Math.min.apply(null,valuearr);
    var maxvalue = Math.max.apply(null,valuearr);
    var d = (maxvalue-minvalue)/mycolortable[$('input:radio[name="radio"]:checked').parent("li").attr("param0")].length;
    min_d[0]=minvalue;
    min_d[1]=d;
    min_d[2] = maxvalue;

    var grade = [];
    for(var i =0;i<mycolortable[$('input:radio[name="radio"]:checked').parent("li").attr("param0")].length;i++)
    {
        grade.push((minvalue+i*d).toFixed(2));
    }
    setLegend(grade);
    // console.log(valuearr);
    // console.log(min_d);
}
//点击趋势事件，选出他的属性，并利用echarts进行渲染,e为事件，geoPropertyData为传入的属性,至获取数据
function addEchartslinePlot(pointLatlng,feature,geoPropertyData) {
    //如果之前创建过popup，则删除创建的popup的div，否则，echarts会在之前的div中渲染数据，而新建的div不会有数据
    $("#marker").remove();
	var content = '<div style="width: 300px; height: 200px;" id="marker"></div>';
    L.popup({autoclose:false}).setLatLng(pointLatlng).setContent(content).openOn(Ly.map);
    var geoTime = [];
    var geoData = [];
    for(var i =0;i<geoPropertyData.data.length;i++){
        geoTime.push(geoPropertyData.data[i].date);
        geoData.push(geoPropertyData.data[i].value);
    }
	var myChart = echarts.init(document.getElementById('marker'));
	// 指定图表的配置项和数据
	option = {
		title: {
			text: feature.properties.name,
            textAlign: "left"
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: [{
			type: 'category',
            data: geoTime,
            axisLabel: {rotate: 45, interval: 0}
		}],
		yAxis: [{
            name : geoPropertyData.unit,
			type: 'value',
			min: Math.min.apply(null,geoData),
			max: Math.max.apply(null,geoData)
		}],
		series: [{
			type: 'line',
			data: geoData
		}]
    };
	// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    
};
//判断对象，数组是否为空,空返回为真
function isEmpty(obj) {
    if(obj && obj == 0 && obj == '' && obj == "") {　　　　　　　　　
      return true;
    }
    else {
        return false;
    }
}
/****************************************  右侧图表的生成********************************/
//表格生成和柱状图生成
//生成表格
function getTable(x,y,colName,typeName){
    var axisData = y;//获取图形的data数组
    // console.log("axisData");
    // console.log(axisData);
    // var series = opt.series;//获取series
    // console.log(series);
    var num = 0;//记录序号
    // var sum = new Array();//获取合计数组（根据对应的系数生成相应数量的sum）
    // for(var i=0; i<series.length; i++){
    //     sum[i] = 0;
    // }
    var table = '<table class="bordered"><thead><tr>'
        + '<th>'+colName+'</th>'
        + '<th>'+typeName+'</th>'
        +'<th>'+$('input:radio[name="radio"]:checked').parents("div").prev("a").find("span").text()+"("+unit+")"+'</th>';
    // for(var i=0; i<series.length;i++){
    //     table += '<th>'+"产量"+"("+unit+")"+'</th>'
    // }
    table += '</tr></thead><tbody>';
    for (var i = axisData.length-1;i >=0; i--) {
        num += 1;
        table += '<tr>'
            + '<td>' + num + '</td>'
            + '<td>' + axisData[i] + '</td>';
            if(x[i]){
                table += '<td>' + x[i] + '</td>';
            }else{
                table += '<td>' + 0 + '</td>';
            }
        
        table += '</tr>';
    }
    table += '</tr></tbody></table>';
    return table;
}
//生成柱状图
function barchart(geodata){
    var mybarChart = echarts.init(document.getElementById('rightchart'));
    var xarray=[];
    var yarray=[];
    var xybar =[];
    var y =[];
    var x =[];
    if(currentlevel == 1)
    {
        for(var i = 0;i<geodata.data.length;i++){
            xybar.push(geodata.data[i]);
        }
        xybar.sort(sortByValue);
        for(var i = 0;i<geodata.data.length;i++){
            x.push(xybar[i].value);
            y.push(polyProvLayer.features[xybar[i].id].properties.name);
        }
        // console.log(xybar);
        // console.log(polyProvLayer.features);
            // 使用刚指定的配置项和数据显示图表。
        if($("#rtable").find("table").hasClass("bordered"))
        {
            $(".bordered").remove();
        }
        $("#rtable").append(getTable(x,y,"序号","行政区"));
        if(xybar.length>15)
        {
            for(var i =xybar.length-15;i<xybar.length;i++)
            {
                xarray.push(xybar[i].value);
                yarray.push(polyProvLayer.features[xybar[i].id].properties.name);
            }
        }
        else{
            for(var i =0;i<xybar.length;i++)
            {
                xarray.push(xybar[i].value);
                yarray.push(polyProvLayer.features[i].properties.name);
            }
        }
    }
    else
    {
        for(var i = 0;i<geodata.data.features.length;i++){
            xybar.push(geodata.data.features[i].properties);
        }
        xybar.sort(sortByValue);
        for(var i = 0;i<geodata.data.features.length;i++){
            x.push(xybar[i].value);
            y.push(xybar[i].name);
        }
        if($("#rtable").find("table").hasClass("bordered"))
        {
            $(".bordered").remove();
        }
        $("#rtable").append(getTable(x,y,"序号","行政区"));
        if(xybar.length>15)
        {
            for(var i =xybar.length-15;i<xybar.length;i++)
            {
                xarray.push(xybar[i].value);
                yarray.push(xybar[i].name);
            }
        }
        else{
            for(var i =0;i<xybar.length;i++)
            {
                xarray.push(xybar[i].value);
                yarray.push(xybar[i].name);
            }
        }
    }

    var minvalue = (Math.min.apply(null,xarray)-(Math.max.apply(null,xarray)-Math.min.apply(null,xarray))/xarray.length)<0?0:(Math.min.apply(null,xarray)-(Math.max.apply(null,xarray)-Math.min.apply(null,xarray))/xarray.length).toFixed(1);
    var maxvalue = ((Math.max.apply(null,xarray)-Math.min.apply(null,xarray))/xarray.length+Math.max.apply(null,xarray)).toFixed(1);
    // console.log(xarray);
    option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'none'      // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params){ return  params[0].data } ,
            textStyle:{align:"center"}
        },
        grid: {
            top: 10,
            bottom: 40,
            x: 120
        },
        xAxis : [
            {
                type : 'value',
                min: minvalue,
                max: maxvalue,
                splitLine: {show: false},
                axisLabel: {rotate: 45, interval: 0}
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : yarray,
                axisLabel: {rotate: 0, interval: 0}
            }
        ],
        series : [
            {
                type:'bar',
                data:xarray,
                itemStyle: {
                    normal: {
                        // barBorderRadius: 20,
                        color: new echarts.graphic.LinearGradient(0, 0, 1,0, [
                        {offset: 0, color: '#204991'},
                        {offset: 1, color: '#2E98CD'}])
                    },
                    emphasis:{
                        color:new echarts.graphic.LinearGradient(0, 0, 1,0, [
                            {offset: 0,color: '#fcbe48'}, 
                            {offset: 1,color: '#fce748'}])
                    }
                }
            }
        ]
    };

    // console.log(option);
    mybarChart.setOption(option);
    window.onresize = mybarChart.resize;
}
//排序json数组
function sortByValue(a, b) {
    return a.value - b.value
}
//按升序排列
function sortById(x, y){
    return x.id - y.id
}
//按升序排列
function sortByPropertiesId(x, y){
    return x.properties.id - y.properties.id
}
/************************************加载下一级矢量**********************/
function getGeoJSONdata(data){
    // console.log(data);
    /**
	 * 根据路径获取到geojson数据
	 */
    $.ajax({
        type:"get",
        url:ipaddress+"api/data/GetProd",
        data:data,
        dataType:"json",
        success:function(json,status){
            if(status =="success")
            {
                // console.log()
                // unit = JSON.parse(json).unit;
                if(!isEmpty(polygonjson))
                    Ly.map.removeLayer(polygonjson);
                if(!isEmpty(cityandcountyLayer))
                    Ly.map.removeLayer(cityandcountyLayer);
                addCityLayers(JSON.parse(json));
                //添加chart
                barchart(JSON.parse(json));
                
            }
            else
                alert("wrong!");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {  
            alert(XMLHttpRequest.status);
            }
    }) 
}
//添加省级geojson,并渲染，只针对于省级数据，市县级数据不能处理
function addCityLayers(jsondata){
    // console.log("jsondata");
    // console.log(jsondata.data);
    getmaxminvalue(jsondata.data.features);
    cityandcountyLayer = L.geoJSON(jsondata.data,{
        style: style,
        onEachFeature:onEachFeature
        }).addTo(Ly.map);
    Ly.map.fitBounds(cityandcountyLayer.getBounds());
}
function getnextjson(e){
    
    //移除加载的上一级图册
    if(currentlevel !== 3){
        currentregionid = e.sourceTarget.feature.properties.id;   
        if(currentlevel == 1)
        {
            currentlevel = 2;
            oldRegionid = e.sourceTarget.feature.properties.id;
        }

        else if (currentlevel == 2) 
            currentlevel = 3;
        else {
            currentlevel = -1;
        }
    // console.log(currentregionid);
    // 加载下一级图层
    // url=ipaddress+"api/data/GetAllDate";
        if(currentlevel > 0)
        {
            // if(!isEmpty(polygonjson))
            //     Ly.map.removeLayer(polygonjson);
            // if(!isEmpty(cityandcountyLayer))
            //     Ly.map.removeLayer(cityandcountyLayer);
            var data={
                date:currentdate,
                level: currentlevel,
                regionId:currentregionid,
                prodType: $('input:radio[name="radio"]:checked').parent("li").attr("param0"),
                cropType:$('input:radio[name="radio"]:checked').parent("li").attr("param1"),
                diseaseType:$('input:radio[name="radio"]:checked').parent("li").attr("param2")
            }
            getGeoJSONdata(data);
        }
    }
}
//zoomend事件，当缩放结束后判断当前缩放等级，然后进行数据加载或者渲染
function resetLayer(){
    // console.log(Ly.map.getZoom());
    if(Ly.map.getZoom() < 5)
    {
        if(currentlevel !== 1)
        {
            currentlevel = 1;
            Ly.map.removeLayer(cityandcountyLayer);
            getmaxminvalue(polyProvValue.data);
            addProvLayers(polyProvLayer);
            //添加chart
            barchart(polyProvValue);
        }
            
    }
    else if(Ly.map.getZoom()>=6 && Ly.map.getZoom()<8)
    {
        if(currentlevel == 3)
        {
            currentlevel = 2;
            Ly.map.removeLayer(cityandcountyLayer);
            var data={
                date:currentdate,
                level: currentlevel,
                regionId:oldRegionid,
                prodType: $('input:radio[name="radio"]:checked').parent("li").attr("param0"),
                cropType:$('input:radio[name="radio"]:checked').parent("li").attr("param1"),
                diseaseType:$('input:radio[name="radio"]:checked').parent("li").attr("param2")
            }
            getGeoJSONdata(data);
        }
    }
    // else{
    // }
}

//设置图例
function setLegend(grades)
{

    // console.log(grades);
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        
        var div,labels = [],from, to;
        if( $(".legend").hasClass("dateclose"))
            div = L.DomUtil.create('div', 'infocolor legend dateclose');
        else
            div = L.DomUtil.create('div', 'infocolor legend');
        $(".legend").remove();
        labels.push('<span>图例</span>');
        labels.push('<span class="secspan">单位:'+unit+'</span>');
        for (var i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
            labels.push(
                '<i style="background:' + mycolortable[$('input:radio[name="radio"]:checked').parent("li").attr("param0")][i] + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'));
        }     
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(Ly.map);
}



//时间滑动显示
// function timeslide(){
    
// }

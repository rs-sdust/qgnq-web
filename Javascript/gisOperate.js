;
//初始化地图map，默认地图的中心，大小层级，以及缩放的最大最小层级
var Ly = {
	map: {},
	// tilelayer: {},
	defZoom: 4,
    defCenter: [37.69, 116.26],
	init: function (mapDiv) {
		this.map = L.map(mapDiv, {
			center: this.defCenter,
			zoom: this.defZoom,
			minZoom: 2,
			maxZoom: 16,
			attributionControl: false,
			zoomControl: false,
			crs: L.CRS.EPSG3857
		});
        this.mapSourceControl();
        this.changeTilelayer(1);
	},
	changeTilelayer: function (m) {
		//控制地图底图
        var street =  L.layerGroup([
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']}),
                    L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}', {subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']})
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
	mapSourceControl: function () {
		var MapSourceControl = L.Control.extend({
			initialize: function (foo, options) {
				L.Util.setOptions(this, options);
			},
			onAdd: function (map) {
				var loc = L.DomUtil.create('div', 'leaflet-control-mapsource');
                loc.style.fontFamily = "Consolas,Arial";
                loc.style.clear = "none";
                loc.style.color ="#ffffff";
				loc.innerHTML = "版权所有： 北京尚德智汇科技有限公司";
				return loc;
			}
		});
		this.map.addControl(new MapSourceControl("mapSource", {
			position: 'bottomright'
		}));
    },
    option:function(){
        
    }
};

var polygonjson;
var min_d = new Array();
//添加geojson,并渲染
function addgeojsonlayers(states){
    console.log(states);
    getmaxminvalue(states);
    polygonjson = L.geoJSON(states,{
        style: style,
        onEachFeature: onEachFeature
        }).addTo(Ly.map);
    Ly.map.fitBounds(polygonjson.getBounds());
}
//每个Feature对象，附加事件和弹出功能。默认是与新创建的图层做什么：
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
//设置Feature高亮
//通过e.target获得layer，设置灰色高亮
function highlightFeature(e) {
    var layer = e.target; //触发事件的对象
    layer.setStyle({
                weight: 1,
                color: '#000', //黑色
                dashArray: '', //？
                fillOpacity: 0.1
            });
}

//设置重置高亮
function resetHighlight(e) 
{
    polygonjson.resetStyle(e.target);
    //调用控件info的修改方法
    // info.update();
}

//设置Feature缩放 ，到点击的对象合适的大小    
function zoomToFeature(e) 
{
    //将地图视图尽可能大地设定在给定的地理边界内.
    Ly.map.fitBounds(e.target.getBounds());
}
//根据feature对象属性density提供对应的风格样式
function style(feature) 
{
    return {
            fillColor: getColor(feature.properties.ProductValue,min_d[0],min_d[1]),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8
            };
}
//根据d大小返回相应颜色
function getColor(attrvalue,minvalue,d) {

    return  attrvalue > (minvalue+4*d) ? '#E31A1C' :
            attrvalue > (minvalue+3*d) ? '#FC4E2A' :
            attrvalue > (minvalue+2*d)? '#FD8D3C' :
            attrvalue > (minvalue+d) ? '#FEB24C' :
            attrvalue > minvalue ? '#FED976' :
                '#FFEDA0';
}
function getmaxminvalue(jsondata){
    var valuearr=new Array();
    for(var i =0;i<jsondata.features.length;i++)
    {
        valuearr[i] = jsondata.features[i].properties.ProductValue;
        console.log(valuearr[i]);
    }
    var minvalue = Math.min.apply(null,valuearr);
    var maxvalue = Math.max.apply(null,valuearr);
    var d = (maxvalue-minvalue)/5;
    min_d[0]=minvalue;
    min_d[1]=d;
    // return min_d;
}
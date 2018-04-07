;
//从数据库请求数据构建目录
function getcatalog()
{
    $.ajax({
        type:"get",
        url:"api/Dic/getcatalog",
        dataType:"json",
        success:function(data){
            var datajson = JSON.parse(data);
            for(var i = 0;i<datajson.Catalog.first.length;i++)
            {
                addFirstHTMLcode(datajson.Catalog.first[i].name,datajson.Catalog.first[i].id);
                if(datajson.Catalog.first[i].second.length){
                    $.each(datajson.Catalog.first[i].second,function(index,obj){
                        addSecindHTMLcode(datajson.Catalog.first[i].id,obj.name);
                    }) 
                }
                else{
                    addSecindHTMLcode(datajson.Catalog.first[i].id,datajson.Catalog.first[i].second.name);
                }
            }
        }
    })
}
function addFirstHTMLcode(name,id)
{
    var str = '<li class="nLi"><p class="first"><img src="Image/add.png">'+name+'</p><ul class="sub'+' '+id+'"></ul></li>';
    $("#leftguide >ul").append(str);
}
function addSecindHTMLcode(id,htmldate)
{   
    var ul="."+id;
    var str = '<li><label><input name="radio" type="radio" class="second"><div class="radio_option"></div><p>'+htmldate+'</p></label><div id="legend"></div></li>';
    $(ul).append(str);
}

//从数据库获取geojson,添加图层
function getGeoJSONdata(data) {
	/**
	 * 根据路径获取到geojson数据
	 */
    var getdata = {
         date:"2018-03-26",
         productType:"0",
         cropType : "0",
         diseaseType:"0",
         provId:"-1"
     }
    $.ajax({
        type:"get",
        url:"api/product/GetProvRealTimeProduct",
        data:getdata,
        dataType:"json",
        success:function(json,status){
            if(status =="success")
            {
                addgeojsonlayers(JSON.parse(json[0].jsonb_build_object));
            }
            else
                alert("wrong!");
        }
    }) 
}


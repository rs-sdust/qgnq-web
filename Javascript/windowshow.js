;
// 界面的操作和展示
$(function()
{   
    $("#inputandimg #date").dateSelect();
    var start = getstartDate();
    $("#dateSearch #inputandimg #input").val(start);
    SetProgressTime(null, start, 10);
    getcatalog();
    Ly.init("map");
    getGeoJSONdata(2);//读取数据库图层
    //左侧边栏上部菜单的展开关闭
    $("#leftguidediv #leftguide .firstul").on("click",".first",function(){
        if($(this).parent(".nLi").hasClass("on"))
        {
            $(this).parent(".nLi").find("img").attr('src',"Image/add.png");
            $(this).next(".sub").slideUp(200,function()
            {
                $(this).parent(".nLi").removeClass("on");
            });
        }else{
            $(this).parent(".nLi").find("img").attr('src',"Image/reduce.png");
            $(this).next(".sub").slideDown(200,function()
            {
                $(this).parent(".nLi").addClass("on");
            });
        }
    });
    // 左侧导航栏滑动开闭
	 $("#leftguidediv #controlButton").click(function()
	 {
	 	if ($(this).hasClass("onLeft") && $(this).parent("#leftguidediv").hasClass("onLeft"))
	 	{
            $(this).find(".LeftGuidebtn").attr('src',"Image/Open.png");
	 		$(this).parent("#leftguidediv").animate({width: "0"},100,function()
                {
                    $(this).removeClass("onLeft");
                    $(this).find("#leftguidediv").removeClass("onLeft");
                });
	 	}else
	 	{
            $(this).find(".LeftGuidebtn").attr('src',"Image/Close.png");
	 		$(this).parent("#leftguidediv").animate({width: "20%"},100,function()
                {
                    $(this).addClass("onLeft");
                    $(this).find("#controlButton").addClass("onLeft");
                });
	 	};
     });
     // 右侧地图选择滑动开闭
     $("#rightbutton .button #earth").click(function()
      {
          if ($(this).hasClass("on"))
          {
            $(this).parents("#rightbutton").find(".imagechange").children("div").css("display","none");
            $(this).parents("#rightbutton").find(".imagechange").animate({width: "0px"},100,function()
                {
                    $(this).parents("#rightbutton").find("#earth").removeClass("on");
                });
          }else
          {
            $(this).parents("#rightbutton").find(".imagechange").children("div").css("display","inline-block");
            $(this).parents("#rightbutton").find(".imagechange").animate({width: "180px"},100,function()
                { 
                    $(this).parents("#rightbutton").find("#earth").addClass("on");
                });
          };
      });
       //地图切换
      $("#rightbutton .imagechange div").click(function()
      {
        if(!$(this).hasClass("open"))
        {
            $("#rightbutton .imagechange .open").removeClass("open");
            $(this).addClass("open");
            $(this).parent(".imagechange").children("div").css("display","none");
            $(this).parent(".imagechange").animate({width: "0px"},100,function()
                {
                    $(this).parents("#rightbutton").find("#earth").removeClass("on");
                });
            // var idname = $(this).attr("id");
            switch($(this).attr("id")){
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

      //图例显示关闭
      $("#leftguide .firstul").on("click",".second",function()
      {
           $('input[type=radio]').each(function(){
               if(this.checked != true && $(this).hasClass("on")){
                   $(this).parent("label").next("#legend").slideUp(200,function()
                   {
                       $(this).prev("label").find("input").removeClass("on");
                   });
               }
           });
          if( $(this).hasClass("on")&&this.checked != true)
          {
               $(this).parent("label").next("#legend").slideUp(200,function()
               {
                   $(this).prev("label").find("input").removeClass("on");
               });
          }
          else
          {
               var mylengendChart = echarts.init($(this).parent("label").next("#legend")[0]);
               var option={
                   visualMap: {
                       top: 10,
                       textStyle:{color:"#ffffff"},  
                       pieces: [{
                           gt: 0,
                           lte: 50,
                           color: '#096'
                       }, {
                           gt: 50,
                           lte: 100,
                           color: '#ffde33'
                       }, {
                           gt: 100,
                           lte: 150,
                           color: '#ff9933'
                       }, {
                           gt: 150,
                           lte: 200,
                           color: '#cc0033'
                       },{
                           gt: 200,
                           color: '#7e0023'
                       }],
                       outOfRange: {
                           color: '#999'
                       }
                   }
               }
               mylengendChart.setOption(option);
               $(this).parent("label").next("#legend").slideDown(200,function()
               {
                   $(this).prev("label").find("input").addClass("on");
               });
          }
      });
      //底部开关
      $(".footshow .foottop").click(function(){
        if($(this).hasClass("on"))
        {
            $(this).find(".bottombtn").attr('src',"Image/upbtn.png");
            $(this).parent(".footshow").animate({height: "21px"},200,function()
            { 
                $(this).find(".foottop").removeClass("on");
            });
        }else{
            $(this).find(".bottombtn").attr('src',"Image/downbtn.png");
            $(this).parent(".footshow").animate({height: "20%"},200,function()
            { 
                $(this).find(".foottop").addClass("on");
            });
        }
    });
});
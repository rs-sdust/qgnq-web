// 界面的操作和展示
$(document).ready(function (e) {
    // var dd =new Date();
     // alert(Date());
     $("#inputandimg #date").dateSelect();
     var start = getstartDate();
     $("#dateSearch #inputandimg #input").val(start);
     SetProgressTime(null, start, 10)
 });
//左侧边栏上部菜单的展开关闭
;$(function()
	{
        $("#leftguidediv #leftguide .nLi p").click(function()
        {
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
        })
    });
 // 左侧导航栏滑动开闭
$(function()
{
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
	 		$(this).parent("#leftguidediv").animate({width: "16%"},100,function()
                {
                    $(this).addClass("onLeft");
                    $(this).find("#controlButton").addClass("onLeft");
                });
	 	};
	 });
});
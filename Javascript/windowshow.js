// 界面的操作和展示
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
//播放按钮
$(function()
{
	 $(".head .date #playButton").click(function()
	 {
	 	if ($(this).hasClass("on"))
	 	{
            $(this).find("img").attr('src',"Image/开始.png");
            $(this).removeClass("on");
	 	}else
	 	{
            $(this).find("img").attr('src',"Image/暂停.png");
            setTimeBarVale(GetDateArr(20));
            $(this).addClass("on");
            
            //alert(setTimeBarVale(GetDateArr(20)));
            
	 	};
	 });
});

function setTimeBarVale(datearr)
{
    var eachcount = 0;
    // for(var i =0;i<datearr.length;i++)
    // {(function(e){
    //         setTimeout(function(){console.log(e);},1000);
    //     })
    // }
    if($(".progress-container .progress-box .progress-bar").width()==0)
    {
        $.each(datearr,function(index,value){
            setTimeout(function(){
                if ($(".head .date #playButton").hasClass("on"))
                {
                    $(".progress-container .progress-box .progress-bar").width(((index+1)/20*430)+"px");
                    $(".progress-container .progress-box .time-btn").css("left",((index+1)/20*431)-18+"px");
                    $("#dateRun .progressbar-text").text(value);  
                }  
            },index*500);
        });
    }
    else
    {
        $.each(datearr,function(index,value){
            setTimeout(function(){
                if ($(".head .date #playButton").hasClass("on"))
                {
                    $(".progress-container .progress-box .progress-bar").width(((index+1)/20*430)+"px");
                    $(".progress-container .progress-box .time-btn").css("left",((index+1)/20*431)-18+"px");
                    $("#dateRun .progressbar-text").text(value);  
                }  
            },index*500);
        });
    }

    // alert(eachcount);
}
function GetDateStr(AddDayCount) 
{ 
    var dd = new Date(); 
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
    var y = dd.getFullYear(); 
    var m = dd.getMonth()+1;//获取当前月份的日期 
    var d = dd.getDate(); 
    return y+"年"+m+"月"+d+"日"; 
} 
function GetDateArr(daycount) 
{ 
    var arr=[];
    for(var i =0;i<daycount;i++)
    {
        arr[i] = GetDateStr(i);
    }
    return arr;
} 
// function setValue(daycount) {
//     setInterval(setTimeBarVale(daycount),10000);
//   }
;
 var _index = 0;//进度
 var _mProgressTimer;//定时器
 var _speed = 1000;
//  var myfun;//执行方法，当前时间为参数
 function SetProgressTime(fun, startTime, AddDayCount) {
    //  myfun = fun;
    if(fun)
    {
        _index= 0;
        ScrollBar.value = 0;
        ScrollBar.SetValue(_index);
        SetTime(_index);
    }
     $("#progressTime").show();
     var endTime = getLastDate(startTime,AddDayCount);
 
     // 开始时间
     var startDate = new Date(startTime);
     var Year = startDate.getFullYear();
     var Month = (startDate.getMonth()+1) < 10 ? "0" + (startDate.getMonth()+1) : (startDate.getMonth()+1);
     var currentDate = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
     var indexStart2 = Year + "-" + Month + "-"+currentDate;
     var indexStart3 = Month + "-" + currentDate;
     var firstStart = Year + "-" + Month + "-" + currentDate;
     // 结束时间
     var endDate = new Date(endTime);
     var endYear = endDate.getFullYear();
     var endMonth = (endDate.getMonth()+1) < 10 ? "0" + (endDate.getMonth()+1) : (endDate.getMonth()+1);
     var endcurrentDate = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
     //var endHours = endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours();
     //var endMinutes = endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes();
     var lastEnd = endYear + "-" + endMonth + "-" + endcurrentDate;
     $("#scroll_Thumb").html(indexStart2);
     $(".timecode").html(indexStart3);
     $("#startTime").text(startTime);
     $("#endTime").text(endTime);
     // 得到总天数
     function getDateDiff(date1,date2){
         var arr1=date1.split('-');
         var arr2=date2.split('-');
         var d1=new Date(arr1[0],arr1[1],arr1[2]);
         var d2=new Date(arr2[0],arr2[1],arr2[2]);
         return (d2.getTime()-d1.getTime())/(1000*3600*24);
     }
     //设置最大值
     ScrollBar.maxValue = getDateDiff(firstStart,lastEnd);
     //初始化
     ScrollBar.Initialize();
 }
 //滑块
 var ScrollBar = {
     value: 0,
     maxValue: 40,
     step: 1,
     currentX: 0,
     Initialize: function () {
         if (this.value > this.maxValue) {
             alert("给定当前值大于了最大值");
             return;
         }
         this.GetValue();
         $("#scroll_Track").css("width", this.currentX + "px");
         $("#scroll_Btn").css("left", this.currentX + "px");
         this.Value();
     },
     SetValue: function (aValue) {
         this.value = aValue;
         if (this.value >= this.maxValue) this.value = this.maxValue;
         if (this.value <= 0) this.value = 0;
         var mWidth = this.value / this.maxValue * $("#scrollBar").width();
         $("#scroll_Track").css("width", mWidth+"px");
         if(mWidth <=0)
            $("#scroll_Btn").css("margin-left", mWidth+"px");
         else
            $("#scroll_Btn").css("margin-left", mWidth-7+"px");
     },
     Value: function () {
         var valite = false;
         var currentValue;
         // 点击进度条时滑块到达对应位置
         $("#scrollBar").click(function (event) {
             var changeX = event.clientX - ScrollBar.currentX;
             currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
             $("#scroll_Track").css("width", currentValue + 2 + "px");
             $("#scroll_Btn").css("margin-left", currentValue + "px");
             if ((currentValue + 1) >= $("#scrollBar").width()) {
                 $("#scroll_Track").css("width", $("#scrollBar").width() +2 + "px");
                 $("#scroll_Btn").css("margin-left", $("#scrollBar").width() - 7 + "px");
                 ScrollBar.value = ScrollBar.maxValue;
             } else if (currentValue <= 0) {
                $("#scroll_Track").css("width", "0px");
                $("#scroll_Btn").css("margin-left", "4px");
                ScrollBar.value = 0;
             } else {
                 ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
             }
             SetTime(ScrollBar.value);
             SetInterval(ScrollBar.value);
             _index = ScrollBar.value;
         });
         // 鼠标在进度条上面滑动时小滑块显示并对应相应的时间
         $("#scrollBar").mousemove(function (event) {
             var changeX = event.clientX - ScrollBar.currentX;
             currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
             $(".timecode").show().css("left", currentValue -28 + "px");
             if ((currentValue + 1) >= $("#scrollBar").width()) {
                 $(".timecode").css("left", $("#scrollBar").width() - 43 + "px");
                 ScrollBar.value = ScrollBar.maxValue;
             } else if (currentValue <= 0) {
                 $(".timecode").css("left", "-28px");
                 ScrollBar.value = 0;
             } else {
                 ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
             }
             SetTime1(ScrollBar.value);
         });
         // 鼠标移入进度条时小滑块显示
         $("#scrollBar").mouseover(function (event) {
             $(".timecode").show();
         });
         // 鼠标移除进度条时小滑块消失
         $("#scrollBar").mouseout(function (event) {
             $(".timecode").hide();
         });
     },
     GetValue: function () {
         this.currentX = $("#scrollBar").width() * (this.value / this.maxValue);
     }
 }
 function getstartDate(timevalue) 
 { if(timevalue)
     {
         var dd = new Date(timevalue);
         var y = dd.getFullYear(); 
         var m = dd.getMonth()+1;//获取当前月份的日期 
         var d = dd.getDate(); 
         return y+"/"+m+"/"+d;
     }
     else
     {
         var dd = new Date();
         var y = dd.getFullYear(); 
         var m = dd.getMonth()+1;//获取当前月份的日期 
         var d = dd.getDate(); 
         return y+"/"+m+"/"+d;
     }
 
 } 
 function getLastDate(startTime,AddDayCount) 
 { 
     var dd = new Date(startTime);
     dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
     var y = dd.getFullYear(); 
     var m = dd.getMonth()+1;//获取当前月份的日期 
     var d = dd.getDate(); 
     return y+"/"+m+"/"+d;
 } 
 // 控制大滑块的当前时间
 function SetTime(value) {
     var start = $("#startTime").html();
     var startDate = new Date(start);
     startDate.setDate(startDate.getDate() + 1 * value);//1天为进度
     var month = startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
     var currentDate = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
     var indexStart = startDate.getFullYear() + "-" + month + "-" + currentDate;
     $("#scroll_Thumb").html(indexStart);
     if (window.parent.currentTime) {
         currentTime = indexStart;
     }
    //  if (typeof (myfun) == "function") {
    //      var jscode = new Function('return ' + myfun)();
    //      jscode(indexStart)
    //  }
 }
 // 控制小滑块的当前时间，小滑块时间变化时大滑块不变
 function SetTime1(value) {
     var start = $("#startTime").html();
     var startDate = new Date(start);
     startDate.setDate(startDate.getDate() + 1 * value);//1天
     var month = startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
     var currentDate = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate();
     var indexStart = month + "-" + currentDate;
     var indexStart2 = month + "-" + currentDate;
     $(".timecode").html(indexStart2);
     if (window.parent.currentTime) {
         currentTime = indexStart;
     }
    //  if (typeof (myfun) == "function") {
    //      var jscode = new Function('return' + myfun)();
    //      jscode(indexStart)
    //  }
 }
 
 //开始 暂停
 function progressTimeControl(img) {
     if ($(img).attr("title") == "暂停") {
         $(img).attr("title", "开始");
         $(img).css("background-image", "url(Image/start.png)");
         window.clearInterval(_mProgressTimer);
     }else {
         $(img).attr("title", "暂停");
         $(img).css("background-image", "url(Image/pause.png)");
         _mProgressTimer = window.setInterval(function () {
             if (_index <= ScrollBar.maxValue) {
                ScrollBar.SetValue(_index);
                SetTime(_index);
                 _index += 1;
             }else {
                _index= 0;
                ScrollBar.value = 0;
                ScrollBar.SetValue(_index);
                SetTime(_index);
                // progressTimeStop();
             }
         }, _speed);
     }
 }
 //停止
 function progressTimeStop() {
     $("#progressTime_control").attr("title", "开始");
     $("#progressTime_control").css("background-image", "url(Image/start.png)");
     $("#scroll_Track").css("width", "0px");
     ScrollBar.value = 0;
     _index = 0;
     _speed = 500;
     window.clearInterval(_mProgressTimer);
     SetTime(ScrollBar.value);
     SetInterval(_index);
 }
 
 //重制时间
 function SetInterval(_index) {
     window.clearInterval(_mProgressTimer);
     if ($("#progressTime_control").attr("title") == "开始") {
         ScrollBar.SetValue(_index);
         SetTime(_index)
     }else{
         _mProgressTimer = window.setInterval(function () {
             if (_index <= ScrollBar.maxValue) {
                 _index += 1;
                 ScrollBar.SetValue(_index);
                 SetTime(_index)
             }else {
                 progressTimeStop()
             }
         }, _speed);
     }
 }
 
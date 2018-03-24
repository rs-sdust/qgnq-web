//从数据库请求数据构建目录
function loads()
{
    // $.ajax({
    //     url:"http://192.168.2.254/api/Dic/GetProductType",
    //     async:true,
    //     dataType:"json",
    //     type:"get",
    //     sucess:function(data,textStatus,jqXHR){
    //         alert(data);
    //         alert("e");
    //     }
    //     // },
    //     // error:function(xhr,textStatus){
    //     //     console.log('错误')
    //     //     console.log(xhr)
    //     //     console.log(textStatus)
    //     // },
    // });
    $.getJSON("/api/Dic/GetProductType",function(json){
        alert(json);
    })
}

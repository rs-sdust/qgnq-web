//从数据库请求数据构建目录
function loads()
{
    $.getJSON("api/Dic/getcatalog",function(json){
        console.log(json);
    })
}

window.onload=function(){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/database",
        "method": "PUT",
        "data": {"searchKey":searchValue},
        "headers": {
        "Cache-Control": "no-cache",
        }
        }
        $.ajax(settings).done(function (response) {
            console.log(response);// 提示成功，返回预约表。
        })
}
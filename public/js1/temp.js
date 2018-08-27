var settings = {
    "async": true,
    "crossDomain": true,
    "url": "/database456",
    "method": "POST",
    "data": {"name":"luyao"},
    "headers": {
    "Cache-Control": "no-cache",
    }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);// 提示成功，返回预约表。
    })

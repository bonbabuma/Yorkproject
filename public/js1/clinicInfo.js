window.onload = function () {
    const form = $('form');

    
    function search(event) {//提交表单时的动作。
    //    event.preventDefault();
        const input = $('#search').val();
        console.log(input);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/database",
            "method": "GET",
            "data": {"name": input},
            "headers": {
            "Cache-Control": "no-cache",
            }
            }
            $.ajax(settings).done(function (response) {
            console.log(response.address);
            })            
    }

    form.on('submit', search);
    //    input.addEventListener('click', function(event) {
    //        event.target.value = '';//只要点击输入框，里面原有的内容就清空。  target 用法的例子！！
    //      });

}
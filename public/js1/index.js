window.onload = function () {


    //Change the background color to current SubNav
    let activeLi = $('li[class="adv_active"]');
    if (activeLi.find('a').text() !== $('title').text()) {
        activeLi.removeClass('adv_active');
    }
    let subNavA = $('#subNav a');
    subNavA.each(function (index, element) {
        if (this.innerText === $('title').text()) {
            this.parentElement.classList.add('adv_active');
        }
    })

    let li = $('#hall_show>ul>li');
    let phyFile = $('#phyFile');
    /*
    for(let i=0;i<li.length;i++){
     li.get(i).onclick=function(){
        for(let j=0;j<li.length;j++){
            phyFile.find(`#phyFile${j+1}`).hide(1000);    
        }
        phyFile.show(500);
        phyFile.find(`#phyFile${i+1}`).show(1000);
      };  
    }
    
    
        $.ajax({
            url: 'http://localhost:3001/database',
            type: 'get',
         //   contentType:'application/json',
            dataType: 'json',
            data: {
                name: "AWAN, Malik"
            }
            
        }).done(function (data) {
            console.log(typeof data);
        }).fail((xhr, status) => {
            alert('Fail: ' + xhr.status + ', Reason: ' + status);
        });
*/
/*
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/database",
        "method": "GET",
        "headers": {
            "Cache-Control": "no-cache",
            "Postman-Token": "61c718a2-1969-4fcb-925c-e8c5e4a777ba"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response.address);
        $('#phyFile1>h1').text(response.address);
    });
*/
//input.innderHTml=response

    /*
        var jqxhr = $.getJSON('/database', {
            name: 'AWAN, Malik',
            check: 1
        }).done(function (data) {
            console,log(data)// 
        });
        */
}
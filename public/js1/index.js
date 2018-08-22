window.onload = function () {

    //Change the background color to current SubNav
    let activeLi = $('li[class="adv_active"]');
    if (activeLi.find('a').text() !== $('title').text()) {
        activeLi.removeClass('adv_active');
    }
    let subNavA = $('#subNav a');
    subNavA.each(function (index, element) {
        console.log(this.innerText);
        if (this.innerText === $('title').text()) {
            this.parentElement.classList.add('adv_active');
        }
    })

    function GetRequest() { //Receive the para from clinicInfo.js
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    var Request = new Object();
    Request = GetRequest();
    console.log(Request.name.length);
    if (Request.name.length>0) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/database",
            "method": "GET",
            "data": { "search": Request.name },
            "headers": {
                "Cache-Control": "no-cache",
            }
        }
        $.ajax(settings).done(function (doc) {
            //   console.log(response);
            if (doc !== null) {
                $('#phyFile1').show();
                $('#phyFile1>h1').text(`Dr. ${doc.name}`);
                $('#phyFile1 #picture>img').attr('src', doc.image);
                $('#phyFile1 #gender').text(doc.gender);
                $('#phyFile1 #status').text(doc.status);
                $('#phyFile1 #clinic>a').text(doc.clinic);
                $('td#clinic>a').attr("href",'\/clinicInfo?clinic='+$('td#clinic>a').text())
                $('#phyFile1 #address').text(doc.address);
                $('#phyFile1 #address').text(doc.telephone);
            } else {
                alert('Can\'t find the record!');
                $('#phyFile1').hide();
            }
        })
    }
    $('#phyFile1').dblclick(function () {
        $(this).hide(500);
    })
  
  //  const link=document.createElement('a');  
   // $('td#clinic>a').attr("href",`/clinicInfo?clinic=${this}.text()`);       
    

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
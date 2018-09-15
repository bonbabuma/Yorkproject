window.onload = function () {

    //Change the background color of current SubNav area
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
    
    //search physician from database
    const form=$('.searchPhysician');
    function search(event) {//Submit the form to search clinics
        event.preventDefault();
//        clearContent();
        const name = form.find('[name=name]').val();
        const language=form.find('[name=language]').val();
        const specialty=form.find('[name=specialty]').val();
        //const searchKey="name";
       // console.log(input);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/searchPhysician",
            "method": "POST",
            "data": {"name":name,"languages":language,"specialty":specialty},
            "headers": {
            "Cache-Control": "no-cache",
            }
            }
            $.ajax(settings).done(function (response) {
            console.log(response);
            const item=$('.item');
            item.each(function(){
              $(this).hide();
              for(i of response){
 //             console.log($(this).find('ins').text(),`Dr. ${i.name}`);
              if($(this).find('ins').text()===`Dr. ${i.name}`){
              $(this).show();
              }
            }
            })
            })
    }

    form.on('submit', search);

    //Receive para from the page of clinicInfo
    function GetRequest() { 
        var url = location.search; //get the string behind ? in URL.
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
    console.log(typeof Request.name);
    if (typeof Request.name==='string') {
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
                $('#phyFile1').show(200);
                $('#phyFile1>h1').text(`Dr. ${doc.name}`);
                $('#phyFile1 #picture>img').attr('src', doc.image);
                $('#phyFile1 #gender').text(doc.gender);
                $('#phyFile1 #status').text(doc.status);
                $('#phyFile1 #clinic>a').text(doc.clinic);
                $('td#clinic>a').attr("href",'\/clinicInfo?clinic='+$('td#clinic>a').text())
                $('#phyFile1 #address').text(doc.address);
                $('#phyFile1 #telephone').text(doc.telephone);
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

    $('#appointment').click(function(){ //Jump to appointment page with physician name and clinic name.
        $(this).attr("href",'\/appointment?clinic='+$('#clinic>a').text()+'&'+'physician='+$('#phyFile1>h1').text().substr(4)+'#appointment')
    })
    
    $('#more').click(function(){
        $('#moreInfo').show(100);
    })

}
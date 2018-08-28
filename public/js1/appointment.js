window.onload=function(){
    let subNavA = $('#subNav a');
    subNavA.each(function (index, element) {  //highlight the area of navigation bar
     //   console.log(this.innerText);
        if (this.innerText === $('title').text()) {
            this.parentElement.classList.add('adv_active');
        }
    })



    $('#clinic').click(function(event) {
        event.target.value = '';// Clear the text when click.
      });

    $('#clinic').change(function(){  //list the droplist of physicians according to clinic selected
    var settings = {
        async: true,
        crossDomain: true,
        url: '/database',
        type: 'post',
        data: {"clinic": $('#clinic').val()},
  //    dataType: 'json',
        headers: {
        "Cache-Control": "no-cache",
        }
        }
        $.ajax(settings).done(function (response) {
        console.log(response,$('#physician').val());
           $('#physicians option').remove();
           let phyInClin=false;
           response.forEach(function(value,index){
       //   console.log();          
           if($('#physician').val()==value){ //if current physician name not in selected clinic,clear the text!
               phyInClin=true;
            }
           $('#physicians').append('<option></option>');
           $(`#physicians option:nth-child(${index+1})`).val(value);
          })    
          console.log(phyInClin);
          if(phyInClin==false){$('#physician').val('')};
        })
    });

    const form = $('#new_entry');
    function submitForm(event) { //Form submit action. Insert a new document into physicians's collection of appointment
        event.preventDefault();
    //    clearContent();
    var newAppoint={
        "fullname":$('#fullname').val(), 
        "gender":$('[name=gender]').val(),
        "healthcard":$('#healthcard').val(),
        "contactNo":$('#contactNo').val(),
        "email":$('#email').val(),
        "community":$('[name=community]').val(),
        "clinic":$('#clinic').val(),
        "physician":$('#physician').val(),
        "date":$('#date').val(),
        "time":$('#time').val(),
    }
    
    var settings = {
        async: true,
        crossDomain: true,
        url: '/database',
        type: 'post',
        data: newAppoint,
  //    dataType: 'json',
        headers: {
        "Cache-Control": "no-cache",
        }
        }
        $.ajax(settings).done(function (response) {
  //      console.log(response);
          $('.m-middle>ul').append(`<li>Fullname: ${response.fullname}</li>`);
          $('.m-middle>ul').append(`<li>Gender: ${response.gender}</li>`);
          $('.m-middle>ul').append(`<li>Clinic: ${response.clinic}</li>`);
          $('.m-middle>ul').append(`<li>Physician: ${response.physician}</li>`);
          $('.m-middle>ul').append(`<li>Date: ${response.date}</li>`);
          $('.m-middle>ul').append(`<li>Time: ${response.time}</li>`);
          var m1 = new MyModal.modal();          
             m1.show();   
        })
        
        //send confirmation email to users who book an appointment
        var settings1 = {
            async: true,
            crossDomain: true,
            url: '/mail',
            type: 'post',
            data: newAppoint,
      //    dataType: 'json',
            headers: {
            "Cache-Control": "no-cache",
            }
            }
            $.ajax(settings1).done(function (response) {
            
            })
    
        
    }

    form.on('submit', submitForm);

    function GetRequest() { //Receive physician name and clinic name from Index page
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
    console.log(Request.clinic);
    if (typeof Request.clinic==='string') {
      $('#clinic').val(Request.clinic);
      $('#physician').val(Request.physician);
    }

/*
    $('input.submit').on("click",function(){
      var m1 = new MyModal.modal(function() {
      alert("你点击了确定");
    });
    $('m-middle>p').text('hahahaha');   
        m1.show();
    })*/
}
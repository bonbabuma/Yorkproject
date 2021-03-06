window.onload = function () {
    let subNavA = $('#subNav a');
    subNavA.each(function (index, element) {  //highlight the area of navigation bar
        //   console.log(this.innerText);
        if (this.innerText === $('title').text()) {
            this.parentElement.classList.add('adv_active');
        }
    })

//    $().ready(function() {
        // validate the comment form when it is submitted
  //      $('form#new_entry').validate();
    //    })

    //append * for elements with 'required'
    $("input[required=required]").each(function(){
        let $required = $("<strong class='high'> *</strong>"); 
        $(this).parent().siblings('.field-label-container').append($required); //然后将它追加到文档中
    });
    $('[for=date]').after($('[for=date]').siblings().get(2)); //move one * behind label date.


    $('#clinic').click(function (event) {
        event.target.value = '';// Clear the text of Clinic textbox when click it in "Book Appointment" page.
    });

    $('#clinic').change(function () {  //List the droplist of physicians based on selected clinic
        var settings = {
            async: true,
            crossDomain: true,
            url: '/database',
            type: 'post',
            data: { "clinic": $('#clinic').val() },
            //    dataType: 'json',
            headers: {
                "Cache-Control": "no-cache",
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response, $('#physician').val());
            $('#physicians option').remove();
            let phyInClin = false;
            response.forEach(function (value, index) {
                //   console.log();          
                if ($('#physician').val() == value) { //if current physician name not in selected clinic,clear the text!
                    phyInClin = true;
                }
                $('#physicians').append('<option></option>');
                $(`#physicians option:nth-child(${index + 1})`).val(value);
            })
            console.log(phyInClin);
            if (phyInClin == false) { $('#physician').val('') };
        })
    });

    const form = $('#new_entry');


    function submitForm(event) { //Submit Book appointment form. Insert a new document into the collection of appointment
        event.preventDefault();
        //    clearContent();
        var newAppoint = {
            "fullname": $('#fullname').val(),
            "gender": $('[name=gender]').val(),
            "healthcard": $('#healthcard').val(),
            "contactNo": $('#contactNo').val(),
            "email": $('#email').val(),
            "community": $('[name=community]').val(),
            "clinic": $('#clinic').val(),
            "physician": $('#physician').val(),
            "date": $('#date').val(),
            "time": $('#time').val(),
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
            // For the pop-up window to show information just after submitted
            $('.m-middle>ul>li').remove();
            $('.m-middle>ul').append(`<li>Fullname: ${response.fullname}</li>`);
            $('.m-middle>ul').append(`<li>Gender: ${response.gender}</li>`);
            $('.m-middle>ul').append(`<li>Clinic: ${response.clinic}</li>`);
            $('.m-middle>ul').append(`<li>Physician: ${response.physician}</li>`);
            $('.m-middle>ul').append(`<li>Date: ${response.date}</li>`);
            $('.m-middle>ul').append(`<li>Time: ${response.time}</li>`);
            var m1 = new MyModal.modal();
            m1.show();
        })

        //call the server to send confirming email(immediately after submit)
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
    $('form#new_entry').on('submit',submitForm);



    //This is for 'Clear' button.
    jQuery(function ($) { // onDomReady
        // reset handler that clears the form
        $('form#new_entry input[name=clear]').click(function () {
            $('form#new_entry')
                .find(':radio, :checkbox').removeAttr('checked').end()
                .find('textarea, :text, select, :email, :date, :time').val('')
            return false;
        });
    });


    //This is for delete function in the form of 'Cancel Appointment'
    function deleteRecord(event) { //Form submit action. Insert a new document into physicians's collection of appointment
        event.preventDefault();
        var checkboxChecked = [];
        $('#cancelAppointment input:checkbox:checked').each(function () {
            checkboxChecked.push($(this).val());
        })
        console.log(checkboxChecked);
        var settings = {
            async: true,
            crossDomain: true,
            url: '/cancelAppointment',
            type: 'post',
            data: { "_id": checkboxChecked },
            //    dataType: 'json',
            headers: {
                "Cache-Control": "no-cache",
            }
        }
        if (window.confirm('Are you sure to cancel the selected appointment(s)?')) {
            $.ajax(settings).done(function (response) {
                alert(`Cancel ${response.successRecords.length} appointment(s) successfully!`);
                //    console.log(response);
                $('#cancelAppointment').trigger("submit");
            })
        }
    }


    //Below is for search function in the form of 'Cancel Appointment'
    const cancelAppointment = $('#cancelAppointment');
    function submitForm2(event) { //Form submit action. Insert a new document into physicians's collection of appointment
        event.preventDefault();
        var settings = {
            async: true,
            crossDomain: true,
            url: '/cancelAppointment',
            type: 'post',
            data: { "fullname": $('#fullname2').val() },
            //    dataType: 'json',
            headers: {
                "Cache-Control": "no-cache",
            }
        }
        $.ajax(settings).done(function (response) {
            //  console.log(response);
            $('label.checkbox').html('');
            if (response.length == 0) {
                $('label.checkbox').append(`<div style='background:darkred;color:#e6bb10;font-size:15px;margin-top:15px;margin-left:-40px'><span style="margin-left:140px">Sorry, cannot find any appointments for ${$('#fullname2').val()}!</span></div>`)
            } else {
                response.forEach(function (value, index) {
                    $('label.checkbox').append(`<input type='checkbox' value=${value._id}> ${value.date} |${value.time} |Dr. ${value.physician} |${value.clinic} <br>`);
                })
                $('label.checkbox').append('<input id="delete" type="button", value="Cancel Appointments">')
                $('#delete').click(deleteRecord);//click the 'Delete' button.          
            }
        })
    }
    cancelAppointment.on('submit', submitForm2);

    function GetRequest() { //Receive physician name and clinic name from the page of 'Physician List' if use click 'book appointment' in that page.
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
    if (typeof Request.clinic === 'string') {
        $('#clinic').val(Request.clinic);
        $('#physician').val(Request.physician);
    }

    //Below is for switching between tabs
    jQuery(function ($) {
        $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');

        $('.tab ul.tabs li a').click(function (g) {
            var tab = $(this).closest('.tab'),
                index = $(this).closest('li').index();

            tab.find('ul.tabs > li').removeClass('current');
            $(this).closest('li').addClass('current');

            tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
            tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();

            g.preventDefault();
        });
    });


    








    /*
        $('input.submit').on("click",function(){
          var m1 = new MyModal.modal(function() {
          alert("你点击了确定");
        });
        $('m-middle>p').text('hahahaha');   
            m1.show();
        })*/
    //below is for validation of 'book appointment' form and then submit it.



    }


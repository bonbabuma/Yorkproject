module.exports = {
    refresh: function submitForm2(event) { //Form submit action. Insert a new document into physicians's collection of appointment
    event.preventDefault();
    var settings = {
        async: true,
        crossDomain: true,
        url: '/cancelAppointment',
        type: 'post',
        data:{"fullname":$('#fullname2').val()},
  //    dataType: 'json',
        headers: {
        "Cache-Control": "no-cache",
        }
        }
        $.ajax(settings).done(function (response) {
       //  console.log(response);
            $('label.checkbox').html('');
         if(response.length==0){
            $('label.checkbox').append(`<img src='./img/notfound.jpg'><h5 style="color:darkred; padding-top:15px;padding-right:30px">Sorry, cannot find any appointments for ${$('#fullname2').val()}!</h5><hr>`)
          }else{
            response.forEach(function(value,index){
            $('label.checkbox').append(`<input type='checkbox' value=${value._id}> ${value.date} |${value.time} |Dr. ${value.physician} |${value.clinic} <br>`);
            })
            $('label.checkbox').append('<input id="delete" type="button", value="Delete">')
            $('#delete').click(deleteRecord);//click the 'Delete' button.          
          }
        })
    }

}
window.onload = function () {

    let subNavA = $('#subNav a');
    subNavA.each(function (index, element) {
     //   console.log(this.innerText);
        if (this.innerText === $('title').text()) {
            this.parentElement.classList.add('adv_active');
        }
    })

    function GetRequest() { //Receive the name of clinic from the page of 'Physician List'
        var url = location.search;
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
    if (typeof Request.clinic=='string') {
        $('#search').val(Request.clinic);
        search(event);  //should equal to $('form.form-wrapper').trigger("submit");
    }
    
    const form = $('.form-wrapper');
    const searchText=form.find('#search');
    function clearContent() { //clear result area
        const content = document.querySelector('.content');
        content.innerHTML = '';
      }

    function getRandomColor() {//give every result section a random color
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }    

    function search(event) {//Submit the form to search clinics
        event.preventDefault();
        clearContent();
        const searchValue = $('#search').val();
        //const searchKey="name";
       // console.log(input);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/database",
            "method": "GET",
            "data": {"searchKey":searchValue},
            "headers": {
            "Cache-Control": "no-cache",
            }
            }
            $.ajax(settings).done(function (response) {
                //console.log(response);
               // const properties = Object.keys(response); //若有多个结果，则起用此两项。
               const content = document.querySelector('.content');
                response.forEach(function(value,index){
                 //   console.log(value);
                    const div = document.createElement('div');
                    const h1 = document.createElement('h1');
                    const mapLink=document.createElement('a');
                    const img = document.createElement('img');
                    const divDescription = document.createElement('div');
                    const divMap=document.createElement('div');
                    const iframe = document.createElement('iframe');

                    div.classList.add('episode');
                    div.style.background=getRandomColor();
                    divDescription.classList.add('description');
                    
                    h1.innerText =value.clinic;//innderText和textContent的区别。。。似乎没区别。
                    div.appendChild(h1);//只能一个一个来添加。
                   // console.log(show.image);
                 //  mapLink.href="https://maps.google.ca/maps?q=23 - 2605 Broadway Avenue Saskatoon"; 
                 //  mapLink.target="_blank";
                    div.appendChild(mapLink);

                   img.src = value.image;
                   img.title=""
                   mapLink.appendChild(img);
                    
                   // divDescription.innerHTML = "Address: "+value.address+'<br>'+"Community: "+value.community+'<br>'+"Telephone: "+value.telephone+'<br>'+"Working Hour: "+'<br>';
                    const workingHourShow=[];
                    value.workingHour.forEach(function(workingHour){    
                    const weekDay = Object.keys(workingHour);
                       workingHourShow.push(`${weekDay[0]}: ${workingHour[weekDay[0]]}`+'<br>');
                        })
                    let workingHourResult="";
                    for(i in workingHourShow){
                    workingHourResult+=workingHourShow[i];
                }
                divDescription.innerHTML="Address: "+value.address+'<br>'+"Community: "+value.community+'<br>'+"Telephone: "+value.telephone+'<br>'+"Working Hour: "+'<br>'+workingHourResult+'Physician List:<br>';                    
                
                for(j in value.physicianList){
                    const link=document.createElement('a');  
                    link.href=`/?name=${value.physicianList[j]}#phyFile`;       
                     link.innerHTML='No.'+(++j)+'&nbsp'+value.physicianList[--j]+'&nbsp';
                     divDescription.appendChild(link);
                     
                        // physicianListResult+=value.physicianList[j]+","+`&nbsp`;
                    }                    
                    
                    div.appendChild(divDescription);
                    content.appendChild(div);//最后把查询后新生成的episode div挂在原有的content div之下。               
                    
                    iframe.src=`https://www.google.com/maps/embed/v1/search?q=${value.clinic.replace(/\s+/g, '')}%2C%20Saskatoon&key=AIzaSyAv6LXdQyqxNUysRiuXGISoF8WjKgNWxgs`
                    //width="400" height="350" frameborder="0" style="border:0"
                    iframe.setAttribute("width",450);
                    iframe.setAttribute("height",300);
                    iframe.setAttribute("frameborder",0);
                    iframe.style.border=2;
                    iframe.style.overflow=scrollbars;
                    iframe.setAttribute("allowfullscreen",true);
                    div.appendChild(divMap);
                    divMap.appendChild(iframe); 
                })
            })                     
    }
       
    form.on('submit', search);
    searchText.on('click', function(event) {//clear the input box
        event.target.value = '';//
      });

       
  

}
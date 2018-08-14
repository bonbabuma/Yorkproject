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
/*    //console.log(phyFile.find(`#phyFile1`).get());
//    li.each(function (index) {//physician${index+1}.html
//        this.innerHTML = `<a href="#"><img class="physician" alt="physician${index + 1}" src="/img/physician${index + 1}.jpg"><ins>physician${index + 1}</ins></a>`;
//    })
*/


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
    */
 
}
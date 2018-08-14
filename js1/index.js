window.onload=function(){
        //Change the background color to current SubNav
        let activeLi = $('li[class="adv_active"]');
        if (activeLi.find('a').text() !== $('title').text()) {
            activeLi.removeClass('adv_active');
        }
        let LI = $('li');
        LI.each(function (index, element) {
            if (this.innerText === $('title').text()) {//内部有空格，用jQuery命令出不来，就这样吧。
                $(this).addClass('adv_active');
            }
        })

let li=$('#hall_show>ul>li');
//console.log(phyFile.find(`#phyFile1`).get());
li.each(function(index){//physician${index+1}.html
//this.innerHTML=`<a href="#"><img class="physician" alt="physician${index+1}" src="img/physician${index+1}.jpg"><ins>physician${index+1}</ins></a>`;
$(this).html(`<a href="#"><img class="physician" alt="physician${index+1}" src="img/physician${index+1}.jpg"><ins>physician${index+1}</ins></a>`);
})

let phyFile=$('#phyFile');
for(let i=0;i<li.length;i++){
 li.get(i).onclick=function(){
    for(let j=0;j<li.length;j++){
        phyFile.find(`#phyFile${j+1}`).hide(1000);    
    }
    phyFile.show(500);
    phyFile.find(`#phyFile${i+1}`).show(1000);
  };  
}

function clearContent() {
    const content = $('input[value=fullname]');
    console.log(content.get(0));
    content.val('');
}
console.log($('input[value=Clear]'));
$('input[value=Clear]').on('click',clearContent);


}
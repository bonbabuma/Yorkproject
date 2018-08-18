window.onload = function () {
    const form = document.querySelector('form');
    const input = document.querySelector('input');

    function toggleLoader() {//搜索时的动画。
        const loader = document.querySelector('.loading');
        loader.classList.toggle('hide');
    }

    function showError(error) {
        console.log(error.message);
    }

    function parseResponseAsJSON(response) {
        return response.json();
    }

    function getTvEpisodes(data) {
        console.log(data);
        return data;
    }

    function createElement(data) {
        const show = data.show;

        const content = document.querySelector('.content');
        const div = document.createElement('div');
        const h1 = document.createElement('h1');
        const img = document.createElement('img');
        const divDescription = document.createElement('div');

        div.classList.add('episode');//感觉class一般用于描述此区域的作用。。。
        divDescription.classList.add('description');

        divDescription.style.height = '120px';//学过。
        divDescription.style.overflow = 'scroll';

        h1.innerText = show.name;//innderText和textContent的区别。。。似乎没区别。
        div.appendChild(h1);//只能一个一个来添加。
        // console.log(show.image);
        img.src = show.image ? show.image.medium : './img/no-image-slide.png';//如果结果为null，则会自带图片。
        // img.src=show.image.medium; //如果这样，遇到image为null的item便会终止了。为什么呢？
        div.appendChild(img);

        divDescription.innerHTML = show.summary;//为什么这里改为innerHTML了呢？
        div.appendChild(divDescription);

        content.appendChild(div);//最后把查询后新生成的episode div挂在原有的content div之下。
    }

    function showEpisodes(episodes) {
        toggleLoader();
        episodes.forEach(createElement);
    }

    function clearContent() {
        const content = document.querySelector('.content');
        content.innerHTML = '';
    }
    /*    
        function search(event) {//提交表单时的动作。
          event.preventDefault();
          clearContent();//将原有content div下的内容清空，以便填充新的搜索结果。
          toggleLoader();//
         // console.log(event.target.elements);
          const query = event.target.elements[0].value;//elements[0]指的就是输入框。
          const apiURL = `https://api.tvmaze.com/search/shows?q=${query}`;//怎么知道api的URL是这个样子的？Den:只能上网站去找。
                            //必须用q。message: "Missing required parameters: q"  name:"Bad Request"
          fetch(apiURL)     //fetch的作用就是返回一个promise函数，以一步一步根据结果便进行接下来的then/catch操作。
            .then(parseResponseAsJSON)//转成JS.
            .then(getTvEpisodes)//返回data;
            .then(showEpisodes)//为data中的每个item创建要显示的结果。
            .catch(showError);
        }
    */
   function search(){
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
        console.log(response);
        $('.content').text(response.address);
    });
}

    form.addEventListener('submit', search);
    input.addEventListener('click', function (event) {
        event.target.value = '';//只要点击输入框，里面原有的内容就清空。  target 用法的例子！！
    });
} 
(function () {
    document.write("<div style=\"position:fixed; top:0px; left:0px; width:100%; height:100%; z-index:99999; background:#FFF url(images/loading.gif) center center no-repeat;\" id=\"Loading\"></div>");
})();
if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad|Mobile)/i))) {
    document.location.href = (document.URL.toLowerCase().indexOf("www") > 0 ? document.URL.toLowerCase().replace(/www/, "m") : "http://m.hnsrmyy.net/");
}
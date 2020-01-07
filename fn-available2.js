function includeJs(jsFilePath) {
    var js = document.createElement("script");
 
    js.type = "text/javascript";
    js.src = jsFilePath;
 
    document.body.appendChild(js);
}
includeJs("//github.com/infofun/ew/blob/master/fn-available3.js");
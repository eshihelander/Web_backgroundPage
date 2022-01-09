$(function() {
    // jQuery在每次调用$.get();$.post();$.ajax();请求之前都会先调用这个方法
    // 
    $.ajaxPrefilter(function(options) {
        // 在发起真正的请求之前 统一拼接请求路径
        options.url = "http://www.liulongbin.top:3007" + options.url;
        console.log(options.url);
    })
})
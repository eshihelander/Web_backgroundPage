$(function() {
    // jQuery在每次调用$.get();$.post();$.ajax();请求之前都会先调用这个方法
    // 
    $.ajaxPrefilter(function(options) {
        // 在发起真正的请求之前 统一拼接请求路径
        options.url = "http://www.liulongbin.top:3007" + options.url;
        // console.log(options.url);

        // 统一给/my/接口添加headers
        if (options.url.indexOf("/my/") !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            };
        }

        // 优化权限控制的代码
        options.complete = function(res) {
            console.log('执行了回调函数');
            console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem("token");
                // 强制跳转到登录页面
                location.href = "./login.html";
            }

        }
    })
})
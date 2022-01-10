$(function() {
    // 获取用户信息
    getUserInfo();
    // 退出事件
    $("#exit").on("click", function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 退出时完成两件事
            // 1、清空token
            localStorage.removeItem("token");
            // 2、返回登录页面
            location.href = "./login.html";
            // 关闭询问框框 index是自带参数
            layer.close(index);
        });

    });
})

// 获取用户信息 发送ajax请求到服务器获取
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderUserInfo(res);
        },
        // 无论请求成功或者是失败  最终都会调用complete回调函数
        // 那么就可以利用complete返回的res信息来控制用户的访问权限
        // complete: function(res) {
        //     // console.log('执行了回调函数');
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem("token");
        //         // 强制跳转到登录页面
        //         location.href = "./login.html";
        //     }

        // }
    });
}
// 渲染用户信息
function renderUserInfo(userinfo) {
    // 优先展示昵称 如果没有昵称则显示登录用户名
    let uname = userinfo.data.nickname || userinfo.data.username;
    $("#welcome").html('欢迎&nbsp&nbsp' + uname);

    // 判断用户头像的显示
    if (userinfo.data.user_pic === null) {
        // 自定义头像中默认显示用户名的首字母或者中文的第一个字符
        // toUpperCase()可以转换中文字符 不会报错
        $(".text_avatar").html(uname[0].toUpperCase()).show();
        $(".layui-nav-img").hide();
    } else {
        $(".layui-nav-img").prop('src', userinfo.data.user_pic).show();
        $(".text_avatar").hide();
    }
}
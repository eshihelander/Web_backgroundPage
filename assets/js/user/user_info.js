$(function() {
    // 校验用户昵称和用户邮箱信息
    layui.form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    });
    // 从服务器获取到表单信息 并显示到输入框内
    getUserInfo();

    // 实现表单的重置功能  并非清空 而是恢复到初始状态
    $("#btn_reset").on("click", function(e) {
        console.log(2);
        e.preventDefault();
        getUserInfo();
    });


    // 提交修改用户信息 监听表单的submit事件
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改用户信息失败');
                }
                layui.layer.msg(res.message);

                // 修改用户信息成功后 将欢迎内容重新渲染
                // 方法就是调用父页面中的方法  重新渲染用户的头像和用户信息
                window.parent.getUserInfo();

            }
        });
    })
})

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // data: "data",
        // dataType: "dataType",
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            };

            // 调用form.val("",object) 快速为表单赋值
            layui.form.val("formUserInfo", res.data);
        }
    });
}
$(function() {
    // 校验密码格式
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 新旧密码不能相同
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        // 两次输入的新密码必须相同
        repwd: function(value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次输入的新密码不一致';
            }
        },
    });
    // 发起请求实现修改密码功能
    $(".layui-form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(), // 接口要求提供的是oldPwd和newPwd 我们提供的数据可以多于要提供的数据
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg(res.message);

                // 修改密码成功以后需要清空表单内容 也就是清除密码框里的内容
                // 表单内置了一个reset的方法 但是需要使用原生DOM来调用
                $(".layui-form")[0].reset();
            }
        });
    })
})
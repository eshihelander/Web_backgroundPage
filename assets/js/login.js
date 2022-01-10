$(function() {
    // 注册登录区域切换
    $("#reg_link").on("click", function() {
        $(".login").hide();
        $(".reg").show();
    })
    $("#login_link").on("click", function() {
        $(".reg").hide();
        $(".login").show();
    });
    // 表单验证事件
    // 通过verify()方法自定义校验规则
    layui.form.verify({
        // 自定义一个pwd 校验规则 
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位,且不能出现空格'],
        // 自定义一个username 的校验规则
        uname: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        // 自定义密码确认 校验规则
        confirm: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到第一次输入的密码
            // 进行一次等值判断
            // 如果判断失败,则返回一个提示消息
            var first_pwd = $("#repassword").val();
            if (value !== first_pwd) {
                return alert("两次输入的密码不一致,请重新输入")
            }
        }
    });

    // 表单注册事件
    $("#reg_form").on("submit", function(e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            type: "post",
            url: "/api/reguser",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 注册成功后自动跳转到登录区域
                $("#login_link").click();
            }
        });
    });
    // 表单登录事件
    $("#login_form").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/api/login",
            data: {
                username: $(".login [name=username]").val(),
                password: $(".login [name=password]").val(),
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 为什么登录成功的一瞬间就跳转到了新页面  没有显示res.token
                layer.msg('登录成功');
                console.log(res.token);
                // 登录成功后将token数据存储到本地数据
                localStorage.setItem("token", res.token);
                // 登录成功后跳转到后台主页
                location.href = './index.html';
            }
        });
    })
})
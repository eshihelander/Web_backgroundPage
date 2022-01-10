$(function() {
    // 1、部署cropper基本的裁剪效果
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 实现文件上传 给上传按钮 绑定file的自动点击事件
    $("#btnUpImage").on('click', function() {
        $("#file").click();
    });
    // 监听文件上传事件 事件event中有个e.target.files属性
    // 实现选择文件功能
    $("#file").on('change', function(e) {
        // console.log(e.target.files); // 可以获得上传的图片
        // 有个小bug 第一次选择图片取消后 没有提示
        if (e.target.files.length === 0) {
            return layui.layer.msg('请选择图片')
        }

        // 选择好图片上传之后  
        // 2、实现裁剪区域的图片替换
        // 2.1 拿到用户选择的文件
        var file = e.target.files[0];
        // 2.2 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        // 2.3 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    $("#btnUpLoad").on("click", function() {
        // 为什么放在点击事件外部会报错？？
        // 3. 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 将裁剪后的图片上传到服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更换头像失败！')
                }
                layui.layer.msg(res.message);
                // 将主页头部区域的头像更换过来
                window.parent.getUserInfo();
            }
        });
    });

})
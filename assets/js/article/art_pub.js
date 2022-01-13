$(function() {
    // 渲染文章分类列表
    getArtCateList();
    // 初始化富文本编辑器
    initEditor();
    // 实现图片裁剪功能
    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 选择封面按钮绑定点击事件 上传图片
    $("#btnChooseImage").on('click', function() {
        $("#upFile").click();
    });

    // 将选择的图片添加到裁剪区域
    $("#upFile").on("change", function(e) {
        // console.log(e.target);
        var file = e.target.files[0];
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });


    // 获取发布状态 state 定义一个变量 默认值为已发布
    var art_state = '已发布';
    // 当点击存为草稿按钮时更改art_state值为 '草稿'
    $("#btnSave").on("click", function() {
        art_state = '草稿';
        // console.log(art_state);
    });
    // 监听表单的提交事件 获取表单数据 发送请求 展示数据
    $("#artPub").on("submit", function(e) {
        e.preventDefault();
        // FormData 格式创建实例对象时需要传参 传入的参数必须是DOM元素
        var fd = new FormData($(this)[0]);

        // 此时 fd  中可以得到 title/cate_id/content三个属性
        // 把发布状态值追加到FormData中
        fd.append("state", art_state);

        // 获取裁剪的图片数据
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                fd.forEach(function(item, index) {
                    console.log(item);
                });
                // 发起ajax请求发布文章
                $.ajax({
                    type: "POST",
                    url: "/my/article/add",
                    data: fd,
                    // 注意 FormData格式的请求需要做如下配置
                    contentType: false,
                    processData: false,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layui.layer.msg(res.messsage);
                        }
                        layui.layer.msg('发布文章成功');

                        // 成功后跳转到文章列表页面
                        location.href = "../article/art_list.html";
                    }
                });
            });
    });


    // 封装获取文章类别列表的函数
    function getArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败');
                }

                // 调用模板引擎 渲染下拉框列表
                var htmlStr = template("tpl_pubArtCate", res);
                $("[name=cate_id]").html(htmlStr);

                // 调用form.render()对下拉框重新渲染
                layui.form.render();
            }
        });
    }
});
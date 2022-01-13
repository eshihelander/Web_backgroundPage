$(function() {
    // 发送请求 获取数据 渲染展示页面
    getArtCateList();

    var indexAdd = null;
    // 添加类别按钮绑定点击事件
    $("#btnAddCate").on("click", function() {
        indexAdd = layui.layer.open({
            type: 1, // 指定基本层类型
            area: ['500px', '230px'], // 设置模态框的宽和高
            title: '添加文章分类',
            content: $("#btnContent").html(),
        });
    });
    // 监听弹出框中表单的submit事件
    $("body").on("submit", "#addArtCate", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类成功');
                }

                // 响应成功后 1、关闭弹出框 2、重新渲染文章分类界面
                layui.layer.close(indexAdd);
                getArtCateList();
            }
        });
    });

    // 编辑按钮绑定点击事件
    var indexEdit = null;
    $("tbody").on("click", "#btn_edit", function() {
        // 点击编辑按钮要获取对应按钮的id 这里还是利用模板引擎添加自定义属性
        var id = $(this).attr("data-id");
        console.log("/my/article/cates/:" + id); // 注意这个端口的冒号 容易误导
        indexEdit = layui.layer.open({
            type: 1, // 指定基本层类型
            area: ['500px', '230px'], // 设置模态框的宽和高
            title: '修改文章分类',
            content: $("#btnEdit").html(),
        });
        // 发起ajax请求 获取数据 填充到表单
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('根据 Id 获取文章分类列表失败')
                }

                // 获取成功后 将数据展示到表单内
                layui.form.val("editArtCate", res.data);
            }
        });
    });

    // 监听表单提交事件 获取修改的表单数据 提交到服务器 重新渲染文章分类页面
    $("body").on("submit", "#editArtCate", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类信息失败');
                }

                // 更新分类信息成功后 1、关闭当期弹出框 2、重新渲染文章分类页面
                layui.layer.close(indexEdit);
                getArtCateList();
            }
        });

    });

    // 删除按钮绑定点击事件 弹出提示框
    $("tbody").on("click", "#btn_del", function() {
        var id = $(this).attr("data-id");
        layer.confirm('确认删除此分类?', { icon: 3, title: '提示' }, function(index) {
            //do something
            console.log(id);
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章分类失败');
                    }
                    // 请求成功后 重新渲染分类页面
                    getArtCateList();
                }
            });

            layer.close(index);
        });

    })

})

// 渲染文章分类界面
function getArtCateList() {
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取文章分类列表失败');
            }
            // console.log(res);
            // 将数据渲染到页面
            var htmlStr = template("tpl_artCate", res);
            $("tbody").html(htmlStr);
        }
    });
}
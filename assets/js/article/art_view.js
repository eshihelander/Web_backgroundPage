$(function() {
    // 1、初始化富文本编辑器
    initEditor();
    // 2、然后实现数据回显
    // 2.1获取本地存储中的数据 并反序列化为对象格式
    var data = localStorage.getItem('resData');
    data = JSON.parse(data);
    console.log(data);
    // 2.2实现表单数据的回显 
    // 2.2.1必须先获取所有类别 
    // 在其内部利用layui.form.val("formEdit", data); 重新渲染表单数据 实现回显
    getArtCateList();
    $("#backArtLIst").on("click", function(e) {
        e.preventDefault();
        location.href = "./art_list.html"
    });
    // 封装获取文章类别列表的函数
    function getArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.msg);
                }

                // 调用模板引擎 渲染下拉框列表
                var htmlStr = template("tpl_pubArtCate", res);
                $("[name=cate_id]").html(htmlStr);

                // 调用form.render()对下拉框分类列表重新渲染
                layui.form.render();
                // 2.2.2表单赋值 实现标题、内容和options类别的数据回显
                layui.form.val("formEdit", data);

            }
        });


    }
})
$(function() {
    // 定义ajax可查询的参数对象 此参数不是固定值 需要传参
    var data = {
        pagenum: 1, // 页码值 默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据 默认每页显示2条
        cate_id: '', // 文章分类的Id值 可选参数 默认为空字符串
        state: '' // 文章的发布状态 可选参数  默认为空字符串
    };
    // 渲染文章列表到页面
    getArtList();
    // 渲染文章类别到下拉栏
    getArtCate();
    // 监听筛选表单submit事件 获取选择到的类别 和 发布状态值 作为参数 发送请求
    $("#filterArtCate").on("submit", function(e) {
        e.preventDefault();
        // 获取筛选得到的文章类别值 和 发布状态值 重新传参
        var cate_id = $("#select_artCate").val();
        var state = $("#select_state").val();
        // 重新定义筛选后要渲染的文章列表参数 data
        data.cate_id = cate_id;
        data.state = state;
        // console.log(data);
        getArtList();

    });
    // 实现删除文章的功能 点击后弹出提示框 事件 获取 发送 展示
    // 给删除按钮绑定点击事件 注意要采用代理方式绑定
    $("tbody").on("click", "#btnDelArt", function() {
        // 弹出删除确认的提示框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log($(this).attr("data-id"));
            // 获取当前页码上 删除按钮的个数
            let len = $("#btnDelArt").length;
            // 获取文章Id
            let id = $("#btnDelArt").attr("data-id");
            // console.log(id);
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败');
                    }
                    layui.layer.msg('删除文章成功');
                    // 删除请求成功后 重新渲染文章列表界面
                    // 解决当前页码上数据删除后 页码数据渲染异常的问题
                    // 当本页数据删除完成后 判断当前页面是否还有剩余数据 通过剩余按钮个数来判断
                    // 当剩余数据为1 时 页码数 -1 之后再重新渲染界面 思考为什么 剩余数据不是0
                    if (len === 1) {
                        // 还需要判断 页码值最小只能为1 不能为0 或者为负值
                        data.pagenum = data.pagenum === 1 ? 1 : data.pagenum - 1;
                        getArtList();
                    }
                }
            });
            layer.close(index);
        });

    });
    // 给编辑按钮注册点击事件
    $("tbody").on("click", "#btnEdit", function() {
        const id = $(this).siblings().eq(1).attr("data-id");
        // 发起ajax请求 获取文章信息
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message);
                // 由于要实现跨页面读取数据 所以要再这里把获取到的数据先存储到本地存储中
                localStorage.setItem("resData", JSON.stringify(res.data));
                // 跳转到编辑页面
                location.href = "../article/art_edit.html";
            }
        });

    });
    // 给查看按钮注册点击事件
    $("tbody").on("click", "#btnView", function() {
        const id = $(this).siblings().eq(1).attr("data-id");
        // console.log(id);
        // 发起ajax请求 获取文章信息
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message);
                // 由于要实现跨页面读取数据 所以要再这里把获取到的数据先存储到本地存储中
                localStorage.setItem("resData", JSON.stringify(res.data));
                // 跳转到编辑页面
                location.href = "../article/art_View.html";
            }
        });
    })

    // 格式化时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零函数
    function padZero(n) {
        n = n > 10 ? n : '0' + n;
        return n;
    }

    // 封装获取文章列表的ajax函数
    function getArtList() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: data, // 等同于 data:data,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败');
                }
                // console.log(res);

                // 调用art-template模板引擎
                var htmlStr = template("tpl_artList", res);
                $("tbody").html(htmlStr);

                // 关于切换页码函数的调用 不应该是当点击页码按钮后再发送请求渲染数据吗
                renderPage(res.total);
            }
        });
    };
    // 封装获取文章类别的函数
    function getArtCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败');
                }
                // console.log(res);
                var htmlStr = template("tpl_artCate", res);
                // console.log(htmlStr);
                $("#select_artCate").html(htmlStr);

                // 之所以要调用一下render 是因为layui中对于select下拉框表单的自动渲染会失效 所以加载render重新渲染一下即可
                layui.form.render();
            }
        });
    };
    // 封装渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 切换页面功能  主要是利用layui的模块
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageArea', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: data.pagesize, // 每页显示几条数据
                curr: data.pagenum, // 设置默认被选中的分页
                limits: [2, 3, 5, 7, 10],
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                jump: function(obj, first) {
                    // console.log(first);
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;
                    //首次不执行
                    if (!first) {
                        //do something
                        getArtList();
                    }
                }
            });
        });
    }

});
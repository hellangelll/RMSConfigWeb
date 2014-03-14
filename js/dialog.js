(function () {
    if (!window.HAT) {
        window.HAT = {};
    }
})();


/**
 * 对话框
 */
HAT.Dialog = {
    dialog: null,
    /**
     * add/edit/...
     *
     * @type {String}
     */
    type: 'add',
    /**
     * 初始化弹出框对象
     *
     * @param{$()} frm 弹出框内容jQuery表单对象
     * @param{string} title 标题
     * @param{string} type 弹出框类型 #see App.Dialog.type
     * @param{number} width 宽度
     * @param{Boolean} esc ESC退出窗口
     * @returns {Object} App.Dialog
     */
    init: function (frm, title, type, width, esc) {
        HAT.Dialog.dialog = $('#frm_dialog');
        HAT.Dialog.type = type;
        var dialog = HAT.Dialog.dialog;
        dialog.css({
            "width": width ? width : 520 + "px"
        });
        var diaTitle = dialog.find('.dialog-title');
        diaTitle.find('.title-name').html(title);
        diaTitle.find('.dialog-close').bind('click', function () {
            $('#dialog-cover').hide();
            dialog.hide();
            $('p#vtip').hide();
        });
        dialog.find('.inner-box').hide();
        frm.show();

        switch (type) {
            case 'add':
            {
                document.getElementById(frm.attr('id')).reset();

                diaTitle.css({
                    //"background-image" : "url(image/expand32-black.png)"
                });
            }
                break;
            case 'edit':
            {
                diaTitle.css({
                    //"background-image" : "url(image/edit32-black.png)"
                });
            }
                break;
            default:
            {
                diaTitle.css({
                    //"background-image" : "url(image/key32-black.png)"
                });
            }
        }
        if (!esc) {
            $(document).keydown(function (e) {
                if (e.keyCode == 27) {
                    HAT.Dialog.hide();
                }
            });
        }
        
        dialog.draggable({
            containment: "document"
        });
        return this;
    },
    /**
     * 显示窗口
     *
     * @returns {Object} App.Dialog
     */
    show: function () {
        HAT.Dialog.dialog = $('#frm_dialog');
        if (HAT.Dialog.dialog) {
            HAT.Dialog.dialog.find('form:visible').keydown(function (e) {
                if (e.keyCode == 13) {
                    var form = $(this), name = form.attr('name');
                    form.find('button[name="' + name + '"]').trigger('click');
                }
            });
        }
        $('#dialog-cover').show();
        HAT.Main.layer.move2Center(HAT.Dialog.dialog).show();
        return this;
    },
    /**
     * 隐藏窗口
     *
     * @returns {Object} App.Dialog
     */
    hide: function () {
        if (HAT.Dialog.dialog) {
            $('#dialog-cover').hide();
            HAT.Dialog.dialog.hide();
        }
        return this;
    }
};
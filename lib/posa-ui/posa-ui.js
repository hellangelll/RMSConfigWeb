var PosaUI = {
    /**
     *
     * @param{String} eId 封装表格的元素ID号（如：div）
     * @param{Object} s 配置信息，格式如下： <br> { height : 320,//表格高度,最小（默认）72<br>
	 *                width : 960,//最小72,100%默认<br>
	 *                footer : true,//是否显示页脚，默认不显示<br>
	 *                align : 'right',//表格对齐位置'right/left/center'<br>
	 *                thead : [ {//表头数组<br>
	 *                name : '云台控制',//显示名称<br>
	 *                width : 10,//宽度百分比<br>
	 *                align : 'center' //列对齐位置'right/left/center'}<br> ] }
     * @constructor Dialog
     */
    Table: function (eId, s) {
        var thead = s.thead, height = (s.height ? s.height : 72), width = (s.width ? s.width
            : '100%'), alignTxt = {
            center: 'tbl-txt-center',
            left: 'tbl-txt-left',
            right: 'tbl-txt-right'
        }, align = {
            center: 'tbl-center',
            left: 'tbl-left',
            right: 'tbl-right'
        }, alignTbl = (s.align ? align[s.align] : align.left), wrapper = $('<div class="tbl-wrapper"><div class="tbl-wrapper-header"><table class="tbl-thead"><thead><tr></tr></thead></table></div><div class="tbl-wrapper-body"><table class="tbl-body"><thead><tr></tr></thead><tbody></tbody></table></div><div class="tbl-wrapper-fotter"><div class="tbl-total">总共有<span class="tbl-total-number">0</span>条记录</div></div></div>'), wrapperHeader = wrapper
            .find('.tbl-wrapper-header'), theader = wrapper
            .find('.tbl-thead thead tr'), tbodyHeader = wrapper
            .find('.tbl-body thead tr'), wrapperBody = wrapper
            .find('.tbl-wrapper-body'), tbody = wrapper
            .find('.tbl-body tbody'), tfooter = wrapper
            .find('.tbl-wrapper-fotter'), totalObject = tfooter
            .find('.tbl-total-number');

        // thead
        var theadHTML = [];
        for (var i = 0, len = thead.length; i < len; i++) {
            var th = thead[i], align = (th.align ? alignTxt[th.align]
                : alignTxt.left);
            theadHTML.push('<th width="' + th.width + '%" scope="col" class="'
                + align + '">' + th.name + '</th>');
        }
        theadHTML = theadHTML.join('');

        // header
        theader.append(theadHTML
            + '<th scope="col"><div class="tbl-scroll-offset"></div></th>');
        tbodyHeader.append(theadHTML);
        // .height(height + tfooter.height());
        $('#' + eId).empty().append(wrapper).append(
            '<div class="tbl-clear"></div>');
        wrapper.width(width).addClass(alignTbl);

        var _height = height - wrapperHeader.height() - 3;
        wrapperBody.height(_height < 0 ? 32 : _height);

        // footer
        if (s.footer) {
            tfooter.show();
        } else {
            tfooter.hide();
        }

        // 数据总数
        this._total = 0;

        /**
         * 清除表格数据
         */
        this.clear = function () {
            tbody.empty();
            this._setTotal(0);
            return this;
        };
        // methods
        this.hideFooter = function () {
            tfooter.hide();
        };
        /**
         * 初始化表格数据
         *
         * @param{Array} data
         */
        this.initData = function (data) {
            var tbodyHTML = [];
            for (var i = 0, len = data.length; i < len; i++) {
                tbodyHTML.push(this._trCreater(data[i]));
            }
            tbody.empty().append(tbodyHTML.join(''));
            this._setTotal(len);
            return this;
        };
        /**
         * 在表格后台追加一行数据
         *
         * @param{Number} data
         */
        this.append = function (data) {
            tbody.append(this._trCreater(data));
            this._setTotal(this._total + 1);
            return this;
        };
        /**
         * 在表格后台追加一行数据
         *
         * @param{Number} data
         */
        this.prepend = function (data) {
            tbody.prepend(this._trCreater(data));
            this._setTotal(this._total + 1);
            return this;
        };
        /**
         * 设置记录总数
         *
         * @param{Number} total
         */
        this._setTotal = function (total) {
            this._total = total;
            totalObject.html(total);
            return this;
        };
        /**
         * 获取记录总数
         *
         * @return {Number}
         */
        this.getTotal = function () {
            return this._total;
        };
        /**
         * 创建表格行
         *
         * @method _trCreater
         * @param{Array} trData
         * @returns {String}
         */
        this._trCreater = function (trData) {
            var trHTML = [], i = 0, len = trData.length;
            for (; i < len; i++) {
                var th = thead[i], align = (th.align ? alignTxt[th.align]
                    : alignTxt.left);
                trHTML.push('<td class="' + align + '">' + trData[i] + '</td>');
            }
            return '<tr>' + trHTML.join('') + '</tr>';
        };
        /**
         * 删除行
         *
         * @param{Number} index
         */
        this.trRemove = function (index) {
            tbody.find('tr').eq(index).remove();
            this._setTotal(this._total - 1);
            return this;
        };
        /**
         * 删除行
         *
         * @param{Number} object
         */
        this.trObjectRemove = function (hdlObj) {
            hdlObj.parent().parent().remove();
            this._setTotal(this._total - 1);
            return this;
        };
        /**
         * 按键
         *
         * @param{String} name 按键名称
         * @param{String} handler 调用函数字符串
         * @param{String} iconClass 图标样式类
         * @return {String}
         */
        this.btn = function (name, handler, iconClass) {
            return '<a class="tbl-icon ' + iconClass
                + '" href="javascript:;" onclick="' + handler + '">' + name
                + '</a>';
        };
        /**
         * 编辑按键
         *
         * @param{String} name 按键名称
         * @param{String} handler 调用函数字符串
         * @return {String}
         */
        this.btnEdit = function (name, handler) {
            return '<a class="tbl-icon tbl-icon-edit" href="javascript:;" onclick="'
                + handler + '">' + (name ? name : '编辑') + '</a>';
        };
        /**
         * 删除按键
         *
         * @param{String} name 按键名称
         * @param{String} handler 调用函数字符串
         * @return {String}
         */
        this.btnDel = function (name, handler) {
            return '<a class="tbl-icon tbl-icon-del" href="javascript:;" onclick="'
                + handler + '">' + (name ? name : '删除') + '</a>';
        };
        /**
         * 播放按键
         *
         * @param{String} name 按键名称
         * @param{String} handler 调用函数字符串
         * @return {String}
         */
        this.btnPlay = function (name, handler) {
            return '<a class="tbl-icon tbl-icon-play" href="javascript:;" onclick="'
                + handler + '">' + (name ? name : '播放') + '</a>';
        };
        /**
         * 取消关联按键
         *
         * @param{String} name 按键名称
         * @param{String} handler 调用函数字符串
         * @return {String}
         */
        this.btnDisa = function (name, handler) {
            return '<a class="tbl-icon tbl-icon-disa" href="javascript:;" onclick="'
                + handler + '">' + (name ? name : '取消关联') + '</a>';
        };

        return this;
    },
    Dialog: function (eId, s) {

    }
};

(function ($) {
    $.fn.Posa = {
        Dialog: function ($, options) {

        }
    };
})(jQuery);

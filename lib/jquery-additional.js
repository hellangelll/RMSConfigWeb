(function ($) {
    $.fn.vInteger = function () {
        $(this).bind("keyup keydown blur", function () {
            var thiz = $(this), val = thiz.val();
            if ('' !== val) {
                if (/\D/g.test(val)) {
                    var v = val.replace(/\D/g, "");
                    thiz.val(v === "" ? "0" : v);
                }
            }
        });
    };
    $.fn.vIntegerRange = function (max, min) {
        $(this).bind("keyup keydown", function () {
            if (/\D/g.test($(this).val())) {
                var val = $(this).val().replace(/\D/g, "");
                $(this).val(val === "" ? "0" : val);
            }
        });
        $(this).bind("blur", function () {
            var val = parseInt($(this).val() === "" ? "0" : $(this).val());
            if (max && val > max) {
                val = max;
            } else {
                if (min && val < min) {
                    val = min;
                }
            }
            $(this).val(val);
        });
    };
    $.fn.vIntegerRangeTimes = function (max, min) {
        $(this).bind("keyup keydown", function () {
            if (/\D/g.test($(this).val())) {
                var val = $(this).val().replace(/\D/g, "");
                $(this).val(val === "" ? min : Math.ceil(val / min) * min);
            }
        });
        $(this).bind("blur", function () {
            var val = parseInt($(this).val() === "" ? "0" : $(this).val());
            if (max && val > max) {
                val = max;
            } else {
                if (min && val < min) {
                    val = min;
                }
            }
            $(this).val(Math.ceil(val / min) * min);
        });
    };
    /**
     * ASCII字符验证
     * @param {Boolean} trimBlanks 过虑所有空格
     */
    $.fn.vASCII = function () {
        $(this).bind("keyup keydown blur", function () {
            if (/[^\x00-xff]/g.test($(this).val())) {
                var val = $(this).val().replace(/[^\d|\w|-|&|\(|\)|\[|\]\:|\;|\.|\,|\/|+|=|\#|\$|\%|*]/g, '');
                $(this).val(val);
            }
        });
        return $(this);
    };
    /**
     * 特殊字符过虑器
     * @returns {*|HTMLElement}
     */
    $.fn.vFilterSpechars = function () {
        $(this).bind("keyup keydown blur", function () {
            var val = $(this).val().replace(/[\'\"\<\>\@\#/]/g, '');
            if( $(this).val() != val ){
	            $(this).val(val);
            }
        });
        return $(this);
    };

    /**
     * 过虑空格
     * @param {Boolean} all true-过虑所有空格;默认过虑前后空格
     */
    $.fn.vTrim = function (all) {
        $(this).bind("blur", function () {
            if (all) {
                $(this).val($(this).val().trimBlanks());
            } else {
                $(this).val($(this).val().trim());
            }
        });
        return $(this);
    };
    /**
     * IPv4地址验证
     */
    $.fn.vIPv4 = function () {
        $(this)
            .bind(
            "blur",
            function () {
                if (!/^([01]?\d\d?|2[0-4]\d|25[0-5])(\.([01]?\d\d?|2[0-4]\d|25[0-5])){3}$/
                    .test($(this).val())) {
                    $(this).val("");// 0.0.0.0
                }
            });
    };
    /**
     * ip+"this"
     * */
    $.fn.vIP = function(){
        $(this)
            .bind(
            "blur",
            function () {
                if( $(this).val() == "this" ){
                    return;
                }

                if (!/^([01]?\d\d?|2[0-4]\d|25[0-5])(\.([01]?\d\d?|2[0-4]\d|25[0-5])){3}$/
                    .test($(this).val())) {
                    $(this).val("");// 0.0.0.0
                }
            });
    };
     /**
     * MAC地址验证，格式如：00-00-00-00-00-00
     */
    $.fn.mac = function () {
        $(this)
            .bind(
            "blur",
            function () {
                if (!/^[0-9,a-f,A-F]{2}[:][0-9,a-f,A-F]{2}[:][0-9,a-f,A-F]{2}[:][0-9,a-f,A-F]{2}[:][0-9,a-f,A-F]{2}[:][0-9,a-f,A-F]{2}$/
                    .test($(this).val())) {
                    $(this).val("");
                }
            });
    };
})(jQuery);
(function ($) {
    var el;
    var settings = {};
    var methods = {init: function (options) {
        el = this;
        settings = {token: false, query_param: 'query'};
        if (options) {
            $.extend(settings, options);
        }
        if (!settings.token || settings.query_param == '') {
            return this;
        }
        $.getJSON('http://tapirgo.com/api/1/search.json?token=' + settings.token + '&query=' + paramValue(settings.query_param) + '&callback=?', function (data) {
            if (settings['complete']) {
                settings.complete()
            }
            el.append('<p>共查找关键字为<i class="label label-danger">'+paramValue(settings.query_param)+'</i>的文章，可用浏览器快捷键Ctrl+F搜索本页的关键字 </p>');
            $.each(data, function (key, val) {
                el.append('<h4><a target="_blank" href="' + val.link + '">' + val.title + '</a></h4>')
            });
            $.each(data, function (key, val) {
                el.append('</br><hr><section  id="result"><h2><a style="color: black" target="_blank" href="' + val.link + '">' + val.title + '</a></h2><p>' + val.summary + '</p></section >');
            });

        });
        return this;
    }};

    function paramValue(query_param) {
        var results = new RegExp('[\\?&]' + query_param + '=([^&#]*)').exec(window.location.href);
        return results ? results[1] : false;
    }

    $.fn.tapir = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tapir');
        }
    };
})(jQuery);
class Util {
    toCamelCase(source) {
        if (source.indexOf('-') < 0) {
            return source;
        }
        return source.replace(
            /\-./g,
            function (match) {
                return match.charAt(1).toUpperCase();
            }
        );
    }
    addClass(el, className) {
        el.className += ' ' + className;
    }
    hasClass(el, className) {
        return el.className.split(/\s+/).indexOf(className) >= 0;
    }
    removeClass(el, className) {
        var oldClasses = el.className.split(/\s+/).sort(),
            newClasses = className.split(/\s+/).sort(),
            i = oldClasses.length,
            j = newClasses.length;

        for (; i && j; ) {
            if (oldClasses[i - 1] === newClasses[j - 1]) {
                oldClasses.splice(--i, 1);
            } else if (oldClasses[i - 1] < newClasses[j - 1]) {
                j--;
            } else {
                i--;
            }
        }
        el.className = oldClasses.join(' ');
    }
    getControl(el) {
        return el.getControl && el.getControl();
    }
    copy(des, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                if (src[key]) {
                    if ('object' === typeof src[key]) {
                        this.copy(des[key], src[key]);
                    } else {
                        des[key] = src[key];
                    }
                }
            }
        }
    }
    ajax(url, options) {
        function stateChangeHandler() {
            if (xhr.readyState === 4) {
                try {
                    var status = xhr.status;
                } catch (ignore) {
                    // 在请求时，如果网络中断，Firefox会无法取得status
                }

                // IE error sometimes returns 1223 when it
                // should be 204, so treat it as success
                if ((status >= 200 && status < 300) || status === 304 || status === 1223) {
                    if (options.onsuccess) {
                        options.onsuccess(xhr.responseText, xhr);
                    }
                } else {
                    onerror(xhr);
                }

                /*
                 * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
                 * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
                 * function maybe still be called after it is deleted. The theory is that the
                 * callback is cached somewhere. Setting it to null or an empty function does
                 * seem to work properly, though.
                 *
                 * On IE, there are two problems: Setting onreadystatechange to null (as
                 * opposed to an empty function) sometimes throws an exception. With
                 * particular (rare) versions of jscript.dll, setting onreadystatechange from
                 * within onreadystatechange causes a crash. Setting it from within a timeout
                 * fixes this bug (see issue 1610).
                 *
                 * End result: *always* set onreadystatechange to an empty function (never to
                 * null). Never set onreadystatechange from within onreadystatechange (always
                 * in a setTimeout()).
                 */
                // util.timer(
                //     function () {
                //         xhr.onreadystatechange = util.blank;
                //         xhr = null;
                //     }
                // );

                if (stop) {
                    stop();
                }
            }
        }

        options = options || {};

        var data = options.data || '',
            async = options.async !== false,
            method = (options.method || 'GET').toUpperCase(),
            headers = options.headers || {},
            onerror = options.onerror || function () {},
            // 基本的逻辑来自lili同学提供的patch
            stop,
            xhr;

        try {
            if (window.ActiveXObject) {
                try {
                    xhr = new ActiveXObject('Msxml2.XMLHTTP');
                } catch (e) {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
            } else {
                xhr = new XMLHttpRequest();
            }

            if (options.onupload && xhr.upload) {
                xhr.upload.onprogress = options.onupload;
            }

            if (method === 'GET') {
                if (data) {
                    url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
                    data = null;
                }
                if (!options.cache) {
                    url += (url.indexOf('?') >= 0 ? '&' : '?') + 'b' + Date.now() + '=1';
                }
            }

            xhr.open(method, url, async);

            if (async) {
                xhr.onreadystatechange = stateChangeHandler;
            }

            for (var key in headers) {
                if (headers.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            }

            if (options.timeout) {
                stop = util.timer(
                    function () {
                        xhr.onreadystatechange = util.blank;
                        xhr.abort();
                        onerror(xhr);
                        xhr = null;
                    },
                    options.timeout
                );
            }
            xhr.send(data);

            if (!async) {
                stateChangeHandler();
            }
        } catch (e) {
            onerror(xhr);
        }
    }
    loadInnerScript(script, callback) {
        var scriptEl = document.createElement('SCRIPT');
        scriptEl.type = 'module';
        scriptEl.innerHTML = script;
        document.head.appendChild(scriptEl);
        debugger
    }
    loadScript(url, callback, options) {
        function removeScriptTag() {
            if (stop) {
                stop();
            }
            scr.onload = scr.onreadystatechange = scr.onerror = null;
            if (scr && scr.parentNode) {
                scr.parentNode.removeChild(scr);
            }
            scr = null;
        }

        options = options || {};

        // if (!options.cache) {
        //     url += (url.indexOf('?') >= 0 ? '&' : '?') + 'b' + Date.now() + '=1';
        // }

        var scr = document.createElement('SCRIPT'),
            scriptLoaded = 0,
            stop;
        scr.type = 'module';
        // IE和opera支持onreadystatechange
        // safari、chrome、opera支持onload
        scr.onload = scr.onreadystatechange = function () {
            debugger
            // 避免opera下的多次调用
            if (scriptLoaded) {
                return;
            }

            if (scr.readyState === undefined || scr.readyState === 'loaded' || scr.readyState === 'complete') {
                scriptLoaded = 1;
                try {
                    if (callback) {
                        callback();
                    }
                } finally {
                    removeScriptTag();
                }
            }
        };

        if (options.timeout) {
            stop = util.timer(
                function () {
                    removeScriptTag();
                    if (options.onerror) {
                        options.onerror();
                    }
                },
                options.timeout
            );
        }

        if (options.charset) {
            scr.setAttribute('charset', options.charset);
        }
        if (options.inner) {
            scr.innerHTML =  url;
        } else {
            scr.setAttribute('src', url);
        }
       
        document.head.appendChild(scr);
    }
}
export default new Util();
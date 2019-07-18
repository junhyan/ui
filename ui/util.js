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
}
export default new Util();
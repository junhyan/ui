import util from './util.js'
class Control {
    constructor(main, primaryClass, data) {
        this.data = data || {};
        this.main = main;
        this.primaryClass = primaryClass || '';
        util.addClass(this.main, this.primaryClass);
        main.control = this;
        main.getControl = () => main.control;
        this.getOptions(main);
    }
    $click(event) {
        console.log('click')
    }

    alterStatus(status) {
        if (status.charAt(0) === '+') {
            util.addClass(this.main, this.primaryClass + '-' + status.slice(1) + ' ');
        } else if (status.charAt(0) === '-') {
            util.removeClass(this.main, this.primaryClass + '-' + status.slice(1));
        }
    }

    getOptions(el) {
        let names = el.getAttributeNames();
        names.forEach(item => {
            if (/^:([a-zA-Z0-9]+)/.test(item)) {
                const key = RegExp.$1;
                let value = el.getAttribute(item);
                if (/\${(.+)}/.test(value)) {
                    value = this.data[RegExp.$1];
                }
                this[key] = value;
            }
        });
        return;
    }
}
export default Control;
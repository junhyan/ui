class Control {
    constructor(main, data) {
        this.data = data || {};
        this.main = main;
        main.control = this;
        main.getControl = Control.getControl;
        this.getOptions(main);
    }
    $click(event) {
    }

    static getControl() {
        return this.control;
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
class Control {
    constructor(main) {
        this.main = main;
        main.control = this;
        main.getControl = Control.getControl;
        this.options = Control.getOptions(main);
    }
    $click(event) {
        // console.log(this);
        console.log('control click');
    }

    static getControl() {
        return this.control;
    }
    static getOptions(el) {
        let names = el.getAttributeNames();
        names.forEach(item => {
            if (/^:[a-zA-Z0-9]+/.test(item)) {

            }
        });
        return;
    }
}
export default Control;
import util from './util.js'
class Control {
    constructor(main, primaryClass, options) {
       this.options = options || {};
        this.main = main;
        this.primaryClass = primaryClass || '';
        util.addClass(this.main, this.primaryClass);
        main.control = this;
        main.getControl = () => main.control;
      //  this.getOptions(main);
    }
    $click(event) {
        // console.log('click')
    }

    alterStatus(status) {
        if (status.charAt(0) === '+') {
            util.addClass(this.main, this.primaryClass + '-' + status.slice(1) + ' ');
        } else if (status.charAt(0) === '-') {
            util.removeClass(this.main, this.primaryClass + '-' + status.slice(1));
        }
    }

   
}
export default Control;
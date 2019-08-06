import util from './util.js';
import Observer from './observer.js';
import Compiler from './compiler.js';
import {renderTree} from './compiler.js';



class Control {
    constructor(view, model = {}, primaryClass, options) {
        this.options = options || {};
        this.units = this.options.units || {};
        // this.main = main;
        // this.primaryClass = primaryClass || '';
        // util.addClass(this.main, this.primaryClass);
        // main.control = this;
        // main.getControl = () => main.control;
        this.view = view;
        this.model = model
        new Observer(this, this.model);
        new Compiler(this);
        // setTimeout(() => {
        //     console.log(renderTree);

        //     this.data.test = 'aaaaa';
        // }, 1000);
       // addControl(this);
    }
    $click(event) {
        console.log('click');
    }

    alterStatus(status) {
        if (status.charAt(0) === '+') {
            util.addClass(this.main, this.primaryClass + '-' + status.slice(1) + ' ');
        } else if (status.charAt(0) === '-') {
            util.removeClass(this.main, this.primaryClass + '-' + status.slice(1));
        }
    }
    static addControlSelf (Control) {
        // if (!Control.All) {
        //     Control.All = {}
        // }

        
        // if (!(list instanceof Array)) {
        //     list = [list];
        // }
        // list.forEach(classItem => {
        //     let className = classItem.name;
        //     if (this.hasOwnProperty(className)) {
        //         if (this.innerClasses.indexOf(className) !== -1) {
        //             console.warn(`Inner class ${className}`);
    
        //         } else {
        //             console.warn(`Duplicate class name of ${className}`);
        //         }
        //     } else {
        //         Control.Controls[className] = classItem;
        //     }
        // });
    }
}
export default Control;
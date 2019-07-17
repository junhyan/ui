import Control from './control.js';
import Button from './button.js';
var Controls = {
    Control,
    Button
};
Controls.innerClasses = [];
for (const key in Controls) {
    if (Controls.hasOwnProperty(key)) {
        if (key !== '') {
            Controls.innerClasses.push(Controls[key]);
        }
        
    }
}
Controls.addControl = function (list) {
    if (!(list instanceof Array)) {
        list = [list];
    }
    list.forEach(classItem => {
        let className = classItem.name;
        if (this.hasOwnProperty(className)) {
            if (this.innerClasses.indexOf(className) !== -1) {
                console.warn(`Inner class ${className}`);

            } else {
                console.warn(`Duplicate class name of ${className}`);
            }
        } else {
            this[className] = classItem;
        }
    });
}
export default Controls;

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
        if (this.hasOwnProperty(classItem.name)) {
            console.warn(`Duplicate class name of ${classItem.name}`);
        } else {
            this[classItem.name] = classItem;
        }
    });
}
export default Controls;

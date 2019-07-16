import Control from './control.js';
import Button from './button.js';
var Controls = {
    Control,
    Button
}
Controls.addControl = function (list) {
    if (!(list instanceof Array)) {
        list = [list];
    }
    list.forEach(classItem => {
        this[classItem.name] = classItem;
    });
}
export default Controls;

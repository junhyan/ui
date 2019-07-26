import Control from '../ui/control.js'
import Button from '../ui/button.js'
export default class Main extends Control {
    constructor(main) {
        super(main, 'main', {units: {MyButton}});
    }
}
class MyButton extends Button {
    constructor(main) {
        super(main);
    }
    $click() {
        super.$click();
    }
    onclick() {
        console.log('click');
    }
    onmouseover() {
        // console.log('mouseover');
    }
    onmouseout() {
        // console.log('mouseout');
    }
    onmousedown() {
        // console.log('mousedown');
    }
    onmouseup() {
        // console.log('mouseup');
    }
    onmousemove() {
        // console.log('mousemove');
    }
    ontouchstart() {
        // console.log('touchstart');
    }
}

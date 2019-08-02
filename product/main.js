import Control from '../ui/control.js'
import Button from '../ui/button.js'
var view = '<main><my-button style="display: block;height:100px;width:100px;background:red" :test="${test}"><div> ceshi </div></my-button>${test}${test1}<div id="index"></div></main>'

export default class Main extends Control {
    constructor() {
        super(view, 'main', {units: {MyButton}});
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

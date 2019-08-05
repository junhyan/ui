import Control from '../ui/control.js'
import Button from '../ui/button.js'
var view = 
'<div>'
 +'<my-button style="display: block;height:100px;width:100px;background:red" if="${test}" bind=${test}></my-button>'
 +'${test}${test1}'
 +'<div id="index"></div>'
 +'</div>';

export default class Main extends Control {
    constructor() {
        super(view, 'main', {units: {MyButton}});
    }
}
class MyButton extends Button {
    constructor() {
        super('<div>mybutton</div>');
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

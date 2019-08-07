import Control from '../ui/control.js'
import Button from '../ui/button.js'
var view = 
'<div class="main">'
 +'<my-button style="display: block;height:100px;width:100px;background:#FCFCFC" if="test" bind="test"></my-button>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC"  elseif="test" >bbb</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC"  else>ccc</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC" if="testc" bind="test">mmm</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC" else bind="test">nnn</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC"  for="test2 as item, index">${item}, ${index}</div>'
 +'${test}----${test1}'
 +'<div id="index"></div>'
 +'</div>';

export default class Main extends Control {
    constructor() {
        super(view, {
            test: 'hahaha',
            test1: 'gagaag',
            test2: ['aa', 'bb', 'cc'],
            item: 1
        }, 'main', {units: {MyButton}});
        
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

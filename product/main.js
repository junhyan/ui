import Control from '../ui/control.js'
import Button from '../ui/button.js'
var view = 
'<div class="main">'
 +'<my-button style="display: block;height:100px;width:300px;background:#FCFCFC" if="test" :test="test" :test1="test1"></my-button>'
 +'<m-button style="display: block;height:100px;width:100px;background:#FCFCFC" if="test" :test="test" :test1="test1"></m-button>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC"  elseif="test" >bbb</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC"  else>ccc</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC" if="testc" >mmm</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC" else bind="test">nnn</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC"  for="test2 as item, index">'
 +' <div>${index}</div>'
 +' <div for="item as subitem,subindex">${subitem}--${subindex}</div>'
 +'</div>'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC">'
 +' <div>${test3}</div>'
 +'</div>'

 +'${test}----${test1}'
 +'<div style="display: block;height:100px;width:100px;background:#FCFCFC">'
 +' <div>${test3}</div>'
 +'</div>'
 +'<div id="index"></div>'
 +'</div>';

export default class Main extends Control {
    constructor(props) {
        super(view, {
            test: true,
            test1: 'gagaag',
            test2: [['aa','aa'], ['bb','bb'], ['cc','cc']],
            test3: 'wat'
        }, 'main', {units: {MyButton, MButton}});
        setTimeout(() => {
            this.data.test3 = 'hhhhhh';
        }, 1000);
    }
}
class MyButton extends Button {
    constructor(props) {
        super('<div if="test">wowow</div><div>mybutton ${test1}--${test}</div><div>wawaw</div>', Object.assign(props, {test:'test'}));
       
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
class MButton extends Button {
    constructor(props) {
        super('<div>mybutton ${test1}--${test}</div>', Object.assign(props, {test:'test'}));
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

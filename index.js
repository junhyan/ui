import Controls from './controls.js'
class MyButton extends Controls.Button {
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
        console.log('mouseover');
    }
    onmouseout() {
        console.log('mouseout');
    }
    onmousedown() {
        console.log('mousedown');
    }
    onmouseup() {
        console.log('mouseup');
    }
}
Controls.addControl(MyButton);
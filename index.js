import Controls from './controls.js'
class MyButton extends Controls.Control {
    constructor(main) {
        super(main);
    }
    $click() {
        super.$click();
    }
}
Controls.addControl(MyButton);
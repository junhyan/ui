import Control from './control.js'
class Button extends Control {
    constructor(main, data) {
        super(main, data);
    }
    $click(event) {
        super.$click(event);
    }
}
export default Button;
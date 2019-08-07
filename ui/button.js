import Control from './control.js'
class Button extends Control {
    constructor(view, model) {
        super(view, model);
    }
    $click(event) {
        super.$click(event);
    }
}
export default Button;
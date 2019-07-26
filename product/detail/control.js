import Control from '../ui/control.js'
export default class How extends Control {
    constructor(main) {
        super(main);
    }
    onclick() {
        console.log(1);
    }
}
// Controls.addControl(What);
// new RouteFactory().addRoute({
//     name: 'index',
//     main: 'index',
//     view: '' 
// });

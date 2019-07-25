import Controls from '../ui/controls.js'
import RouteFactory from '../ui/route-factory.js'
export default class What extends Controls.Control {
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

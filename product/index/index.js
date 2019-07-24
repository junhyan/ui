import Controls from '../ui/controls.js'
import RouteFactory from '../ui/route-factory.js'
class What extends Controls.Control {
    constructor(main) {
        super(main);
    }
}
Controls.addControl(What);
new RouteFactory().addRoute({
    name: 'index',
    view: '<what style="display:block;height: 20px;width:20px;background:green"></what>',
    main: 'index'
});

import Core from './core.js';
import RouteFactory from './route-factory.js';
class Ui{
    init(Main, router) {
        document.addEventListener('DOMContentLoaded', function () {
            new Core().init();
            new RouteFactory(Main, router);
        });
    }
}

export default Ui;

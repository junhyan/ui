import Core from './core.js';
import RouteFactory from './route-factory.js';
class Ui{
    init(Main) {
        document.addEventListener('DOMContentLoaded', function () {
            new Core().init();
            new RouteFactory(Main);
        });
    }
}

export default Ui;

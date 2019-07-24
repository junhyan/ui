import Core from './core.js';
import RouteFactory from './route-factory.js';

document.addEventListener('DOMContentLoaded', function () {
    new Core().init();
    new RouteFactory();
    // var b = new RouteFactory();
});

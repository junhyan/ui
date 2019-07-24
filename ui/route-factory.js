import Route from "./route.js";
import util from "./util.js";

class  SingletonRouteFactory{
    constructor() {
        this.init();
        //util.ajax('/index/index.js');
        // this.routes = {
        //     '/index': '/index',
        //     '/b': '/b',
        // }
        this.routes = [];

    }
    init() {
        window.addEventListener('hashchange', this.hashChangeListener.bind(this));
    }
    hashChangeListener(event) {
        this.old = event.oldURL.split('#')[1] || '/';
        this.new = event.newURL.split('#')[1] || '/';
        util.loadScript(this.new + '/index.js', () => {
            this.callRoute('index');
        });
    }
    addRoute(route) {
        this.routes.push(new Route(route));
    }
    callRoute(name) {
        let route = this.routes.filter((item) => item.name === name)[0];
        if (route) {
            document.getElementById(route.main).innerHTML = route.view;
        }
    }
}
var RouteFactory = (function () {
    var instance;
    return function () {
        if (!instance) {
            instance = new SingletonRouteFactory();
        }
        return instance;
    }
})();
export default RouteFactory;
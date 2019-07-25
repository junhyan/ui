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
        this.currentModual = this.new.split('/')[0];
        this.currentRoute = this.new.split('/')[1];
        // if (/(<target>[\s\S]*<\/target>)/.test(data)) {
        //     var el = RegExp.$1;
        //     let view = el.replace(/<[\/]?target>/g, '');
        //     let script = data.replace(el, '');
        //     util.loadInnerScript(script, () => {
        //        this.callRoute('index');
        //     }, {inner: true});
        // }
        this.callRoute(this.new.slice(1));
        
        
    }
    addRoute(route) {
        this.routes.push(new Route(route));
    }
    callRoute(name) {
        let route = this.routes.filter((item) => item.name === name)[0];
        if (route) {
            document.getElementById(route.main).innerHTML = route.view;
        } else {
            util.ajax(`${name}.html`, {onsuccess: (data) => {
                document.getElementById('index').innerHTML = data;
                let node = document.getElementById('index').children[0];
                import(`/${name}.js`).then((Mod) => {
                    new Mod.default(node);
                }).catch((err)=>{console.log(err)})
            }});
           
            // util.loadScript(`${name}.js`, () => {
                
            //     // util.ajax(`${this.new}/${name}.html`, {onsuccess: (data) => {
            //     //     this.callRoute(name);
            //     // }});
            // });
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
import Route from "./route.js";
import util from "./util.js";
import Compiler from "./compiler.js";

class  SingletonRouteFactory{
    constructor(Main) {
        //util.ajax('/index/index.js');
        // this.routes = {
        //     '/index': '/index',
        //     '/b': '/b',
        // }
        util.ajax(`/main.html`, {onsuccess: (data) => {
            document.body.innerHTML = data;
            let node = document.body.children[0];
            
            let routeControl = new Main(node);
            this.routes.push({name: '/main', routeControl: routeControl});
            // new Compiler(node, );
          
        }});
        this.routes = [];

        this.init();

    }
    init() {
        window.addEventListener('hashchange', this.hashChangeListener.bind(this));
    }
    hashChangeListener(event) {
        this.old = event.oldURL.split('#')[1] || '/main';
        this.new = event.newURL.split('#')[1] || '/main';
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
        this.go(this.new);
        
        
    }
    // addRoute(route) {
    //     this.routes.push(new Route(route));
    // }
    go(name) {
        // if () {
        //     name = '/main';
        // }
        let routeObj = this.routes.filter((item) => item.name === name)[0];
        let route = routeObj && routeObj.routeControl;
        if (route) {
            document.getElementById('index').innerHTML = '';
            document.getElementById('index').appendChild(route.main);
        } else {
            util.ajax(`${name}.html`, {onsuccess: (data) => {
                document.getElementById('index').innerHTML = data;
                let node = document.getElementById('index').children[0];
                import(`${name}.js`).then((Mod) => {
                    let routeControl = new Mod.default(node);
                    this.routes.push({name: name, routeControl: routeControl});
                    // new Compiler(node, );
                }).catch((err)=>{console.log(err)})
            }});
        }
       
       
    }
}
var RouteFactory = (function () {
    var instance;
    return function (Main) {
        if (!instance) {
            instance = new SingletonRouteFactory(Main);
        }
        return instance;
    }
})();
export default RouteFactory;
import util from "./util.js";

class  SingletonRouteFactory{
    constructor(Main, router) {
        
        this.router = router;
        // util.ajax(`/main.html`, {onsuccess: (data) => {
        //     document.body.innerHTML = data;
        //     let node = document.body.children[0];
            
        let routeControl = new Main();
        routeControl.isInit = true;
        routeControl.load(document.body);
        this.routes = [];
        this.routes.push({name: '/main', routeControl: routeControl});
            // new Compiler(node, );
          
        // }});

        this.init();

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
        this.go(this.new);
        
        
    }
    // addRoute(route) {
    //     this.routes.push(new Route(route));
    // }
    go(url) {
        // if () {
        //     name = '/main';
        // }
        var config = this.router.configs[url];
        let routeObj = this.routes.filter((item) => item.url === url)[0];
        let route = routeObj && routeObj.routeControl;
        if (route) {
            document.getElementById(config.router).innerHTML = '';
            
            route.main.getElementsByTagName('ROUTER')[0] && (route.main.getElementsByTagName('ROUTER')[0].innerHTML = '');
            document.getElementById(config.router).appendChild(route.main);

        } else {
            util.ajax(`${config.path}.html`, {onsuccess: (data) => {
                document.getElementById(config.router).innerHTML = data;
                let node = document.getElementById(config.router).children[0];
                import(`${config.path}.js`).then((Mod) => {
                    let routeControl = new Mod.default(node);
                    this.routes.push({url: url, routeControl: routeControl});
                    // new Compiler(node, );
                }).catch((err)=>{console.log(err)})
            }});
        } 
    }
}
var RouteFactory = (function () {
    var instance;
    return function (Main, router) {
        if (!instance) {
            instance = new SingletonRouteFactory(Main, router);
        }
        return instance;
    }
})();
export default RouteFactory;
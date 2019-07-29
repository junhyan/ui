
var configs = {
    '/': {path: '/main', router: 'main'},
    '/detail': {path:'/detail/index', router:'index'},
    '/detail/more': {path: '/detail/more', router:'index'}
};
class Route {
    constructor() {
        this.configs = configs;
    }
}
export default Route;
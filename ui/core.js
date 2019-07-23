import events from './events.js';
import Compiler from './compiler.js';
import Observer from './observer.js';

class Core {
    constructor() {
        this.compiler = new Compiler();
        this.route = {
            context: {
                test: 'hahaha',
                test1: 'gagaag'
            }
        };
    }
    init() {
        events.addEventListeners(window, events.baseEvents);
        // Array.from(document.body.getElementsByTagName('*')).forEach(item => {
        //     let tagName = item.tagName.toLowerCase(),
        //         className = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
        //     this.create(Controls[className], item);
        // });
       
        var ob = new Observer(this.getRoute(), this.getRoute().context);
        setTimeout(() => {
            this.getRoute().data.test = 'aaaa';
        }, 2000);
        var fragment = this.compiler.nodeToFragment(document.body);
        this.compiler.compileElement(fragment, this);
        document.body.appendChild(fragment);
    }
    create(Control, el, options) {
        if (!Control) {
            return null;
        }
        return new Control(el, options);
    }
    getFocus() {
        return events.focusControl;
    }
    getActive() {
        return events.activeControl;
    }
    getRoute() {
        return this.route;
    }
    
    
}
export default Core;
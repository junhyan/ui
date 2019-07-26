import events from './events.js';

class Core {
    constructor() {
        
        // this.route = {
        //     context: {
        //         test: 'hahaha',
        //         test1: 'gagaag'
        //     }
        // };
    }
    init() {
        events.addEventListeners(window, events.baseEvents);
        // Array.from(document.body.getElementsByTagName('*')).forEach(item => {
        //     let tagName = item.tagName.toLowerCase(),
        //         className = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
        //     this.create(Controls[className], item);
        // });
       
        // setTimeout(() => {
        //     this.getRoute().data.test = 'aaaa';
        // }, 2000);
    }
    getFocus() {
        return events.focusControl;
    }
    getActive() {
        return events.activeControl;
    }
    // getRoute() {
    //     return this.route;
    // }
    
    
}
export default Core;
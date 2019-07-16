import events from './events.js';
import Controls from './controls.js';
import util from './util.js'

class Core {
    init() {
        this.addEventListeners(window, events.baseEvents);
        Array.from(document.body.getElementsByTagName('*')).forEach(item => {
            let tagName = item.tagName.toLowerCase(),
                className = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
            this.create(Controls[className], item);
        });
    }
    create(Control, el) {
        if (!Control) {
            return;
        }
        new Control(el);
    }
    addEventListeners(obj, baseEvents) {
        for (var key in baseEvents) {
            if (baseEvents.hasOwnProperty(key)) {
                obj.addEventListener(key, baseEvents[key]);
            }
        }
    };
    
}
export default new Core();
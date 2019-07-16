import events from './events.js';
import {Button} from './controls.js';

class Core {
    init() {
        this.addEventListeners(window, events.baseEvents);
        Array.from(document.body.getElementsByTagName('*')).forEach(item => {
            this.create(Button, item);
        });
    }
    create(Control, el) {
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
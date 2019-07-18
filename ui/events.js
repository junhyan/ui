import Event from './event.js'
class Events {
    constructor() {
        this.activeControl = null;
        this.focusControl = null;
        this.initEvent();
    }
    setFocus(control) {
        if (this.focusControl !== control) {
            if (this.focusControl) {
                this.dispatchEvent(this.focusControl, 'blur', event);
                this.focusControl.alterStatus('-focus');
            }
            this.focusControl = control;
            this.dispatchEvent(control, 'focus', event);
            control.alterStatus('+focus');
        }
    }
    setActive(control) {
        if (control) {
            this.activeControl = control;
            control.alterStatus('+active');
            this.dispatchEvent(control, 'focus', event);
        } else {
            this.activeControl.alterStatus('-active');
            this.activeControl = null;
        }
       
    }

    initEvent() {
        let isToucher = document.ontouchstart !== undefined;
        this.baseEvents = {
            click: (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'click', event);
                }
            },
            touchstart:  (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'touchstart', event);
                    this.setFocus(control);
                    this.setActive(control);
                }
            }

        }
        this.mouseEvent = {
            mousedown: (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'mousedown', event);
                    this.setFocus(control);
                    this.setActive(control);
                }
            },
            mouseup: (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'mouseup', event);
                    this.setActive();
                }
            },
            mouseover: (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'mouseover', event);
                }
            },
            mouseout: (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'mouseout', event);
                }
            },
            mousemove: (event) => {
                event = new Event(event);
                let control = event.getTarget();
                if (control) {
                    this.dispatchEvent(control, 'mousemove', event);
                }
            }
        }
        if (!isToucher) {
            Object.assign(this.baseEvents, this.mouseEvent);
        }
    }
    dispatchEvent(control, name, event) { 
        if (control['on' + name] && control['on' + name](event) === false || (control['$' + name] && control['$' + name](event) === false)) {
            event.preventDefault();
        }
    }
    addEventListeners(obj, baseEvents) {
        for (var key in baseEvents) {
            if (baseEvents.hasOwnProperty(key)) {
                obj.addEventListener(key, baseEvents[key]);
            }
        }
    };
}

export default new Events();
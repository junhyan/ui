class Events {
    constructor() {
        this.activeControl = null;
        this.focusControl = null;
        this.baseEvents = {
            click: (event) => {
                if (event.target.getControl) {
                    let control = event.target.getControl()
                    this.dispatchEvent(control, 'click', event);
                }
            },
            mousedown: (event) => {
                if (event.target.getControl) {
                    let control = event.target.getControl()
                    this.dispatchEvent(control, 'mousedown', event);
                    if (this.focusControl !== control) {
                        if (this.focusControl) {
                            this.dispatchEvent(this.focusControl, 'blur', event);
                            this.focusControl.alterStatus('-focus');
                        }
                        this.focusControl = control;
                        this.dispatchEvent(control, 'focus', event);
                        control.alterStatus('+focus');
                    }
                    this.activeControl = control;
                    control.alterStatus('+active');
                    this.dispatchEvent(control, 'focus', event);   
                }
            },
            mouseup: (event) => {
                if (event.target.getControl) {
                    let control = event.target.getControl()
                    this.dispatchEvent(control, 'mouseup', event);
                    this.activeControl.alterStatus('-active');
                    this.activeControl = null;
                }
            },
            mouseover: (event) => {
                if (event.target.getControl) {
                    let control = event.target.getControl()
                    this.dispatchEvent(control, 'mouseover', event);
                }
            },
            mouseout: (event) => {
                if (event.target.getControl) {
                    let control = event.target.getControl()
                    this.dispatchEvent(control, 'mouseout', event);
                }
            },

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
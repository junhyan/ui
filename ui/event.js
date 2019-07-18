import util from './util.js'
class Event {
    constructor(event) {
        this.type = event.type;
        this.nativeEvent = event;
    }
    getNative() {
        return this.nativeEvent;
    }
    getTarget() {
        return util.getControl(this.nativeEvent.target);
    }
    exit() {
        this.preventDefault();
        this.stopPropagation();
    }
    stopPropagation() {
        this.cancelBubble = true;
        this.nativeEvent.stopPropagation();
    }
    preventDefault() {
        this.returnValue = false; 
        this.nativeEvent.preventDefault();
    }

}
export default Event;
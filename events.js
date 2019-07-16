class Events {
    constructor() {
        this.baseEvents = {
            click: (event) => {
                if (event.target.getControl) {
                    let control = event.target.getControl()
                    this.dispatchEvent(control, 'click', event);
                }
            }
        }
    }
    dispatchEvent(control, name, event) { 
        if (control['on' + name] && control['on' + name](event) === false || (control['$' + name] && control['$' + name](event) === false)) {
            event.preventDefault();
        }
    }
}

export default new Events();
// var addEventListeners = function (obj, events) {
//     for (var key in events) {
//         if (events.hasOwnProperty(key)) {
//             obj.addEventListener(key, events[key]);
//         }
//     }
// };
// var events = {
    
// }
// bug = {
    

// }
// function Click() {
    
// }
// Click.prototype.onclick = function () {
//     console.log(1);
// }
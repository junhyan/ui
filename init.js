import core from './core.js';

document.addEventListener('DOMContentLoaded', function () {
    core.init();
});


// var addEventListeners = function (obj, events) {
//     for (var key in events) {
//         if (events.hasOwnProperty(key)) {
//             obj.addEventListener(key, events[key]);
//         }
//     }
// };
// var events = {
//     click: function (event) {
//         if (event.target.getControl) {
//             var control =event.target.getControl()
//             bug.dispatchEvent(control, 'click', event);
//         }
//     }
// }
// bug = {
//     init: function () {
//         addEventListeners(window, events);
//         Array.from(document.body.getElementsByTagName('*')).forEach(item => {
//             this.create(Button, item);
//         });
//     },
//     create: function (Control, el) {
//         var control = new Control(el);
//         // control.main = el;
//         // el.control = control;
//         // el.getControl = function () {
//         //     return this.control;
//         // }
//     },
//     dispatchEvent: function (control, name, event) {
       
//         if (control['on' + name] && control['on' + name](event) === false) {
//             event.preventDefault();
//         }

       
//     },

// }
// function Click() {
    
// }
// Click.prototype.onclick = function () {
//     console.log(1);
// }
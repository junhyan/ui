/*
* Observe class
*/
import Dep from './dep.js'
class Observer {
    constructor(route, value) {
        this.route = route;
        this.walk(value);
    }
    walk(obj) {
        Object.keys(obj).forEach((key) => {
            this.defineReactive(obj, key, obj[key]);
        });
    }

    defineReactive(obj) {
        const dep = new Dep();
        this.route.data = new Proxy(obj, {
            get(target, key) {
                if (Dep.target) {
                    dep.addSub(Dep.target); // 在这里添加一个订阅者
                }
                return target[key];
            },
            set(target, key, newVal) {
                if (target[key] === newVal) {
                    return true;
                }
                target[key] = newVal;
                dep.notify();
                return true;
            }
        })
    }
    
    // getValue () {
    //     return this._value;
    // }
}
export default Observer;


// export function observer(value) {
    
// }

// export function defineReactive(obj, key, value) {
//     if (!value || typeof value !== 'object') {
//         return;
//     }
//     new Observer(value)
//     const dep = new Dep();
//     Object.defineProperty(obj, key, {
//         enumerable: true,
//         configurable: true,
//         get: function () {
//             if (Dep.target) {
//                 dep.addSub(Dep.target); // 在这里添加一个订阅者
//             }
//             return value;
//         },
//         set: function (newVal) {
//             if (value === newVal) {
//                 return;
//             }
//             value = newVal;
//             dep.notify();
//         }
//     });

// }

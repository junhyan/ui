/*
* Observe class
*/
import Dep from './dep.js'
export default class Watcher {
    constructor (route, key, callback) {
        this.route = route;
        this.key = key;
        this.callback = callback;
        this.value = this.get();
    }
    update () {
        this.run();
    }
    run () {
        var value = this.route.data[this.key];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.callback.call(this.route, value, oldVal);
        }
    }
    get () {
        Dep.target = this;  // 缓存自己
        var value = this.route.data[this.key];  // 强制执行监听器里的get函数
        Dep.target = null;  // 释放自己
        return value;
    }
}

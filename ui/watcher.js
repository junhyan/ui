/*
* Observe class
*/
import Dep from './dep.js'
export default class Watcher {
    constructor (control, key, callback) {
        this.control = control;
        this.key = key;
        this.callback = callback;
        this.value = this.get();
    }
    update () {
        this.run();
    }
    run () {
        var value = this.control.data[this.key];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.callback(this.key, value, oldVal);
        }
    }
    get () {
        Dep.target = this;  // 缓存自己
        var value = this.control.data[this.key];  // 强制执行监听器里的get函数
        Dep.target = null;  // 释放自己
        return value;
    }
}

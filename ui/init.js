import Core from './core.js';
import Observer from './observer.js';

document.addEventListener('DOMContentLoaded', function () {
    new Core().init();
    new Observer({a:1, b:2})
});

import Watcher from './watcher.js';
import util from './util.js'
import Controls from './controls.js';

export default class Compiler {
	nodeToFragment (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    }
    compileElement (el, core) {
        var childNodes = el.childNodes;
        Array.from(childNodes).forEach((node)  => {
            if (node.nodeType === 1) {
                let tagName = node.tagName.toLowerCase(),
                className = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
                core.create(Controls[className], node, this.getOptions(node, {test: 1}));
            } else if (node.nodeType === 3) {
                let text = node.textContent;
                let arr = text.match(/\$\{(.+?)\}/g);
                arr && arr.forEach((item) => {
                    text = text.replace(/\$\{(.+?)\}/, core.getRoute().context[RegExp.$1]);
                    // node.textContent = ;
                })
                console.log(text);
            }
            
            // var reg = /$\{(.*)\}/;
            // var text = node.textContent;

            // if (self.isTextNode(node) && reg.test(text)) {  // 判断是否是符合这种形式{{}}的指令
            //     self.compileText(node, reg.exec(text)[1]);
            // }

            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);  // 继续递归遍历子节点
            }
        });
    }
    compileText (node, key) {
       // var self = this;
       // var initText = this._component.getData()[key];
       // this.updateText(node, initText);  // 将初始化的数据初始化到视图中
        new Watcher(this._component, exp, function (value) { // 生成订阅器并绑定更新函数
            //self.updateText(node, value);
        });
    }
    getOptions(el, context) {
        let names = el.getAttributeNames();
        var options = {};
        names.forEach(item => {
            if (/^:([a-zA-Z0-9]+)/.test(item)) {
                const key = RegExp.$1;
                let value = el.getAttribute(item);
                if (/\${(.+)}/.test(value)) {
                    value = context[RegExp.$1];
                }
                options[key] = value;
            }
        });
        return options;
    }
}
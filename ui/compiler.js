import Watcher from './watcher.js';
import util from './util.js'
import RouteFactory from '../ui/route-factory.js';

var renderTree;
export default class Compiler {
    constructor(control, el) {
        this.control = control;
        // let parent = el.parentNode;
        let fragment = this.nodeToFragment(el);

        this.compileElement(fragment.firstChild);
        // el.appendChild(fragment);
    }
	nodeToFragment (el) {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(el);
        // while (child) {
        //     // 将Dom元素移入fragment中
        //     fragment.appendChild(child);
        //     child = el.firstChild
        // }
        return fragment;
    }
    create(Control, el, options) {
        if (!Control) {
            return null;
        }
        return new Control(el, options);
    }
    tmp() {
        if (node.nodeType === 1) {
            if (node.getAttributeNames().indexOf('if') !== -1) {
            
            }
            let tagName = node.tagName.toLowerCase(),
            className = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
           
            if (this.create(this.control.units[className], node, this.getOptions(node, {test: 1}))) {
                isControl = true;
            }
        } else if (node.nodeType === 3) {
            let text = node.textContent;
            let arr = text.match(/\$\{(.+?)\}/g);
            let strArr = text.split(/\$\{.+?\}/);
            let resArr = [];
            if (arr) {
                var count = 0
                arr.forEach((item, index) => {    
                    strArr.splice(2 * index + 1, 0, item);
                });
            }
            strArr.forEach((item) => {
                if (/\$\{(.+?)\}/.test(item)) {
                    let key = RegExp.$1;
                    item = {};
                    item[key] = this.control.model[key];
                }
                resArr.push(item);
            });
            let res = ''
            resArr.forEach((item) => {
                if (typeof(item) !== 'string') {
                    item = Object.values(item)[0];
                }
                res += item;
            });
            node.textContent = res;
            
            arr && arr.forEach((item) => {
                if (/\$\{(.+?)\}/.test(item)) {
                    new Watcher(this.control, RegExp.$1, (key, value) => {
                        let wathcRes = '';
                        resArr.forEach((resItem) => {
                            if (typeof(resItem) !== 'string') {
                                if (resItem.hasOwnProperty(key)) {
                                    resItem[key] = this.control.data[key]
                                }
                                resItem = Object.values(resItem)[0];
                            }
                            wathcRes += resItem;
                        });
                        node.textContent = wathcRes;
                    });
                }
                
            });
            
        }
    }
   
    compileElement (el) {
        
        let childNodes = el.childNodes,
            isControl = false,
            pre,
            parent = el.abstractNode;
        if (!parent) {
            let treeNode = new RenderNode(el, el.attributes);
            renderTree = treeNode
            parent = treeNode;
        }
        Array.from(childNodes).forEach((node)=> {
            let treeNode = new RenderNode('normal', node, node.attributes);
            if (pre) {
                pre.nextSibling = treeNode;
            }
            treeNode.preSibling = pre;
            pre = treeNode;
            parent && parent.children.push(treeNode);
            if (node.nodeType === 1) {
                // if (node.id === 'index') {
                //     debugger
                //             }
                let tagName = node.tagName.toLowerCase(),
                    controlName = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
                    
                if (this.control.units.hasOwnProperty(controlName)) {
                    treeNode.type = 'control';
                    // parent.children.push(treeNode);
                    treeNode.control = this.create(this.control.units[controlName], node, this.getOptions(node, {test: 1}));
                    treeNode.control.parent = this.control;
                    isControl = true;
                } else {
                    isControl = false;
                }
            }
           
            if (node.childNodes && node.childNodes.length && !isControl) {
                this.compileElement(node);  // 继续递归遍历子节点
            }
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
class RenderNode {
    constructor( type, domNode, attrs, children, ifData, preSibling, nextSibling) {
        this.type = type;
        this.domNode = domNode;
        this.attrs = attrs;
        this.children = children || [];
        this.ifData = ifData;
        this.preSibling = preSibling;
        this.nextSibling = nextSibling;
        domNode.abstractNode = this;
    }
 }
 export {renderTree};

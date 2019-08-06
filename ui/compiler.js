import Watcher from './watcher.js';
import util from './util.js'
import RouteFactory from '../ui/route-factory.js';

class RenderNode {
    constructor(tag, className, style,  children = []) {
        this.tag = tag;
        this.className = className;
        this.style = style;
        this.children = children;
    }
 }
 class AstNode {
    constructor(tag, className, style, commands = {}, parent, children = [], pre, next, text) {
        this.tag = tag;
        this.className = className;
        this.style = style;
        this.commands = commands;
        this.parent = parent;
        this.children = children;
        this.pre = pre;
        this.next = next;
        this.text = text;
    }
 }
var curRenderRoot = new RenderNode(),
    renderTree = curRenderRoot;
var Commands = [
    'IF',
    'ELSEIF',
    'ELSE',
    'FOR',
    'BIND'
];
export default class Compiler {
    constructor(control) {
        this.control = control;
        // let parent = el.parentNode;
        // let fragment = this.nodeToFragment(el);

        // this.compileElement(fragment.firstChild);
        // el.appendChild(fragment);
        this.createAST(control.view);
    }
    createAST(elStr) {
        let tmpEL = document.createElement('DIV');
        tmpEL.innerHTML = elStr;
        let root = new AstNode();
        function getComments(node, commands) {
            //let commands = {};
            node.getAttributeNames().forEach((item) => {
                if (Commands.indexOf(item.toUpperCase()) !== -1) {
                    if (item.toUpperCase() === 'ELSE') {
                        commands[item.toUpperCase()] = true;
                    } 
                    // else if (item.toUpperCase() === 'FOR') {
                    //     let str = node.getAttribute(item);
                    //     let arr = str.split('as');
                    //     node.scope = 
                    // } 
                    else {
                        commands[item.toUpperCase()] = node.getAttribute(item);
                    }
                }
            });
            //return commands;
        }
        function ast (root, el) {
            let pre = null, next = null;
            Array.from(el.childNodes).forEach( (item) => {
                let node = new AstNode();
                if (item.nodeType === 1) {
                    
                    node.tag = item.tagName;
                    node.className = item.className;
                    node.style = item.style;
                    node.parent = root;
                    root.children.push(node);
                    getComments(item, node.commands);
                    
                } else if (item.nodeType === 3) {
                    let node = new AstNode();
                    node.parent = root;
                    root.children.push(node);
                    node.text = item.textContent;
                }
                if (pre) {
                    pre.next = node;
                }
                node.pre = pre;
                pre = node;
                ast(node, item);
            });
        }
        ast(root, tmpEL);
        this.control.astTree = root;
        curRenderRoot.scope =  this.control.model;
        this.createRenderTree(curRenderRoot);

    }
    getData(node, key) {
        for ( ;node; node = node.parent) {
            if (node.scope && node.scope.hasOwnProperty(key)) {
                return node.scope[key];
            }
        }
    }
    createRenderNode (item) {
        let renderNode = new RenderNode();
        renderNode.tag = item.tag;
        renderNode.style = item.style;
        renderNode.className = item.className;
        let tagName = item.tag.toLowerCase(),
            controlName = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
        if (this.control.units.hasOwnProperty(controlName)) {
            curRenderRoot = renderNode;  
            renderNode.control = this.create(this.control.units[controlName]);
        }
        return renderNode;
    }
    createRenderTree (renderRoot) {
        let that = this;
        function renderer (astRoot, root) {
            let tag = {}, count = 0;

            astRoot.children.forEach( (item) => {
                let renderNode;
                if (item.tag) {
                    //console.log(item.commands.IF)
                    if (!util.isEmptyObject(item.commands)) {
                        if (item.commands.IF) {
                            ++count;
                        }
                        if (that.control.model[item.commands.IF]) {
                            renderNode = that.createRenderNode(item);
                            tag[count] = true;
                           
                        } else if (that.control.model[item.commands.ELSEIF] && !tag[count]) {

                            renderNode = that.createRenderNode(item);
                            tag[count] = true;
                        } else if (item.commands.ELSE && !tag[count]) {
                            renderNode = that.createRenderNode(item);
                        } else if (item.commands.FOR) {
                            let str = item.commands.FOR;
                            let arr = str.split('as');
                            renderNode = [];
                            that.control.model[arr[0].trim()].forEach( (dataItem, index) => {
                                let forNode = that.createRenderNode(item);
                                forNode.scope = {};
                                forNode.scope[arr[1].trim()] = dataItem;
                                renderNode.push(forNode);
                            });
                        }
                    } else {
                        renderNode = that.createRenderNode(item);
                    }
                    
                } else {
                    renderNode = new RenderNode();
                    renderNode.text = that.parseText(item.text, root);
                }
                if (renderNode) {
                    if (!(renderNode instanceof Array)) {
                        renderNode = [renderNode];
                    }
                    renderNode.forEach((nodeItem) => {
                        root.children.push(nodeItem); 
                        renderer(item, nodeItem);
                    });
                }

            });
        };

        renderer(this.control.astTree, renderRoot);
        // TMP workaround
        if (this.control.constructor.name === 'Main') {
            let fragment = document.createDocumentFragment();
            function render (root, el) {
                root.children.forEach( (item) => {
                    let child;
                    if (item.tag) {
                        child = document.createElement(item.tag);
                        util.copy(child, {
                            className: item.className,
                            style: item.style.cssText
                        });
                        // control 与 el bind 
                        if (item.control) {
                            child.control = item.control;
                            item.control.main = child;
                        }
                    } else {
                        child = document.createTextNode(item.text);
                    }
                    
                    el.appendChild(child);
                    render(item, child);
                });
            }
            render(renderTree, fragment);
            document.body.appendChild(fragment);            
        }
    }
    parseText(text, node) {
        let arr = text.match(/\$\{(.+?)\}/g);
        let strArr = text.split(/\$\{.+?\}/);
        let resArr = [];
        if (arr) {
            arr.forEach((item, index) => {    
                strArr.splice(2 * index + 1, 0, item);
            });
        }
        strArr.forEach((item) => {
            if (/\$\{(.+?)\}/.test(item)) {
                let key = RegExp.$1;
                item = {};
                if (key === 'test') {

                }
                item[key] = this.getData(node, key);
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
        return res;
    }
	// nodeToFragment (el) {
    //     var fragment = document.createDocumentFragment();
    //     fragment.appendChild(el);
    //     // while (child) {
    //     //     // 将Dom元素移入fragment中
    //     //     fragment.appendChild(child);
    //     //     child = el.firstChild
    //     // }
    //     return fragment;
    // }
    create(Control) {
        if (!Control) {
            return null;
        }
        return new Control();
    }
    // tmp() {
    //     if (node.nodeType === 1) {
    //         if (node.getAttributeNames().indexOf('if') !== -1) {
            
    //         }
    //         let tagName = node.tagName.toLowerCase(),
    //         className = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
           
    //         if (this.create(this.control.units[className], node, this.getOptions(node, {test: 1}))) {
    //             isControl = true;
    //         }
    //     } else if (node.nodeType === 3) {
    //         let text = node.textContent;
    //         let arr = text.match(/\$\{(.+?)\}/g);
    //         let strArr = text.split(/\$\{.+?\}/);
    //         let resArr = [];
    //         if (arr) {
    //             var count = 0
    //             arr.forEach((item, index) => {    
    //                 strArr.splice(2 * index + 1, 0, item);
    //             });
    //         }
    //         strArr.forEach((item) => {
    //             if (/\$\{(.+?)\}/.test(item)) {
    //                 let key = RegExp.$1;
    //                 item = {};
    //                 item[key] = this.control.model[key];
    //             }
    //             resArr.push(item);
    //         });
    //         let res = ''
    //         resArr.forEach((item) => {
    //             if (typeof(item) !== 'string') {
    //                 item = Object.values(item)[0];
    //             }
    //             res += item;
    //         });
    //         node.textContent = res;
            
    //         arr && arr.forEach((item) => {
    //             if (/\$\{(.+?)\}/.test(item)) {
    //                 new Watcher(this.control, RegExp.$1, (key, value) => {
    //                     let wathcRes = '';
    //                     resArr.forEach((resItem) => {
    //                         if (typeof(resItem) !== 'string') {
    //                             if (resItem.hasOwnProperty(key)) {
    //                                 resItem[key] = this.control.data[key]
    //                             }
    //                             resItem = Object.values(resItem)[0];
    //                         }
    //                         wathcRes += resItem;
    //                     });
    //                     node.textContent = wathcRes;
    //                 });
    //             }
                
    //         });
            
    //     }
    // }
   
    // compileElement (el) {
        
    //     let childNodes = el.childNodes,
    //         isControl = false,
    //         pre,
    //         parent = el.abstractNode;
    //     if (!parent) {
    //         let treeNode = new RenderNode(el, el.attributes);
    //         renderTree = treeNode
    //         parent = treeNode;
    //     }
    //     Array.from(childNodes).forEach((node)=> {
    //         let treeNode = new RenderNode('normal', node, node.attributes);
    //         if (pre) {
    //             pre.nextSibling = treeNode;
    //         }
    //         treeNode.preSibling = pre;
    //         pre = treeNode;
    //         parent && parent.children.push(treeNode);
    //         if (node.nodeType === 1) {
    //             // if (node.id === 'index') {
    //             //     debugger
    //             //             }
    //             let tagName = node.tagName.toLowerCase(),
    //                 controlName = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
                    
    //             if (this.control.units.hasOwnProperty(controlName)) {
    //                 treeNode.type = 'control';
    //                 // parent.children.push(treeNode);
    //                 treeNode.control = this.create(this.control.units[controlName], node, this.getOptions(node, {test: 1}));
    //                 treeNode.control.parent = this.control;
    //                 isControl = true;
    //             } else {
    //                 isControl = false;
    //             }
    //         }
           
    //         if (node.childNodes && node.childNodes.length && !isControl) {
    //             this.compileElement(node);  // 继续递归遍历子节点
    //         }
    //     });
    // }
   
    // getOptions(el, context) {
    //     let names = el.getAttributeNames();
    //     var options = {};
    //     names.forEach(item => {
    //         if (/^:([a-zA-Z0-9]+)/.test(item)) {
    //             const key = RegExp.$1;
    //             let value = el.getAttribute(item);
    //             if (/\${(.+)}/.test(value)) {
    //                 value = context[RegExp.$1];
    //             }
    //             options[key] = value;
    //         }
    //     });
    //     return options;
    // }
}

 export {renderTree};

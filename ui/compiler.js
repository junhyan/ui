import Watcher from './watcher.js';
import util from './util.js'
import RouteFactory from '../ui/route-factory.js';

class RenderNode {
    constructor(tag, className, style,  children = [], parent) {
        this.tag = tag;
        this.className = className;
        this.style = style;
        this.children = children;
        this.parent = parent;
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
//var curRenderRoot = new RenderNode()
//    renderTree = curRenderRoot;
var Commands = [
    'IF',
    'ELSEIF',
    'ELSE',
    'FOR'
];
export default class Compiler {
    constructor(control, parent) {
        this.control = control;
        this.parent = parent;
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
                let command = item.toUpperCase();
                if (Commands.indexOf(command) !== -1) {
                    if (item.toUpperCase() === 'ELSE') {
                        commands[command] = true;
                    } 
                    // else if (item.toUpperCase() === 'FOR') {
                    //     let str = node.getAttribute(item);
                    //     let arr = str.split('as');
                    //     node.scope = 
                    // } 
                    else {
                        commands[command] = node.getAttribute(item);
                    }
                } else if (/:.+/.test(item)) {
                    commands[item] = node.getAttribute(item);
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

        this.createRenderTree();

    }
    getData(node, key) {
        for ( ;node; node = node.parent) {
            if (node.scope && node.scope.hasOwnProperty(key)) {
                return node.scope[key];
            }
        }
    }
    createRenderNode (root, item) {
        let renderNode = new RenderNode();
        renderNode.tag = item.tag;
        renderNode.style = item.style;
        renderNode.className = item.className;
        let tagName = item.tag.toLowerCase(),
            controlName = tagName.charAt(0).toUpperCase() + util.toCamelCase(tagName.slice(1));
        if (this.control.units.hasOwnProperty(controlName)) {
            let props = {};
            for (let key in item.commands) {
                if (item.commands.hasOwnProperty(key)) {
                    if (/:(.+)/.test(key)) {
                        props[RegExp.$1] = this.getData(root, item.commands[key]);
                    }
                }
            } 
            renderNode.control = this.create(this.control.units[controlName], props);
           // renderNode.control.load();
            
        }
        return renderNode;
    }
    createRenderTree () {
        this.control.renderTree = new RenderNode();
        this.control.renderTree.scope =  this.control.model;
        this.control.renderTree.dom =  this.parent;
        Object.keys(this.control.model).forEach((key) => {
            new Watcher(this.control, key, (key, value) => {
                this.createRenderTree();
            });
        });
        
        let that = this;
        function renderer (astRoot, root) {
            let tag = {}, count = 0;

            astRoot.children.forEach( (item) => {
                let renderNode;
                if (item.tag) {
                    if (!util.isEmptyObject(item.commands)) {
                        if (item.commands.IF) {
                            ++count;
                        }
                        if (that.getData(root, item.commands.IF)) {
                            renderNode = that.createRenderNode(root, item);
                            tag[count] = true;
                           
                        } else if (that.getData(root,item.commands.ELSEIF) && !tag[count]) {

                            renderNode = that.createRenderNode(root, item);
                            tag[count] = true;
                        } else if (item.commands.ELSE && !tag[count]) {
                            renderNode = that.createRenderNode(root, item);
                        } else if (item.commands.FOR) {
                            let str = item.commands.FOR;
                            let arr = str.split('as');
                            renderNode = [];
                            that.getData(root, arr[0].trim()).forEach((dataItem, index) => {
                                let forNode = that.createRenderNode(root, item);
                                let varialbe = arr[1].split(',');
                                forNode.scope = {};
                                forNode.scope[varialbe[0].trim()] = dataItem;
                                forNode.scope[varialbe[1].trim()] = index;
                                renderNode.push(forNode);
                            });
                        }
                    } else {
                        renderNode = that.createRenderNode(root, item);
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
                        nodeItem.parent = root;
                        renderer(item, nodeItem);
                    });
                }
                
            });
        };
        
        renderer(this.control.astTree, this.control.renderTree);
        if (this.control.oldRenderTree) {
            let res = this.compare(this.control.oldRenderTree, this.control.renderTree)
            res.forEach((item) => {
                this.renderControl(item, item.dom);
            });
        } else {
            this.renderControl(this.control.renderTree, this.parent);
        }
        this.control.oldRenderTree = this.control.renderTree;

    }
    // 根据树的层次遍历 判断是否相同，返回所有的有变化的父节点
    compare(oldTree, newTree) {
        let res = [],
            oldArr = [oldTree],
            newArr = [newTree];
       while (oldArr.length && newArr.length) {
            // if (oldArr.length !== newArr.length) {
            //     res.push(newArr[0].parent);
            //     continue;
            // }
            let tmpOld = [], tmpNew = [];
            for (let i = 0; i < Math.min(oldArr.length, newArr.length); i++) {
                let diff = false;
                let oldChildren = oldArr[i].children,
                    newChildren = newArr[i].children;
                newArr[i].dom = oldArr[i].dom;                
                if (oldChildren.length !== newChildren.length) {
                    res.push(newArr[i]);
                    diff = true;
                    break;
                } else {
                    for (let j = 0; j < oldChildren.length; j++) {
                        if (oldChildren[j].text !== newChildren[j].text) {
                            res.push(newArr[i]);
                            diff = true;
                            break;
                        }
                    }    
                }
                if (!diff) {
                    tmpOld = tmpOld.concat(oldArr[i].children);
                    tmpNew = tmpNew.concat(newArr[i].children);
                }
                
            }
            oldArr = tmpOld;
            newArr = tmpNew;
            // if (!diff) {
            //     let tmpArr = [];
            //     tmpArr =  tmpArr.concat(oldArr);
            //     console.log(tmpArr);
            //     oldArr = [];
            //     tmpArr.forEach((item) => {
            //         oldArr = oldArr.concat(item.children);
            //     });
            //     tmpArr = [];
            //     tmpArr =  tmpArr.concat(newArr);

            //     console.log(tmpArr);

            //     newArr = [];
            //     tmpArr.forEach((item) => {
            //         newArr = newArr.concat(item.children);
            //     });
            //     debugger
            // } else {

            // }
        }
        // if (oldTree.children[0].children[0].text !== newTree.children[0].children[0].text) {
        //     res.push({renderParent: newTree.children[0], parent:oldTree.children[0].dom});
        // }
        return res;
    }
    renderControl(renderTree, parent) {
        parent.innerHTML = '';
        if (renderTree.children.length === 0 || parent.nodeType === 3) {
            return;
        }
        let controls = [];
        let fragment = document.createDocumentFragment();
        renderTree.children.forEach((item) => {
            let child;
            if (item.tag) {
                
                child = document.createElement(item.tag);
                util.copy(child, {
                    className: item.className,
                    style: item.style.cssText
                });
                item.dom = child;
                // control 与 el bind 
                if (item.control) {
                    child.control = item.control;
                    item.control.main = child;
                    controls.push(item.control);
                }
            } else {
                child = document.createTextNode(item.text);
            }
            fragment.appendChild(child);
            
            this.renderControl(item, child);
        });
        parent.appendChild(fragment);
        controls.forEach((control) => {
            control.load(control.main);
        });
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
	
    create(Control, props) {
        if (!Control) {
            return null;
        }
        return new Control(props);
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

 // export {renderTree};

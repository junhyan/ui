const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var document = new JSDOM('<body></body>').window.document;

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

var Commands = [
    'IF',
    'ELSEIF',
    'ELSE',
    'FOR'
];
function createAST(elStr) {
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
                else {
                    commands[command] = node.getAttribute(item);
                }
            } else if (/:.+/.test(item)) {
                commands[item] = node.getAttribute(item);
            }
        });
    }
    function ast (root, el) {
        let pre = null, next = null;
        Array.from(el.childNodes).forEach( (item) => {
            let node = new AstNode();
            if (item.nodeType === 1) {
                
                node.tag = item.tagName;
                node.className = item.className;
                node.style = item.style.cssText;
                root.children.push(node);
                getComments(item, node.commands);
                
            } else if (item.nodeType === 3) {
                let node = new AstNode();
                root.children.push(node);
                node.text = item.textContent;
            }
            ast(node, item);
        });
    }
    ast(root, tmpEL);
    return JSON.stringify(root);
}
module.exports = function(source) {
    let reg = /<view>([\S\s]*)<\/view>/;
    let paths = this.resourcePath.split('/'),
        css = paths[paths.length - 1].split('.')[0] + '.css';
    source = `require('./${css}');\n` + source;
    if (reg.test(source)) {
        let elStr = RegExp.$1;
        source = source.replace(reg, 'const view=' + createAST(elStr.replace(/\n/g, '')));
    }
    return source;
};
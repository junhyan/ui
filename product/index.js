import Ui from '../ui/init.js'
import Main from './main.js'
new Ui().init(Main);
// class MyButton extends Controls.Button {
//     constructor(main) {
//         super(main);
//     }
//     $click() {
//         super.$click();
//     }
//     onclick() {
//         console.log('click');
//     }
//     onmouseover() {
//         // console.log('mouseover');
//     }
//     onmouseout() {
//         // console.log('mouseout');
//     }
//     onmousedown() {
//         // console.log('mousedown');
//     }
//     onmouseup() {
//         // console.log('mouseup');
//     }
//     onmousemove() {
//         // console.log('mousemove');
//     }
//     ontouchstart() {
//         // console.log('touchstart');
//     }
// }
// Controls.addControl(MyButton);
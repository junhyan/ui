import Control from '../ui/control.js'
import How from './control.js'
export default class Haha extends Control {
    constructor(main) {
        super(main, 'more', {units: {How}});
        // this.Controls = {
        //     How
        // }
    }
    onclick() {
        console.log('haha');
    }
}

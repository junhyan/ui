/*
* Observe class
*/
export default class Dep {
	constructor () {
		this.subs = [];
	}
	addSub (sub) {
    	this.subs.push(sub)
  	}
  	notify () {
		// TODO need to be optimized
  		this.subs.forEach(function(sub) {
            sub.update();
        });
  	}
}
Dep.target = null;

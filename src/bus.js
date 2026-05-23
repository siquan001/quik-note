let evs={};

// as you can see, this is a simple event emitter
// it's not very efficient, but it's simple and easy to use
// bus.on('anyevent',cb); to listen
// bus.off('anyevent',cb); to remove a listener
// bus.emit('anyevent',arg1,arg2,...); to emit an event

function on(ev,cb){
    if(!evs[ev])evs[ev]=[];
    evs[ev].push(cb);
}
function off(ev,cb){
    if(!evs[ev])return;
    let index=evs[ev].indexOf(cb);
    if(index!=-1)evs[ev].splice(index,1);
}
function emit(ev,...args){
    if(!evs[ev])return;
    evs[ev].forEach(cb=>cb(...args));
}

module.exports={on,off,emit};
if(!localStorage.getItem("quik-noter")){
    localStorage.setItem("quik-noter",'{}');
}
let sto=JSON.parse(localStorage.getItem("quik-noter"));

function get(){
    return sto;
}

function set(){
    localStorage.setItem("quik-noter",JSON.stringify(sto));
}

// usage:
// get().a="b"; .... // change content
// set() // save changes

// I have been used Proxy to dymacically save changes 
// instead of calling set() every time
// however when it comes to arr.unshift() or others,
// its performance is so terrible that the page freezes
// and the time complexity is O(n^2) or even worse
// Oh... I have thought it was a groundbreaking idea before ...


module.exports={
    get,
    set
}
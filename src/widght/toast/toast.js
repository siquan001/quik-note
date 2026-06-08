require("./toast.css");

let ct=el(".toast-con");
document.body.appendChild(ct);

// it's easy to understand the simple component
// for msg is msg and time is time(ms)

function toast(msg,time){
    let t=el(".toaster",{},'<div></div>');
    t.$("div").text(msg);
    ct.appendChild(t);
    setTimeout(()=>{
        t.addClass("hiding");
        setTimeout(()=>{
            t.remove();
        },300); // 300ms is the transition time
        // if css changed, the time should be also changed
    },time);
}

let lt;
function foot(msg,time){
    clearTimeout(lt);
    $(".footinfo").text(msg);
    lt=setTimeout(()=>{
        $('.footinfo').text('');
    },time);
}

module.exports={
    toast,foot
};
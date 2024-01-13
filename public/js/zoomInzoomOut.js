
document.querySelectorAll('.product-img').forEach(elem=>{
    let x,y,width,height;
    elem.onmouseenter =()=>{
        const size = elem.getBoundingClientRect();
        x=size.x;
        y= size.y;
        width = size.width;
        height = size.height;
    };
    elem.onmousemove = e=>{
        const horizontal = (e.clientX -x)/width*100;
        const vertical = (e.clientY -y)/height*100;

        elem.style.setProperty('--x',horizontal+'%');
        elem.style.setProperty('--y',vertical+'%')
    }
})

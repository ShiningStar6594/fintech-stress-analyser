function close_windows(modalID){
    document.getElementById(modalID).style.display = "none";
    document.body.classList.remove('stop_scrolling');
    document.documentElement.classList.remove('stop_scrolling');
}

function open_windows(modalID){
    document.getElementById(modalID).style.display = "block";
    document.body.classList.add('stop_scrolling');
    document.documentElement.classList.add('stop_scrolling');
}


window.onload = function(){
    modal_instructions.style.display = "block";
}

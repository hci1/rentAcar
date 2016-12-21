function display(openID){
    var sections = document.getElementsByTagName("section");
    var navs = document.getElementsByTagName("nav");

    for(var i = 0; i < navs.length; i++){
        var links = navs[i].getElementsByTagName("a");

        var classes = "";

        for(var j = 0; j < links.length; j++){
            links[j].className = classes;

            if(links[j].id === "link-" + openID){
                classes = "future";
            }
        }
    }

    for(var i = 0; i < sections.length; i++){
        sections[i].style.opacity = 0;
    }

    setTimeout(function(){
        for(var i = 0; i < sections.length; i++){
            sections[i].style.display = "none";
        }

        document.getElementById("section-" + openID).style.display = "block";

        setTimeout(function(){
            document.getElementById("section-" + openID).style.opacity = 1;
        }, 100);
    }, 100);
}

function displayTime() {
    var date = new Date();
    var hour = "0"  + date.getHours();
    var minute = "0" + date.getMinutes()
    document.getElementsByTagName("header")[0].innerHTML = hour.slice(-2) + ":" + minute.slice(-2);
}

window.onload = function() {
    displayTime()
    setInterval(displayTime, 60000);
}

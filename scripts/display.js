function userStatus(type){
    var message = document.getElementById("user");

    if(type === login){
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if(username !== "" && password !== ""){
            display("start");
            message.innerHTML = "Hallo, " + username + "! <a onclick='userStatus(logout)'>Abmelden</a>";
        }
    }else if(type === logout){
        message.innerHTML = "<a onclick=\"display('login')\">Anmelden</a>";
        display("start");
    }
}

function show(optionsHeader){
    var options = document.getElementsByClassName("options");
    var index = [].indexOf.call(options, optionsHeader);
    var option = options[index + 1];

    if(option.style.display === "block"){
        option.style.display = "none";
    }else{
        option.style.display = "block";
    }
}

function display(openID){
    var sections = document.getElementsByTagName("section");
    var navs = document.getElementsByTagName("nav");
    var neighbors = getNeighbors(openID);

    var specialSections = ["start", "success", "login"]

    if (specialSections.indexOf(openID) !== -1){
        document.getElementById("navilinks").style.display = "none";

        for(var i = 0; i < navs.length; i++){
            navs[i].style.display = "none";
        }
    }

    if(neighbors[0] !== ""){
        document.getElementById("back").onclick = function(){display(neighbors[0])};
        document.getElementById("back").style.opacity = 1;
    }else{
        document.getElementById("back").style.opacity = 0;
    }

    if(neighbors[1] !== ""){
        document.getElementById("forth").onclick = function(){display(neighbors[1])};
        document.getElementById("forth").style.opacity = 1;
    }else{
        document.getElementById("forth").style.opacity = 0;
    }

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

    var section = document.getElementById("section-" + openID);
    var firstOptions = section.getElementsByTagName("div")[0];

    if (firstOptions !== undefined){
        firstOptions.style.display = "block";
    }

    setTimeout(function(){
        for(var i = 0; i < sections.length; i++){
            sections[i].style.display = "none";
        }

        section.style.display = "block";

        setTimeout(function(){
            section.style.opacity = 1;
        }, 100);
    }, 100);
}

function getNeighbors(id){
    var neighbors = [];
    var index

    sections.forEach(function(section){
        if ((index = section.indexOf(id)) !== -1){
            if(index === 0){
                neighbors.push("start");
                neighbors.push(section[index+1]);
            }else if(index === section.length-1){
                neighbors.push(section[index-1]);
                neighbors.push("success");
            }else{
                neighbors.push(section[index-1]);
                neighbors.push(section[index+1]);
            }
        }
    });

    return neighbors !== []? neighbors: ["", ""];
}

function choose(tourType){
    var items = document.getElementsByClassName(tourType);

    items[0].style.display = "block";
    display(items[1].getElementsByTagName("section")[0].id.split("-")[1]);

    document.getElementById("navilinks").style.display = "block";
}

function displayTime() {
    var date = new Date();
    var hour = "0"  + date.getHours();
    var minute = "0" + date.getMinutes();
    document.getElementById("time").innerHTML = hour.slice(-2) + ":" + minute.slice(-2);
}

window.onload = function() {
    displayTime();
    setInterval(displayTime, 60000);
    display("start");
}

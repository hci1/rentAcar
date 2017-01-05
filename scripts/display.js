function userStatus(type){
    var message = document.getElementById("user");

    if(type === login){
        var username = document.getElementById("username");
        var password = document.getElementById("password");
        var error = document.getElementById("login_error");

        if(username.value !== "" && password.value !== ""){
            display("start");
            message.innerHTML = "Hallo, " + username.value +
                    "! (<a onclick='userStatus(logout)'>Abmelden</a>)";

            username.value = "";
            password.value = "";
            error.innerHTML = "";
        }else{
            error.innerHTML =
                "Bitte geben Sie sowohl Ihren Benutzernamen als auch Ihr Kennwort ein.";
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

    for(var i = 1; i < options.length; i+=2){
        options[i].style.opacity = 0;
    }

    setTimeout(function(){
        for(var i = 1; i < options.length; i+=2){
            options[i].style.display = "none";
        }

        option.style.display = "block";

        setTimeout(function(){
            option.style.opacity = 1;
        }, 100);
    }, 100);
}

function display(openID){
    console.log("Opening: " + openID);

    //get all correxsponding elements from the DOM structure here
    var sections = document.getElementsByTagName("section");
    var navs = document.getElementsByTagName("nav");
    var options = document.getElementsByClassName("options");

    //retrieve the neighbours of this section
    var neighbors = getNeighbors(openID);

    var i;

    //if openID is either start, success or openID do the following:
    if (["start", "success", "login"].indexOf(openID) !== -1){
        if(openID === "login"){
            document.getElementById("navilinks").style.display = "block";
        }else{
            //in this case, we want to hide the whole navigation element since
            //we are on page "start" or "success"
            document.getElementById("navilinks").style.display = "none";
        }

        //start the loading animation
        document.getElementById("thanks").style.opacity = 0;
        document.getElementById("loader").style.opacity = 1;

        //simulate a loading animation for 1000ms
        if(openID === "success"){
            setTimeout(function(){
                document.getElementById("thanks").style.opacity = 1;
                document.getElementById("loader").style.opacity = 0;
            }, 1000);
        }

        //make all navigation elements invisible
        for(i = 0; i < navs.length; i++){
            navs[i].style.display = "none";
        }
    }


    //if the predeccessor is available, enable the back button, disable it otherwise
    if(neighbors[0] !== ""){
        document.getElementById("back").onclick = function(){display(neighbors[0]);};
        document.getElementById("back").style.opacity = 1;
    }else{
        document.getElementById("back").style.opacity = 0;
    }

    //if thefollow up ID is available, enable the next button, disable it otherwise
    if(neighbors[1] !== ""){
        document.getElementById("forth").onclick = function(){display(neighbors[1]);};
        document.getElementById("forth").style.opacity = 1;
    }else{
        document.getElementById("forth").style.opacity = 0;
    }

    //set a grey circle for all options not visited yet
    for(i = 0; i < navs.length; i++){
        var links = navs[i].getElementsByTagName("a");

        var classes = "";

        for(var j = 0; j < links.length; j++){
            links[j].className = classes;

            if(links[j].id === "link-" + openID){
                classes = "future";
            }
        }
    }

    //make invisible all options
    for(i = 1; i < options.length; i+=2){
        options[i].style.opacity = 0;
        options[i].style.display = "none";
    }

    var section = document.getElementById("section-" + openID);
    var firstOption = section.getElementsByTagName("div")[0];

    //make visible the first option
    if (firstOption !== undefined){
        firstOption.style.display = "block";
        firstOption.style.opacity = 1;
    }

    for(i = 0; i < sections.length; i++){
        sections[i].style.opacity = 0;
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

//return all neighbours of this ID
function getNeighbors(id){
    //neighbours are in correct order in the html document
    //we may therefore just retrieve them by index
    var neighbors = [];
    var index;

    sections.forEach(function(section){
        if ((index = section.indexOf(id)) !== -1){
            if(index === 0){
                //special case: there is no neighbour prior to the start ID
                neighbors.push("start");
                neighbors.push(section[index+1]);
            }else if(index === section.length-1){
                //special case: there is no neighbour after the successs ID
                neighbors.push(section[index-1]);
                neighbors.push("success");
            }else{
                //default: add pre section and following section to the return array
                neighbors.push(section[index-1]);
                neighbors.push(section[index+1]);
            }
        }
    });

    return neighbors.length !== 0? neighbors: ["start", ""];
}

function choose(tourType){
    var items = document.getElementsByClassName(tourType);

    items[0].style.display = "block";
    display(items[1].getElementsByTagName("section")[0].id.split("-")[1]);

    document.getElementById("navilinks").style.display = "block";
}

function currentTime(fieldID){
    var offsetInMilliseconds = (new Date()).getTimezoneOffset() * 60000;
    var time = new Date(Date.now() - offsetInMilliseconds).toISOString().slice(0, -8);
    document.getElementById(fieldID).value = time;
}

function myLocation(fieldID){
    document.getElementById(fieldID).value = "Appelstraße 4, 30167 Hannover";
}

function select(optionID){
    var option = document.getElementById(optionID);

    if(option.className === "selected"){
        option.className = "";

        // TODO: do un-selecting stuff
    }else{
        if(option.parentNode.className.split(" ").indexOf("single") !== -1){
            var children = option.parentNode.getElementsByTagName("a");

            for(var i = 0; i < children.length; i++){
                children[i].className = "";

                // TODO: do un-seleting stuff for choices with only one option
            }
        }

        option.className = "selected";

        // TODO: do selecting stuff
    }
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
};

function userStatus(type){
    var message = document.getElementById("user");

    if(type === login){
        var username = document.getElementById("username");
        var password = document.getElementById("password");
        var error = document.getElementById("login_error");

        if(username.value !== "" && password.value !== ""){
            saveUsername();
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
    console.log("Optionsheader: "+optionsHeader);
    var options = document.getElementsByClassName("options");
    var index = Array.prototype.indexOf.call(options, optionsHeader);
    var i;

    var option = options[index + 1];

    // make invisible
    for(i = 1; i < options.length; i++){
        if(options[i].tagName.toLowerCase() === "div")
            options[i].style.opacity = 0;
    }

    setTimeout(function(){
        // for(var i = 1; i < options.length; i+=2){
        //     options[i].style.display = "none";
        // }

        for(i = 1; i < options.length; i++){
            if(options[i].tagName.toLowerCase() === "div")
                options[i].style.display = "none";
        }

        option.style.display = "block";
        // when not using inline display-style this looks weird...
        if(option.id === "overview-default" || option.id === "overview-sightseeing")
            option.style.display = "inline";

        setTimeout(function(){
            option.style.opacity = 1;
        }, 100);
    }, 100);
}

function display(openID){
    console.log("Opening: " + openID);

    if(openID === "payment")
      updatePayment();
    else if (openID === "pay")
      updatePay();

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
        if(firstOption.id === "overview-default" || firstOption.id === "overview-sightseeing")
            firstOption.style.display = "inline";
        firstOption.style.opacity = 1;

        for(i=0; i < firstOption.children.length; i++){
          firstOption.children[i].display = "block";
          firstOption.children[i].opacity = 1;
        }
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

// this will update the payment sectionand is called from show(...) before opending the tab
function updatePayment(){
    var curImage, curDescr;

    curDescr = document.getElementById("chosencar-descr");
    curDescr.innerHTML = "Auto: "+values.car.slice(values.car.indexOf('-')+1);

    curDescr = document.getElementById("choseninterior-descr");
    curDescr.innerHTML = "Innenraum: <ul>";
    for(i=0; i<values.interior.length;i++)
    {
        curDescr.innerHTML += "<li>"+values.interior[i].slice(values.interior[i].indexOf('-')+1)+"</li>";
    }
    curDescr.innerHTML += "</li>";

    curDescr = document.getElementById("chosenextra-descr");
    curDescr.innerHTML = "Extras: <ul>";
    for(i=0; i<values.extra.length;i++)
    {
        curDescr.innerHTML += "<li>"+values.extra[i].slice(values.extra[i].indexOf('-')+1)+"</li>";
    }
    curDescr.innerHTML += "</li>";

    curDescr = document.getElementById("chosenstart-descr");
    curDescr.innerHTML = "Start: "+values.startDate+" ab "+values.startCity;

    curDescr = document.getElementById("chosenend-descr");
    curDescr.innerHTML = "Ziel: "+values.endCity;
}

function updatePay(){
  var curImage, curDescr;

  //when we are searching a string for an occurence of '-' to determine, when the actual property name starts,
  //we need to ignore the first - after 'tourism-'. therefore we may skip tourismDescriptorOffset
  //chars on indexOf(...)-search.
  var tourismDescriptorOffset = "tourism-".length;

  curDescr = document.getElementById("s-chosencity-descr");
  curDescr.innerHTML = "Stadt: "+values.city.slice(values.city.indexOf('-')+1);

  curDescr = document.getElementById("s-chosensights-descr");
  curDescr.innerHTML = "Sehenswürdigkeiten: <ul>";
  for(i=0; i<values.sights.length;i++)
  {
      curDescr.innerHTML += "<li>"+values.sights[i].slice(values.sights[i].indexOf('-')+1)+"</li>";
  }
  curDescr.innerHTML += "</li>";

  curDescr = document.getElementById("s-chosencar-descr");
  curDescr.innerHTML = "Auto: "+values["tourism-car"].slice(values["tourism-car"].indexOf('-',tourismDescriptorOffset)+1);

  curDescr = document.getElementById("s-choseninterior-descr");
  curDescr.innerHTML = "Innenraum: <ul>";
  for(i=0; i<values.interior.length;i++)
  {
      curDescr.innerHTML += "<li>"+values["tourism-interior"][i].slice(values["tourism-interior"][i].indexOf('-',tourismDescriptorOffset)+1)+"</li>";
  }
  curDescr.innerHTML += "</li>";

  curDescr = document.getElementById("s-chosenextra-descr");
  curDescr.innerHTML = "Extras: <ul>";
  for(i=0; i<values["tourism-extra"].length;i++)
  {
      curDescr.innerHTML += "<li>"+values["tourism-extra"][i].slice(values["tourism-extra"][i].indexOf('-',tourismDescriptorOffset)+1)+"</li>";
  }
  curDescr.innerHTML += "</li>";

  curDescr = document.getElementById("s-chosenstart-descr");
  curDescr.innerHTML = "Start: "+values.startDate+" ab "+values.startCity;

  curDescr = document.getElementById("s-chosenend-descr");
  curDescr.innerHTML = "Ziel: "+values.endCity;
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

        //calls selectOption(...) in database.js
        deselectOption(optionID);
    }else{
        if(option.parentNode.className.split(" ").indexOf("single") !== -1){
            var children = option.parentNode.getElementsByTagName("a");

            for(var i = 0; i < children.length; i++){
                children[i].className = "";

                //calls selectOption(...) in database.js
                deselectOption(optionID);
            }
        }

        option.className = "selected";

        //calls selectOption(...) in database.js
        selectOption(optionID);
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

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

    if(optionsHeader.id === "auto" ||
       optionsHeader.id === "zahlung" ||
       optionsHeader.id === "tauto" ||
       optionsHeader.id === "tinnenraum" ||
       optionsHeader.id === "textras" ||
       optionsHeader.id === "tfahrt" ||
       optionsHeader.id === "tzahlung"){
        var neighbors = getNeighbors(optionsHeader.id);

        //if the predeccessor is available, enable the back button, disable it otherwise
            if(neighbors[0] !== ""){
                if(neighbors[0] === "auto"){
                    document.getElementById("back").onclick = function(){display(getNeighbors(neighbors[0])[0]);
                    show(document.getElementById(neighbors[0]));};
                }else if(neighbors[0] === "tfahrt"){
                    document.getElementById("back").onclick = function(){display("details");
                    show(document.getElementById(neighbors[0]));};
                }else if(neighbors[0] === "tauto" ||
                            neighbors[0] === "tinnenraum" ||
                            neighbors[0] === "textras"){
                    document.getElementById("back").onclick = function(){show(document.getElementById(neighbors[0]));};
                }else{
                document.getElementById("back").onclick = function(){display(neighbors[0]);};
                }
                document.getElementById("back").style.opacity = 1;
            }else{
                document.getElementById("back").style.opacity = 0;
            }

            //if the follow up ID is available, enable the next button, disable it otherwise
            if(neighbors[1] !== ""){
                if(neighbors[1] === "auto" ||
                            neighbors[1] === "zahlung" ||
                            neighbors[1] === "tauto" ||
                            neighbors[1] === "tinnenraum" ||
                            neighbors[1] === "textras" ||
                            neighbors[1] === "tfahrt" ||
                            neighbors[1] === "tzahlung"){
                    document.getElementById("forth").onclick = function () {
                        checkData(this, neighbors, document.getElementById(neighbors[1]));
                    };
                }else{
                    document.getElementById("forth").onclick = function () {
                        checkData(this, neighbors, neighbors[1]);
                    };
                }
                document.getElementById("forth").style.opacity = 1;
            }else{
                document.getElementById("forth").style.opacity = 0;
            }
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

    try {
      if(openID === "payment")
        updatePayment();
      else if (openID === "pay")
        updatePay();
    } catch (e) {
      console.log("Unable to update summary due to an error:");
      console.log(e);
    }

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
        if(neighbors[0] === "auto"){
            document.getElementById("back").onclick = function(){display(getNeighbors(neighbors[0])[0]);
            show(document.getElementById(neighbors[0]));};
        }else if(neighbors[0] === "tfahrt"){
            document.getElementById("back").onclick = function(){display("details");
            show(document.getElementById(neighbors[0]));};
        }else if(neighbors[0] === "tauto" ||
            neighbors[0] === "tinnenraum" ||
            neighbors[0] === "textras"){
            document.getElementById("back").onclick = function(){show(document.getElementById(neighbors[0]));};
        }else{
        document.getElementById("back").onclick = function(){display(neighbors[0]);};
        }
        document.getElementById("back").style.opacity = 1;
    }else{
        document.getElementById("back").style.opacity = 0;
    }

    //if the follow up ID is available, enable the next button, disable it otherwise
    if(neighbors[1] !== ""){
        if(neighbors[1] === "auto" ||
         neighbors[1] === "zahlung" ||
         neighbors[1] === "tauto" ||
         neighbors[1] === "tinnenraum" ||
         neighbors[1] === "textras" ||
         neighbors[1] === "tfahrt" ||
         neighbors[1] === "tzahlung"){
            document.getElementById("forth").onclick = function () {
                checkData(this, neighbors, document.getElementById(neighbors[1]));
            };
        }else{
            document.getElementById("forth").onclick = function () {
                checkData(this, neighbors, neighbors[1]);
            };
        }
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

function checkData(obj, neighbors, data) {
    if (typeof data === "object") {
        var step = typeof neighbors === "object" ? neighbors.id : neighbors[1];

        if (step === "auto") {
            if (isEmpty(values.type)) {
                alert("Bitte wählen Sie einen Typ aus!");
                return;
            }
        }
        else if (step === "zahlung") {
            //Übersicht
        }
        else if (step === "tauto") {
            if (isEmpty(values["tourism-type"])) {
                alert("Bitte wählen Sie einen Autotypen aus!");
                return;
            }
        }
        else if (step === "tinnenraum") {
            if (isEmpty(values["tourism-car"])) {
                alert("Bitte wählen Sie ein Auto aus!");
                return;
            }
        }
        else if (step === "textras") {
            if (values["tourism-interior"].length == 0) {
                alert("Bitte wählen Sie mindestens einen Innenraum aus!");
                return;
            }
        }
        else if (step === "tfahrt") {
            if (values["tourism-extra"].length == 0) {
                alert("Bitte wählen Sie mindestens ein Extra aus!");
                return;
            }
        }
        else if (step === "tzahlung") {
            //Übersicht
        }

        show(data);
    }
    else {
        if (obj.className === "future") {
            return;
        }

        if (data === "interior") {
            if (isEmpty(values.car)) {
                alert("Bitte wählen Sie ein Auto aus!");
                return;
            }
        }
        else if (data === "seat") {
            if (values.interior.length == 0) {
                alert("Bitte wählen Sie mindestens einen Innenraum aus!");
                return;
            }
        }
        else if (data === "calendar") {
            if (values.extra.length == 0) {
                alert("Bitte wählen Sie mindestens ein Extra aus!");
                return;
            }
        }
        else if (data === "payment") {
            if (isEmpty(document.getElementById("startcity").value)) {
                alert("Bitte wählen Sie einen Start aus!");
                return;
            }
            else if (isEmpty(document.getElementById("startdate").value)) {
                alert("Bitte wählen Sie einen Startzeitpunkt aus!");
                return;
            }
            else if (isEmpty(document.getElementById("endcity").value)) {
                alert("Bitte wählen Sie ein Ziel aus!");
                return;
            }
        }
        else if (data === "success") {
            if (isEmpty(values.payment)) {
                alert("Bitte wählen Sie eine Zahlungsmethode aus!");
                return;
            }
        }
        else if (data === "sights") {
            if (isEmpty(values.city)) {
                alert("Bitte wählen Sie eine Stadt aus!");
                return;
            }
        }
        else if (data === "details") {
            if (values.sights.length == 0) {
                alert("Bitte wählen Sie mindestens ein Sehenswürdigkeit aus!");
                return;
            }
        }
        else if (data == "pay") {
            if (isEmpty(document.getElementById("tourism-startcity").value)) {
                alert("Bitte wählen Sie einen Start aus!");
                return;
            }
            else if (isEmpty(document.getElementById("tourism-startdate").value)) {
                alert("Bitte wählen Sie einen Startzeitpunkt aus!");
                return;
            }
            else if (isEmpty(document.getElementById("tourism-endcity").value)) {
                alert("Bitte wählen Sie ein Ziel aus!");
                return;
            }
        }

        display(data);
    }
}

function isEmpty(obj) {
    return typeof obj === 'undefined' || obj == "" || obj === null;
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
  for(i=0; i<values["tourism-interior"].length;i++)
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

    ids.forEach(function(section){
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

function change(optionID){
    if(optionID === "type-car"){
                document.getElementById("car-model").innerHTML =
                            '<a onclick="select(this.id)" id="car-Mercedes"><img src="media/options/cars/road-1762473_1920.jpg" alt=""/><br><p>Mercedes </p></a>'+
                            '<a onclick="select(this.id)" id="car-Mercedes SUV"><img src="media/options/cars/mercedes-1782740_1280.jpg" alt=""/><br><p>Mercedes SUV </p></a>'+
                            '<a onclick="select(this.id)" id="car-Range Rover"><img src="media/options/cars/range-rover-1806931_1920.jpg" alt=""/><br><p>Range Rover </p></a>'+
                            '<a onclick="select(this.id)" id="car-BMW Cabrio"><img src="media/options/cars/sports-car-1349147_1920.jpg" alt=""/><br><p>BMW Cabrio </p></a>';
        }
    if(optionID === "type-transporter"){
                document.getElementById("car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="car-Renault Trafic"><img src="media/options/cars/2014_Renault_Trafic_L2_H1_-_Fl.jpg" alt=""/><br><p>Renault Trafic </p></a>\
                            <a onclick="select(this.id)" id="car-Renault Kangoo"><img src="media/options/cars/renault-Kangoovan-F61-ph2-overview-Design.jpg.ximg.l_full_m.smart.jpg" alt=""/><br><p>Renault Kangoo </p></a>\
                            <a onclick="select(this.id)" id="car-Renault Master"><img src="media/options/cars/renault-master-1024x768-1.jpg" alt=""/><br><p>Renault Master </p></a>\
                            <a onclick="select(this.id)" id="car-VW Crafter"><img src="media/options/cars/volkswagen-crafter-2010-models-39255.jpg" alt=""/><br><p>VW Crafter </p></a>';
        }
    if(optionID === "type-bus"){
                document.getElementById("car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="car-Elektro Bus"><img src="media/options/cars/collective-435584_1920.jpg" alt=""/><br><p>Elektro-Bus </p></a>\
                            <a onclick="select(this.id)" id="car-Doppeldecker Schwarz"><img src="media/options/cars/edinburgh-1688490_1920.jpg" alt=""/><br><p>Doppeldecker Schwarz</p></a>\
                            <a onclick="select(this.id)" id="car-Doppeldecker Rot"><img src="media/options/cars/london-1567903_1920.jpg" alt=""/><br><p>Doppeldecker Rot</p></a>\
                            <a onclick="select(this.id)" id="car-VW Bus"><img src="media/options/cars/vw-camper-336606_1920.jpg" alt=""/><br><p>VW-Bus </p></a>';
        }
    if(optionID === "type-truck"){
                document.getElementById("car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="car-Kamaz"><img src="media/options/cars/kamaz-835535_1280.jpg" alt=""/><br><p>Kamaz </p></a>\
                            <a onclick="select(this.id)" id="car-Ford"><img src="media/options/cars/truck-1332564_1920.jpg" alt=""/><br><p>Ford </p></a>\
                            <a onclick="select(this.id)" id="car-Weißer Tieflader"><img src="media/options/cars/truck-1565478_1920.jpg" alt=""/><br><p>Weißer Tieflader </p></a>\
                            <a onclick="select(this.id)" id="car-Volvo"><img src="media/options/cars/volvo-1201106_1920.jpg" alt=""/><br><p>Volvo </p></a>';
        }

    if(optionID === "tourism-type-car"){
                document.getElementById("tourism-car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="tourism-car-Mercedes"><img src="media/options/cars/road-1762473_1920.jpg" alt=""/><br><p>Mercedes </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Mercedes SUV"><img src="media/options/cars/mercedes-1782740_1280.jpg" alt=""/><br><p>Mercedes SUV </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Range Rover"><img src="media/options/cars/range-rover-1806931_1920.jpg" alt=""/><br><p>Range Rover </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-BMW Cabrio"><img src="media/options/cars/sports-car-1349147_1920.jpg" alt=""/><br><p>BMW Cabrio </p></a>';
        }
    if(optionID === "tourism-type-transporter"){
                document.getElementById("tourism-car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="tourism-car-Renault Trafic"><img src="media/options/cars/2014_Renault_Trafic_L2_H1_-_Fl.jpg" alt=""/><br><p>Renault Trafic </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Renault Kangoo"><img src="media/options/cars/renault-Kangoovan-F61-ph2-overview-Design.jpg.ximg.l_full_m.smart.jpg" alt=""/><br><p>Renault Kangoo </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Renault Master"><img src="media/options/cars/renault-master-1024x768-1.jpg" alt=""/><br><p>Renault Master </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-VW-Crafter"><img src="media/options/cars/volkswagen-crafter-2010-models-39255.jpg" alt=""/><br><p>VW Crafter </p></a>';
        }
    if(optionID === "tourism-type-bus"){
                document.getElementById("tourism-car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="tourism-car-Elektro Bus"><img src="media/options/cars/collective-435584_1920.jpg" alt=""/><br><p>Elektro-Bus </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Doppeldecker Schwarz"><img src="media/options/cars/edinburgh-1688490_1920.jpg" alt=""/><br><p>Doppeldecker Schwarz</p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Doppeldecker Rot"><img src="media/options/cars/london-1567903_1920.jpg" alt=""/><br><p>Doppeldecker Rot</p></a>\
                            <a onclick="select(this.id)" id="tourism-car-VW Bus"><img src="media/options/cars/vw-camper-336606_1920.jpg" alt=""/><br><p>VW-Bus </p></a>';
        }
    if(optionID === "tourism-type-truck"){
                document.getElementById("tourism-car-model").innerHTML = '\
                            <a onclick="select(this.id)" id="tourism-car-Kamaz"><img src="media/options/cars/kamaz-835535_1280.jpg" alt=""/><br><p>Kamaz </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Ford"><img src="media/options/cars/truck-1332564_1920.jpg" alt=""/><br><p>Ford </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Weißer Tieflader"><img src="media/options/cars/truck-1565478_1920.jpg" alt=""/><br><p>Weißer Tieflader </p></a>\
                            <a onclick="select(this.id)" id="tourism-car-Volvo"><img src="media/options/cars/volvo-1201106_1920.jpg" alt=""/><br><p>Volvo </p></a>';
        }

    if(optionID === "city-Berlin1"){
                    document.getElementById("city-sights").innerHTML = '\
                            <a onclick="select(this.id)" id="sight-Brandenburger Tor"><img src="media/options/sights/berlin brandenburg-gate-1041803_1920.jpg" alt=""/><br><p>Brandenburger Tor </p></a>\
                            <a onclick="select(this.id)" id="sight-Kanzleramt"><img src="media/options/sights/berlin kanzleramt-637999_1920.jpg" alt=""/><br><p>Kanzleramt </p></a>\
                            <a onclick="select(this.id)" id="sight-Mauer"><img src="media/options/sights/berlin mauer-207136_1920.jpg" alt=""/><br><p>Mauer </p></a>\
                            <a onclick="select(this.id)" id="sight-Museumsinsel"><img src="media/options/sights/berlin museumsinsel-450643_1280.jpg" alt=""/><br><p>Museumsinsel </p></a>';
        }
    if(optionID === "city-Hannover"){
                        document.getElementById("city-sights").innerHTML = '\
                            <a onclick="select(this.id)" id="sight-Neuees Rathaus"><img src="media/options/sights/hannover neues rathaus-1718110_1920.jpg" alt=""/><br><p>Neues Rathaus </p></a>\
                            <a onclick="select(this.id)" id="sight-Herrenhäuser Gärten"><img src="media/options/sights/hannover gärten-1557381_1920.jpg" alt=""/><br><p>Herrenhäuser Gärten </p></a>\
                            <a onclick="select(this.id)" id="sight-Altstadt"><img src="media/options/sights/hanover alt stadt-329664_1920.jpg" alt=""/><br><p>Altstadt </p></a>\
                            <a onclick="select(this.id)" id="sight-Zoo"><img src="media/options/sights/zoo-hannover-1511967_1920.jpg" alt=""/><br><p>Zoo </p></a>';
        }
    if(optionID === "city-München"){
                        document.getElementById("city-sights").innerHTML = '\
                            <a onclick="select(this.id)" id="sight-Nymphenschloss"><img src="media/options/sights/münchen schloss nymphen-1787977_1920.jpg" alt=""/><br><p>Nymphenschloss </p></a>\
                            <a onclick="select(this.id)" id="sight-Marienplatz"><img src="media/options/sights/münchen marienplatz-1685882_1920.jpg" alt=""/><br><p>Marienplatz </p></a>\
                            <a onclick="select(this.id)" id="sight-Englischer Garten"><img src="media/options/sights/münchen englischer garten-953637_1920.jpg" alt=""/><br><p>Englischer Garten </p></a>\
                            <a onclick="select(this.id)" id="sight-Münchner Residenz"><img src="media/options/sights/münchner residenz.jpg" alt=""/><br><p>Münchner Residenz </p></a>';
        }
    if(optionID === "city-Dresden"){
                        document.getElementById("city-sights").innerHTML = '\
                            <a onclick="select(this.id)" id="sight-Opernhaus"><img src="media/options/sights/dresden semper-opera-house-1216572_1280.jpg" alt=""/><br><p>Opernhaus </p></a>\
                            <a onclick="select(this.id)" id="sight-Frauenkirche"><img src="media/options/sights/dresden frauenkirche-1252472_1920.jpg" alt=""/><br><p>Frauenkirche </p></a>\
                            <a onclick="select(this.id)" id="sight-Hofkirche"><img src="media/options/sights/dresden hofkirche-1541689_1920.jpg" alt=""/><br><p>Hofkirche </p></a>\
                            <a onclick="select(this.id)" id="sight-Zwinger"><img src="media/options/sights/dresden zwinger-956211_1920.jpg" alt=""/><br><p>Zwinger </p></a>';
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

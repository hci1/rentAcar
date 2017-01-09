//saving a variable works as follows:
//use saveSth() -> this will trigger set(...), to create a connections to save the variable.
//once it is created, put(...) will be called, with the stored value from values
//OR use selectOption(...)

var request = new XMLHttpRequest();

//always create a database (if already exisiting, nothing will happen)
//createDB();

request.onreadystatechange = function() {
	console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
	console.log("responseText: " + request.responseText||"No response text");

	// see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
	var DONE = 4;

	// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	var OK = 200;
	var NOT_FOUND = 404;

	var message;

	if (request.readyState == DONE) {
		if (request.status == OK) {
			var response = JSON.parse(request.responseText);
			message = {};
			message[response._id] = values[response._id];
      put(response, message);
		}
		if (request.status == NOT_FOUND) {
			var json = JSON.parse(request.responseText);
			console.log("Reason: "+json.reason);
			if (json.reason === "no_db_file" || json.reason === "Database does not exist.") {
				createDB();
			} else {
				var url = request.responseURL;
				console.log("Putting to URL: "+url);
				var i = url.lastIndexOf("/", url.length - 1);
				var name = url.substring(i + 1);
				message = {};
				message[name] = values[name];
        put({ "_id" : name }, message);
			}
		}
	}
	console.log("###################################");
};

function createDB() {
  request.open("PUT", dburl, false);
  request.send();
}

function put(response, message) {
	console.log("In put(): URL: "+dburl + response._id);

	request.open("PUT", dburl + response._id, false);
	request.setRequestHeader("Content-type", "application/json");
	message._id = response._id;
	if (response._rev) {
		message._rev = response._rev;
	}
	var s = JSON.stringify(message);
	console.log("In put(): send: "+s);
	console.log("In put(): message was: "+message);
	request.send(s);
}

function set(name) {
  request.open("GET", dburl + name, false);
  request.send();
}

var values = {
	"username"		: "",
	"type"				: "",
	"tourism-type": "",
	"car"					: "",
	"tourism-car"	: "",
	"interior"		: [],
	"tourism-interior": [],
  "extra"				: [],
	"tourism-extra": [],
  "startDate"		: "",
  "startCity"		: "",
  "endCity"			: "",
  "payment"			: "",
	"tourism-payment": "",
	"city"				: "",
  "sights"			: []
};

var dbname = "hci1";
var dburl = "http://localhost:5984/" + dbname + "/";

//all save functions retrieve their values from the html document by getting the
//inputs via ID
function saveUsername(name){
	if(name){
			values.username = name;
	}else {
		values.username = document.getElementById("username").value;
  }

	set("username");
}

function saveStartDate(date){
	if(date)
		values.startDate = date;
	else
		values.startDate = document.getElementById("startdate").value;

	set("startDate");
}

function saveStartCity(city){
	if(city)
		values.startCity = city;
	else
		values.startCity = document.getElementById("startcity").value;

	set("startCity");
}

function saveEndCity(city){
	if(city)
		values.endCity = city;
	else
		values.endCity = document.getElementById("endcity").value;

	set("endCity");
}

//selectOption is called from display.js and automatically sets (possibly adds) and saves the chosen option
function selectOption(optionID){
	if(optionID.startsWith("type")){
    values.type = optionID;
    set("type");
  }
	else if(optionID.startsWith("tourism-type")){
    values["tourism-type"] = optionID;
    set("tourism-type");
  }
  else if(optionID.startsWith("car")){
    values.car = optionID;
    set("car");
  }
	else if(optionID.startsWith("tourism-car")){
    values["tourism-car"] = optionID;
    set("tourism-car");
  }
  else if(optionID.startsWith("interior")){
    values.interior.push(optionID);
    set("interior");
  }
	else if(optionID.startsWith("tourism-interior")){
    values["tourism-interior"].push(optionID);
    set("tourism-interior");
  }
  else if(optionID.startsWith("extra")){
    values.extra.push(optionID);
    set("extra");
  }
	else if(optionID.startsWith("tourism-extra")){
    values["tourism-extra"].push(optionID);
    set("tourism-extra");
  }
  else if(optionID.startsWith("payment")){
    values.payment = optionID;
    set("payment");
  }
	else if(optionID.startsWith("tourism-payment")){
    values["tourism-payment"] = optionID;
    set("tourism-payment");
  }
  else if(optionID.startsWith("sight")){
    values.sights.push(optionID);
    set("sights");
  }
  else if(optionID.startsWith("city")){
    values.city = optionID;
    set("city");
  }
}

function deselectOption(optionID){
  if(optionID.startsWith("type")){
    values.type = "";
    set("type");
  }
	else if(optionID.startsWith("tourism-type")){
    values["tourism-type"] = "";
    set("tourism-type");
  }
  else if(optionID.startsWith("car")){
    values.car = "";
    set("car");
  }
	else if(optionID.startsWith("tourism-car")){
    values["tourism-car"] = "";
    set("tourism-car");
  }
	else if(optionID.startsWith("interior")){
    values.interior = removeElement(values.interior, optionID);
    set("interior");
  }
	else if(optionID.startsWith("tourism-interior")){
    values["tourism-interior"] = removeElement(values["tourism-interior"], optionID);
    set("tourism-interior");
  }
	else if(optionID.startsWith("extra")){
    values.extra = removeElement(values.extra, optionID);
    set("extra");
  }
	else if(optionID.startsWith("tourism-extra")){
    values["tourism-extra"] = removeElement(values["tourism-extra"], optionID);
    set("tourism-extra");
  }
  else if(optionID.startsWith("payment")){
    values.payment = optionID;
    set("payment");
  }
	else if(optionID.startsWith("tourism-payment")){
    values["tourism-payment"] = optionID;
    set("tourism-payment");
  }
  else if(optionID.startsWith("sight")){
    values.sights = removeElement(values.sights, optionID);
    set("sights");
  }
  else if(optionID.startsWith("city")){
    values.city = optionID;
    set("city");
  }
}

function removeElement(array, element){
  var newArray = [];

    for(i = 0; i <  array.length ; i++){
      if(array[i]!==element){
        newArray.push(array[i]);
      }
    }
    return newArray;
}

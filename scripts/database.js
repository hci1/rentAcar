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

	if (request.readyState == DONE) {
		if (request.status == OK) {
			var response = JSON.parse(request.responseText);
      put(response, values[response._id]);
		}
		if (request.status == NOT_FOUND) {
			var json = JSON.parse(request.responseText);
			if (json.reason === "no_db_file" || json.reason === "Database does not exist.") {
				createDB();
			} else {
				var url = request.responseURL;
				// console.log(typeof(url));
				var i = url.lastIndexOf("/", url.length - 1);
				var name = url.substring(i + 1);
        put({ "_id" : name }, values[name]);
			}
		}
	}
};

function createDB() {
  request.open("PUT", dburl, false);
  request.send();
}

function put(response, message) {
	request.open("PUT", dburl + response._id, false);
	request.setRequestHeader("Content-type", "application/json");
	message._id = response._id;
	if (response._rev) {
		message._rev = response._rev;
	}
	var s = JSON.stringify(message);
	request.send(s);
}

function set(name) {
  request.open("GET", dburl + name, false);
  request.send();
}

var values = {
	"username" : "",
	"type"     : "",
	"car"      : "",
	"interior" : [],
  "extra"    : [],
  "startDate": "",
  "startCity": "",
  "endCity"  : "",
  "payment"  : "",
  "sights"   : []
};

var dbname = "hci1";
var dburl = "http://localhost:5984/" + dbname + "/";

//all save functions retrieve their values from the html document by getting the
//inputs via ID
function saveUsername(){
  values.username = document.getElementById("username").value;
  set("username");
}

function saveStartDate(){
  values.startDate = document.getElementById("tourism-startdate").value;
  set("startDate");
}

function saveStartCity(){
  values.startDate = document.getElementById("tourism-startcity").value;
  set("startCity");
}

function saveEndCity(response){
  values.startDate = document.getElementById("tourism-endcity").value;
  set("endCity");
}

//selectOption is called from display.js and automatically sets (possibly adds) and saves the chosen option
function selectOption(optionID){
  if(optionID.startsWith("type")){
    values.type = optionID;
    set("type");
  }
  else if(optionID.startsWith("car")){
    values.car = optionID;
    set("car");
  }
  else if(optionID.startsWith("interior")){
    values.interior.push(optionID);
    set("interior");
  }
  else if(optionID.startsWith("extra")){
    values.extra.push(optionID);
    set("extra");
  }
  else if(optionID.startsWith("payment")){
    values.payment = optionID;
    set("payment");
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
  else if(optionID.startsWith("car")){
    values.car = "";
    set("car");
  }
  else if(optionID.startsWith("interior")){
    values.interior = removeElement(values.interior, optionID);
    set("interior");
  }
  else if(optionID.startsWith("extra")){
    values.extra = removeElement(values.extra, optionID);
    set("extra");
  }
  else if(optionID.startsWith("payment")){
    values.payment = optionID;
    set("payment");
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

    for(var e in array){
      if(e!==element){
        newArray.push(e);
      }
    }
    return newArray;
}
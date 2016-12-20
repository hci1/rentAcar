function displayTime() {
    var date = new Date();
    var hour = "0"  + date.getHours();
    var minute = "0" + date.getMinutes()
    document.getElementById("time").innerHTML = hour.slice(-2) + ":" + minute.slice(-2);
}

window.onload = function() {
    setInterval(displayTime, 1000);
}

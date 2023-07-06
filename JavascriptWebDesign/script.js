function myFunction() {
    alert("Hello World!");
}
function test(x) {
    x = "How's everybody today?";
    let y = " Hello world!";
    alert(x + y);
}
function alertAgain() {
    var alertArea = document.getElementById("first_paragraph");
    alertArea.innerHTML = "This is a message";
}
function checkScript() {
	document.getElementById("p").innerHTML = "Congratulations you have correctly referencenced script.js";
}
function revert() {
    document.getElementById("p").innerHTML = "In the head element, add a reference to the external JavaScript named script.js. Then watch this text change.";
}
function reset() {
    document.getElementById("first_paragraph").innerHTML = "My first paragraph";
}
//sayAnything outputs p1 text to paragraph.
function sayAnything(msg){
    var msg ="Now we\'re cooking with peanut oil!"; //Set the msg to something new
    document.getElementById("p1").innerHTML = msg;
    /* Future adds include 
    having a input that someone
    can type the message into */
}
function undo() {
    var reset = "Let\'s have fun with JavaScript";
    document.getElementById("p1").innerHTML = reset;
}
function whereAreYou() {
    var msg = "You are in ";
    var postal = document.getElementById("myPost").value;
    var newMsg = msg + postal;
    document.getElementById("p2").innerHTML = newMsg;
}
function clr() {
    var input = document.getElementById("myPost");
    input.value = "";
    var msg =" Let\'s try that again from the top. ";
    document.getElementById("p2").innerHTML = msg;
}
function myTest() {
    var msg = "";
    var answer = document.getElementById("myAnswer").value;
    switch (answer) {
        case "4":
            msg = "Correct!";
        break;
        case "3":
        case "1": 
            msg = "You\'re warm";
        break;
        default: 
        msg = "You\'re freezing";
    }
    document.getElementById("p4").innerHTML = msg;
}
function switchTest(){
    var msg ="";
    var answer = document.getElementById("answer").value;
    switch (answer) {
        case "2": 
        msg = "Correct!";
        break;
        case "3":
        msg = "Incorrect";
        break;
        case "1":
        msg = "Sorry, try again";
        break;
        default:
        msg = "Please try again";
    }
}
function ifElseTest() { // using comparision operators
    var msg = "";
    var answer = document.getElementByID("answer").value;
    if (answer == 4) {
        msg = "Correct!";
        document.GetElementById("p4").innerHTML = msg;
        var input = document.getElementByID("myAnswer");
        input.value = "";
    }else if (answer <=3) {
        msg = "You\'re too low";
        var input =document.getElementByID("myAnswer");
        input.value = "";
    } else if (answer > 4) {
        msg = "Your\'re too low";
        var input = document.getElementByID("myAnswer");
        input.value ="";
    }
}
function ifElseTestTwo() {
    // a straightforward ifelseif function
    var msg = "";
    var answer = document.getElementByID("answer").value;
    if(answer == "2") {
        msg = "Correct!"
    }else if (answer == 1) {
        msg = "You\'re warm";
    } else if (answer == 3) {
        msg = "You\'re warm";
    } else if (answer == 4) {
        msg ="You\'re cold";
    } else {
        msg = "You\'re freezing";
    } document.getElementByID("p1").innerHTML = msg;
}
function array() {
    var people = ["George", "Brad", "Julia"];
    person = document.getElementByID("p5");
    person.innerHTML = people;

}
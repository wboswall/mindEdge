function checkScript() {
	document.getElementById("p").innerHTML = "Congratulations you have correctly referencenced script.js";
}
function revert() {
    document.getElementById("p").innerHTML = "In the head element, add a reference to the external JavaScript named script.js. Then watch this text change.";
}
function reset() {
    document.getElementById("first_paragraph").innerHTML = "My first paragraph";
}
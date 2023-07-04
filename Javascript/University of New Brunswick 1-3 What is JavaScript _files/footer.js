var selected;
var activity_pause_secs=0;
var inactivity_alerted=0;
var localPopUp = false;

// select row checkbox by clicking entire row
function rowselect(obj) {
	// convert to jQuery object
	var self = $(obj);
	if(selected != self.attr('id')){
		// remove class from previously selected element
		$('#'+selected).removeClass('selected');
		self.addClass('selected');
		selected = self.attr('id');
	}
}
function rowselectbox(obj, checked, handler) {
	var functionDemo = new Function(handler + ";");
	functionDemo();

	if (checked) {
		obj.addClass('selected');
	}
	else {
		obj.removeClass('selected');
	}
}


window.name="main";//so the pop-up can have main as link targets

function submitToSearchWin(whichArgs){
	whichArgs=(typeof whichArgs!="undefined")?"?keywords="+escape(whichArgs):"";
	newWin=window.open('/mods/pop_search/pop_search.php'+whichArgs,'searchWin','width=850,height=700,directories=no,status=no,location=no,toolbar=no,scrollbars=yes,resizable=yes,menubar=no,copyhistory=no');
	return false;
}


function checkKey(e){
	if(!inactivity_alerted){
		activity_pause_secs=0;
	}
}

// cross-browser width and height functions
function me_win_clientWidth() {
	return me_win_filterResults (
	window.innerWidth ? window.innerWidth : 0,
	document.documentElement ? document.documentElement.clientWidth : 0,
	document.body ? document.body.clientWidth : 0
	);
}
function me_win_clientHeight() {
	return me_win_filterResults (
	window.innerHeight ? window.innerHeight : 0,
	document.documentElement ? document.documentElement.clientHeight : 0,
	document.body ? document.body.clientHeight : 0
	);
}
function me_win_scrollTop() {
	return me_win_filterResults (
	window.pageYOffset ? window.pageYOffset : 0,
	document.documentElement ? document.documentElement.scrollTop : 0,
	document.body ? document.body.scrollTop : 0
	);
}
function me_win_scrollLeft() {
	return me_win_filterResults (
	window.pageXOffset ? window.pageXOffset : 0,
	document.documentElement ? document.documentElement.scrollLeft : 0,
	document.body ? document.body.scrollLeft : 0
	);
}
function me_win_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
	n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}
function me_win_maximize() {
	window.moveTo(0, 0);
	try{
		window.resizeTo(screen.width, screen.height);
	}catch(e){
		//nada
	}
}
function me_win_min_width() {
	//window.moveTo(0, 0);
	h=(screen.height-100 > me_win_clientHeight())?screen.height-100:me_win_clientHeight();
	try{
		window.resizeTo(980, h);
	}catch(e){
		//nada
	}
}
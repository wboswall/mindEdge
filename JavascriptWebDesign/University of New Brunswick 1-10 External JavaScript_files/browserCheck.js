/**
 * Gets the browser and version and checks it against a JSON list to see if it's up to date
 *
 * This will display an error message if the browser version is more than 3 versions behind.
 */
function checkBrowserVersion() {
	var browser = checkBrowserInfo("name");
	var version = checkBrowserInfo("version");
	var session = getCookie("warningSession");
	var getData = "";	//Additional data to send via AJAX

	getData += "?version=" + version;
	getData += "&browser=" + browser;

	//If the browser is not supported, send extra data to AJAX
	if(!isValidBrowser(browser)) {
		getData += "&type=invalid";
	}

	//If there is nothing in the session variable then double check
	if(session === '') {
		$.ajax({
			url: ('/jscripts/browserCheck/getJSONBrowsers.php'+getData),
		  	success: function (data) {
				var obj = jQuery.parseJSON(data);
				var modernVersion = getModernBrowserVersion(browser, obj);

				// check if version of browser is 1 version away from the latest version
				if((version <= (modernVersion-2) || (!isValidBrowser(browser))) && session == "") {
					createBrowserWarningBox('<h1>Notice</h1>' + obj.message);
				}

				//Disable this popup and also future checks
				setCookie("warningSession", "true", 1);
		  	}
		});
	}
}

/**
 * Determines if the browser is a major browser type (IE, FireFox, Chrome or Safari)
 *
 * @param browser The browser name per javascript request
 * @returns {Boolean} True of the browser is valid, otherwise false
 */
function isValidBrowser(browser) {
	var ret = true;
	if(browser != "Firefox" && browser != "Chrome" && browser != "Safari" && browser != 'Netscape' && browser != 'Edge') {
		ret = false;
	}

	return ret;
}

/**
 * Gets the major browser version based on the browser type and current version object
 *
 * @param browser The browser name
 * @param obj JSONObject containing the most recent browser versions
 * @returns integer of the major browser version
 */
function getModernBrowserVersion(browser, obj) {
	var ret = 0;
  try {
  	if(browser == "MSIE") {
  		ret = obj.IE;
  	} else if(browser == "Firefox") {
  		ret = obj.Firefox;
  	} else if(browser == "Chrome") {
  		ret = obj.Chrome;
  	} else if(browser == "Safari") {
  		ret = obj.Safari;
  	} else if(browser =="Edge") {
  		ret = obj.Edge;
  	}
  }
  catch(err) {
    ret = 0;
  }
	return ret;
}

/**
 * This will take in a full version (ex 11.0.1.23) and return the major version only
 *
 * @param version		This is the full version number. ex 11.0.1.23
 * @returns {String}	Returns major version
 */
function getMajorVersion(version) {
	var ret = "";
	ret = version.substring(0, (version).indexOf("."))
	return ret;
}

/**
 * Will get the current browsers version and name depending on the type param
 *
 * @param type	Determines what kind of data to return. Either version or name
 * @returns Returns the browser name or version depending on the type
 */
function checkBrowserInfo(type) {
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|netscape|trident(?=\/))\/?\s*(\d+)/i) || [];

    // check if UA string contains Trident, if so it's IE
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        if(type=="version") {
        	return tem[1];
        } else if(type=="name") {
        	return 'MSIE';
        }
    }

    // check if Opera
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];

    // check if Safari, if so, grab the version from Version/{digit} in UA string
    if(M[0].toLowerCase() === 'safari' && (tem= ua.match(/version\/(\d+)/i))!= null) {
      M.splice(1, 1, tem[1]);
    }

    // check if user agent contains Edge/{version #} and use that if so
    var edgeCheck = ua.match(/(edge(?=\/))\/?\s*(\d+)/i) || [];
    if(edgeCheck.length > 0) {
    	M[0] = edgeCheck[1];
    	M[1] = edgeCheck[2];
    }

    if(type=="version") {
    	return M[1];
    } else if(type=="name") {
    	return M[0];
	}
}

/**
 * Creates a warning box to tell the user their browser is outdated
 */
function createBrowserWarningBox(message) {
	if ($('#lightbox').length > 0) { // #lightbox exists

		//show lightbox window - you could use .show('fast') for a transition
		$('#lightbox').show();
	} else { //#lightbox does not exist - create and insert (runs 1st time only)

		//create HTML markup for lightbox window
		var lightbox =
		'<div id="lightbox" style="position:fixed;top:0;left:0;width:100%;height:100%;background:url(\'/jscripts/browserCheck/lightbox_warning.png\');text-align:center;">' +
			'<div id="content" style="background:#fff;border-radius:5px;padding:10px;padding-bottom:20px;width:25%;margin-left:auto;margin-right:auto;">' +
				'<a href="javascript:;" tabindex="1" alt="Close browser warning" style="font-family:arial;float:right;color:#f00;margin-right:10px;margin-top:0px;font-size:20px;font-weight:bold;">X</a>' +
				message +
			'</div>' +
		'</div>';

		//insert lightbox HTML into page
		$('body').append(lightbox);
	}

	//Click anywhere on the page to get rid of lightbox window
	$(document.body).on('click', '#lightbox', function() {
		$('#lightbox').hide();
	});
}

/**
 * Returns a cookies data based on the name
 * @param cname	The cookie name to return
 * @returns	Returns a string of the cookie data
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

/**
 * Creates a Javascript cookie
 *
 * @param cname		The cookie name
 * @param cvalue	The value to set to the cookie
 * @param exdays	The number of days for timeout
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/;SameSite=None; Secure";
}
/** Function that adds the material design btn class to selected buttons */
function changeUiButtonClasses() {
	/* Class, Id, or element names/ types for targeted buttons */
	var targetButtonClasses = [
		'.ui-accordion-header',
		'#begin_course_btn',
		'.next-slide.ui-button',
		'.prev-slide.ui-button',
		'.ui-button',
		'input[type="submit"]',
		'button[type="submit"]'];

	/* Find the element for each item in the targetButtonClasses array
	and run the addMaterialButtonClass for it */
	targetButtonClasses.forEach(item => {
		if ($(item)) {
			if (!$(item).hasClass('btn')) {
				addMaterialButtonClass(item);
			}
		}
	});

	/* Function that runs a loop and applies desired button classes
	that trigger material design effects */
	function addMaterialButtonClass(className) {
		var targetButton = $(className);
		/* Run a loop and add the btn class to the items */
		for (var cnt = 0; cnt < targetButton.length; cnt++) {
			if (!targetButton[cnt].getAttribute('btn')) {
				targetButton[cnt].classList.add('btn');
			}
			/* If the element is a submit type button  */
			if (targetButton[cnt].type === 'submit') {
				if (!targetButton[cnt].getAttribute('btn-primary')) {
					targetButton[cnt].classList.add('btn-primary');
				}
			}
		}
	}
}

/* Run the changeUIButtonClasses function */
changeUiButtonClasses();
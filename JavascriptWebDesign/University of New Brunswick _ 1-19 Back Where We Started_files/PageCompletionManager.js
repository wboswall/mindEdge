(function() {
    'use strict';

    var STATE_URL = "/jscripts/lib/ajax/game_state.php";
    var SERVICE_URL = "/jscripts/lib/ajax/page_completion.php";
    var title;
    var content_id;
    var shouldPushGrade;
	var web_service_grade;
	var max_assignment_pts;

    // a graded item object
    function GradedItem(activity) {
        var self = this;
        // game info
        self.activity = activity;
        // game state
        self.state = {};
        // status indicator for the game
        self.status = $("<div class='gradable-status alert alert-warning'>You have not yet completed the activity below.</div>").insertBefore(self.activity.container);
        // the state is basically the fields in the activity argument
        var state = $.extend({}, activity);
        // passing the container causes an illegal invocation error
        delete state.container;
        // save the state
        // so we create one when one doesn't exist
        self.saveState(state);
    }

    // these functions are defined below the Manager
    GradedItem.prototype.setState     = setState;
    GradedItem.prototype.getState     = getState;
    GradedItem.prototype.saveState    = saveState;
    GradedItem.prototype.isComplete   = isComplete;
    GradedItem.prototype.updateStatus = updateStatus;

    window.PageCompletionManager = (function () {
        'use strict';

        // a place to show completion status for the page
        var $pageStatus = $("<div class='alert alert-info' id='page-completion-status'>Loading progress...</div>").prependTo("#contentcolumn");

        // hold all the graded activities
        var activities = [];

        $(document).ready(activate);

        // public API
        return {
            checkCompletion: checkCompletion,
            register: register,
            print: print
        };

        function activate(){

            fetchCompletionStatus()
            .then(function(){
                // add pushes-grades class to document to show status messages
                if(activities.length > 0 && shouldPushGrade && +max_assignment_pts > 0){
                    $("html").addClass('pushes-grades');
                }
            });

            registerReviewQuestions();
        }

        function registerReviewQuestions(){
            var reviewQuestionsGameId = 5;

            $(".reviewquestions").each(function(index){

                var reviewQuestionsMediaUnique = 'review-questions-' + location.search.replace('?cid=','') + '-' + index;

                var $container = $(this);

                var $questions = $container.find(".singlequestion");

                $questions.each(function(){

                    var $question = $(this);

                    $question
                        .find(".reviewqanswers .msg_head")
                        .each(function(){

                            var $option = $(this);

                            $option
                                .children()
                                .andSelf()
                                .on('click keydown', handleOpen);
                        });

                    function handleOpen(event){

                        if(event.type == 'keydown'){
                            var key = event.which || event.keyCode;

                            if(key != 13){
                                return;
                            }
                        }

                        $question.data("complete", true);

                        var allComplete = true;

                        $questions.each(function(){
                            var $q = $(this);

                            if(!$q.data("complete")){
                                allComplete = false;
                            }
                        });

                        if(allComplete){

                            var state = {
                                gameId: reviewQuestionsGameId,
                                media: reviewQuestionsMediaUnique,
                                completed: 1,
                                type: "save"
                            };

                            $container.data('gradedItem').saveState(state);
                        }

                    }
                });

                if($questions.length){
                    $container.data('gradedItem', PageCompletionManager.register({
                        game_id: reviewQuestionsGameId,
                        container: $container,
                        media: reviewQuestionsMediaUnique
                    }));
                }
            });
        }

        function checkCompletion() {
            var msg;

            // loop through the activities
            for (var i = 0, complete = 0; i < activities.length; i++) {
                if (activities[i].isComplete()) {
                    complete++;
                }
            }

            if(complete === activities.length){
                msg = "All";
            }else{
                msg = complete + " out of " + activities.length;
            }

            msg += " activities on this page have been completed.";

            // update the status indicator
            $pageStatus.html(msg);

            if(complete === activities.length){
                // if we should push grades
                fetchCompletionStatus()
                    .then(function(){
                        // push the grades
                        shouldPushGrade && pushGrades();
                    });
            }
        }

        function register(item) {
            // create new GradedItem object
            var activity = new GradedItem(item);
            // store it
            activities.push(activity);
            // and return it so methods can be called
            return activity;
        }

        function print() {
            log(activities);
        }

        function fetchCompletionStatus(){
            var q = $.Deferred();

            // should we actually check this from the server each time?
            if(typeof shouldPushGrade === 'undefined'){
                // grab all the important info from our service
                $.ajax({
                    method: "GET",
                    url: SERVICE_URL
                })
                    .then(function(response){
                        // store the info in nice variables for use later
                        shouldPushGrade = response.data.should_push_grade === "1";
						web_service_grade = response.data.web_service_grade;
                        content_id = response.data.content_id;
                        title = response.data.title;
                        max_assignment_pts = response.data.max_assignment_pts;
                        q.resolve();
                    });
            }else{
                q.resolve();
            }

            return q.promise();
        }

        function pushGrades() {

			// $member_id, $course_id, and $domain_id are defined in header.inc.php
			// overrride the grade somehow, or always pass from page to completion manager?
			//set exempt and one point for components.  Need to rework to handle other activities
			var exempt=(typeof InteractiveComponents!="undefined" && $rubric_id!=null)?"true":"false";
			var grade= (typeof InteractiveComponents!="undefined" && $rubric_id!=null)?1:max_assignment_pts;

			var data = {
				action : "send_grade",
				col_name : title,
				source_name : title,
				source_id : content_id,
				source_type : "content",
				grade : grade,
				exempt : exempt,
				member_id : $member_id,
				course_id : $course_id,
				cohort_id : $cohort_id,
				domain_id : $domain_id,
				max_pts   : max_assignment_pts
			};

			// in case of multiple attempts to send in rapid succession
			shouldPushGrade = false;

			pushWebSvcGrade(data,null,pushGradesAfter);
			/*
            $.ajax({
                type: 'POST',
                url: '/tools/proxytools/index.php?' + Date.now(),
                dataType: 'json',
                data: data
            }).then(function(response){
                if(response == "success"){
                    // do something?
                }
            }, function(){
                // on error, see if we should push again
                fetchCompletionStatus()
                .then(function(){
                    // then try again to push the grades
                    shouldPushGrade && pushGrades();
                });
            });
			*/
        }

		function pushGradesAfter() {
			fetchCompletionStatus()
                .then(function(){
                    // then try again to push the grades
                    shouldPushGrade && pushGrades();
                });
		}

    })();

    // GradedItem Functions!
    function updateStatus() {
        var self = this;
        // if the item is complete
        if (self.isComplete()) {
            // update the status indicator for the item
            self.status
                .html("You have completed the activity below.")
                .addClass('alert-success')
                .removeClass('alert-warning');
        }
    }

    function setState(state) {
        var self = this;
        // store the state
        self.state = state;
        // update status indicators
        self.updateStatus();
    }

    function getState() {
        var self = this;
        // fetch the game state
        return $.ajax({
            method: 'GET',
            url: STATE_URL,
			async: false,
            data: {
                gameId: self.activity.game_id,
                media: self.activity.media,
                type: 'get'
            },
			success: function(response) {
				// store the state if it came back properly
				response && response[0] && self.setState(response[0]);
				// check all the graded activities
				PageCompletionManager.checkCompletion();
				return response[0];
			}
		});
    }

    function saveState(state) {
        var self = this;
        // default to new seed and 0 index
        var data = $.extend({
            currentIndex: (typeof state.currentIndex != 'undefined' ? state.currentIndex : null),
            seed: Math.floor((Math.random() * 1000) + 1)
        }, state, {
            gameId: self.activity.game_id,
            media: self.activity.media,
            type: 'save'
        });
        // save the state
        return $.ajax({
            method: 'GET',
            url: STATE_URL,
            data: data
        })
        .then(function (response) {
            // store the state if it came back properly
            response && response["state"] && self.setState(response["state"][0]);
            // check all the graded activities
            PageCompletionManager.checkCompletion();
        });
    }

    function isComplete() {
        var self = this;
        // is the item complete?
        return typeof self.state != 'undefined' && typeof self.state.completed != 'undefined' && self.state.completed == 1;
    }

    function log(message){
        console && console.log && console.log(message);
    }

})();
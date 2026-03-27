updateCounter = 0;
isFirstTime = 0;
colorArray = [];
rid = 0;
questionID = "";
answerID = "";

$.ajaxSetup({
  async: true
});


$(function() {


  /*
	$( "#playNow" ).click(function() {
		if($("#email").val() == ''){
			$("#email").css("border", "1px solid red");
			$("#playNow").css("border-left", "1px solid red");
			$("#email").addClass("errorPlaceholder");
			$("#email").attr("placeholder", "Please enter a valid email address.");
		}
		else if(validateEmail($("#email").val())){
  	force_email = false;
		document.cookie = "ILP"+CmpID+"Email="+$("#email").val();
		initDemo();
		}
		else{
			$("#email").val("");
			$("#email").css("border", "1px solid red");
			$("#playNow").css("border-left", "1px solid red");
			$("#email").addClass("errorPlaceholder");
			$("#email").attr("placeholder", "Hmm… that email didn’t seem valid. Please try again.");

	});}*/

  if (votingEnabled) {
    $.post("voting.cfm", {
        cmpID: CmpID,
        GUserID: GUserID,
        dsn: lsvt_env
      })
      .done(function(results) {
        var votingObj = $.parseJSON(results);
        generateVotingResults(votingObj.DATA);
      });
    setInterval(function() {
      $(".voteBox").fadeOut();
      $(".voteBox").fadeIn();
      $.post("voting.cfm", {
          cmpID: CmpID,
          GUserID: GUserID,
          dsn: lsvt_env
        })
        .done(function(results) {
          var votingObj = $.parseJSON(results);
          generateVotingResults(votingObj.DATA);
        });

    }, 300000);
  }

});

video_source = videoUrl; // global variable

function SetVideoSource() {
  if (typeof arguments[1] != 'undefined'){
    console.log("video source loaded: " + arguments[1]);
  }
  video_source = arguments[1];

}


/*
	try {
		if(arguments[2].hasOwnProperty('url')) {
			if(arguments[2].url.hasOwnProperty('href')) {
        insertClickThrough(arguments[2].url.href, arguments[2].value);
				//console.log("exit url does exist." + arguments[2].url.href);
			}
		}
	}
	catch(err) {console.log(err);}
  */


function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function videoCompleted(e) {

  if (e > 1) {
    return;
  }
  console.log("video complete function", e);

  //webhook for player
  let postEndEventRequest;
  if (endpointURL != "") {
    console.log("videoComplete Event....")
    //send to endpoint
    d = new Date();
    var localeDateString = new Date().toLocaleString().replace(/[^ -~]/g, '').replace(',', '');
    if (externalEmail != '') {
      email2 = externalEmail;
    } else {
      email2 = email;
    }
    if (email != '') {
      email2 = email;
    }
    if (window.location.href.indexOf("&email=") > -1) {
      email2 = externalEmail;
    }
    if (LocationID == '') {
      LocationID = 0;
    }
    if (GUserID == '') {
      GUserID = 0;
    }

    let qaListJson = JSON.stringify(qaList);

    let jsonPayload = createCompletedPayload(CmpID, cmpName, aid, accountName, LocationID, LocationName, ilpUserID, FirstName, LastName, Phone, UserName, GUserID, email2, ExternalUserName, "-timeTriggered-");

    postEndEventRequest = $.post("postEndEvent.cfm", {
      eventType: "ilp_completed",
      cmpID: CmpID,
      data: jsonPayload,
      GUserID: GUserID,
      Gdlrid: LocationID
    }).done(function (results) {
      console.log("complete event sent to webhook");
    });
  } else {
    postEndEventRequest = $.Deferred().resolve(); // Create a resolved Deferred object if there's no endpointURL
  }

  // Log the completion event
  let logCompletionRequest = $.post("https://cfws.lightspeedvt.com/rest/restService/lsvtLPAPI/insertLogging", {
    uniqueID: uuid,
    clickAction: "completed",
    method: getCurrentPlayTime(),
    cmpID: CmpID,
    GUserID: GUserID,
    dsn: lsvt_env
  }, function (data, status) {
    $(".logger").prepend("<br>DB Insert Status: " + status);
  });

  // Wait for both AJAX requests to complete before redirecting
  $.when(postEndEventRequest, logCompletionRequest).done(function () {
    if (redirectOnCompleteURL != '') {
      if (redirectOnCompleteTarget == '_blank') {
        window.open(redirectOnCompleteURL, '_blank');
      } else {
        window.parent.location = redirectOnCompleteURL;
      }
    }
  });
}


function createCompletedPayload(CmpID, cmpName, aid, accountName, LocationID, LocationName, ilpUserID, FirstName, LastName, Phone, UserName, GUserID, email2, ExternalUserName, timeTriggered) {
  // Create the payload including the qaList
  let jsonPayload = {
    event: "ilp_completed",
    data: {
      CampaignID: CmpID,
      CampaignName: cmpName,
      VtAccountID: aid,
      VtAccountName: accountName,
      LocationID: LocationID,
      LocationName: LocationName,
      ilpUserID: ilpUserID,
      FirstName: FirstName,
      LastName: LastName,
      Phone1: Phone,
      UserName: UserName,
      UserID: GUserID,
      Email: email2,
      uniqueId: ExternalUserName,
      questionsAndAnswers: qaList
    },
    timeTriggered: timeTriggered
  };

  return JSON.stringify(jsonPayload);
}

function PlayClick(){
  console.log("play event...");
  $.post("https://cfws.lightspeedvt.com/rest/restService/lsvtLPAPI/insertLogging", {
      uniqueID: uuid,
      clickAction: "play",
      method: "",
      cmpID: CmpID,
      GUserID: GUserID,
      dsn: lsvt_env
    });

}



window.initDemo = function() {
  if (force_email) {
    //poster_url = '';
    $(".PosterBG").show();

  }

  if (!force_email) {
    $(".PosterBG").hide();
    /*
    var player = lsvt_player(document.getElementById('videoplayer'), {
      autoplay: autoplay_video,
      poster: poster_url
    });*/


    function selectionEvent(question, value, redirectURL) {

      console.log(question);

    	console.log(question.question, value.value);

    	//insertQA(question.question, value.value);

      if(redirectURL != null){
        //console.log(redirectURL);
        insertClickThrough(redirectURL, value.value);
      }

    }

    function selectionEvent2(e) {
      	var answer = "";
      	var answerNumber = 0;
      	var answerType = "button";
      	console.log(e);
      	var formFlag = false;
      	var question = "Question Not Provided"
        if (e.hasOwnProperty("formData") && e.formData !== null && e.formData.hasOwnProperty("selectionData") && Array.isArray(e.formData.selectionData) && e.formData.selectionData.length > 0) {
      		for (let i = 0; i < e.formData.selectionData.length; i++) {
      			formFlag = true;
      			  //console.log(e.formData.selectionData[i]);
      			  question = e.formData.selectionData[i].placeholder,
      				answer = e.formData.selectionData[i].value
      			
            if(e.formData.selectionData[i].hasOwnProperty("type") && e.formData.selectionData[i].type == "email" && e.formData.selectionData[i].value != "") {
              //console.log("email found", e.formData.selectionData[i].value);
              externalEmail = e.formData.selectionData[i].value;
              // Set a local storage item for external email
              localStorage.setItem("ILP" + CmpID + "EmailResume", e.formData.selectionData[i].value);
            }
            //if exists set email
            if (localStorage.getItem("ILP" + CmpID + "EmailResume")) {
              externalEmail = localStorage.getItem("ILP" + CmpID + "EmailResume");
              //console.log("local storage exists", externalEmail);
            }
            //check for phone
            if(e.formData.selectionData[i].hasOwnProperty("type") && e.formData.selectionData[i].type == "tel" && e.formData.selectionData[i].value != "") {
              //console.log("phone found", e.formData.selectionData[i].value);
              Phone = e.formData.selectionData[i].value;
              localStorage.setItem("ILP" + CmpID + "PhoneResume", e.formData.selectionData[i].value);
            }
            //if exists set phone
            if (localStorage.getItem("ILP" + CmpID + "PhoneResume")) {
              Phone = localStorage.getItem("ILP" + CmpID + "PhoneResume");
              //console.log("local storage exists", Phone);
            }
            //check for first name
            if(e.formData.selectionData[i].hasOwnProperty("type") && e.formData.selectionData[i].type == "text" && e.formData.selectionData[i].value != "") {
              //console.log("name found", e.formData.selectionData[i].value);
              //split name
              var name = e.formData.selectionData[i].value.split(" ");
              FirstName = name[0];
              LastName = name.length > 1 ? name[1] : "";
              localStorage.setItem("ILP" + CmpID + "NameResume", e.formData.selectionData[i].value);
            }
            //if exists set name
            if (localStorage.getItem("ILP" + CmpID + "NameResume")) {
              var name = localStorage.getItem("ILP" + CmpID + "NameResume").split(" ");
              FirstName = name[0];
              LastName = name.length > 1 ? name[1] : "";
              //console.log("local storage exists", FirstName, LastName);
            }


            insertQA(question, answer, i, "form");
      			if (post_message) {
      				var selectionObj = {
      					event: "QuestionAnswered",
      					video: e.currentSegmentHandle,
      					question: question,
      					answer: answer,
      					answerNumber: i,
      					answerType: "form",
      					nextVideo: e.nextSegmentHandle
      				};
      				var selectionJSON = JSON.stringify(selectionObj);
      				parent.postMessage(selectionJSON, "*");
      			}
      		}
          //if action is to set complete; force end
          if(e.formData.action.hasOwnProperty("completeChapter") && e.formData.action.completeChapter == true){
            var end_time = $('video')[0].duration;
					  $('video')[0].currentTime = end_time;
          }
      	}
      	if (!formFlag) {
      		question = e.question;
      		if (typeof(e.answer.value) !== 'undefined') {
      			answer = e.answer.value;
      		} else {
      			answer = e.answer.value;
      		}
      		if (typeof(e.answerNumber) !== 'undefined') {
      			answerNumber = e.answerNumber;
      		}
      		if (typeof(e.type) !== 'undefined') {
      			answerType = e.type;
      		}
           //if exists set email
           if (localStorage.getItem("ILP" + CmpID + "EmailResume")) {
            externalEmail = localStorage.getItem("ILP" + CmpID + "EmailResume");
            //console.log("local storage exists", externalEmail);
          }
           //if exists set phone
           if (localStorage.getItem("ILP" + CmpID + "PhoneResume")) {
            Phone = localStorage.getItem("ILP" + CmpID + "PhoneResume");
            //console.log("local storage exists", Phone);
          }
          //if exists set name
          if (localStorage.getItem("ILP" + CmpID + "NameResume")) {
            var name = localStorage.getItem("ILP" + CmpID + "NameResume").split(" ");
            FirstName = name[0];
            LastName = name.length > 1 ? name[1] : "";
            //console.log("local storage exists", FirstName, LastName);
          }
      		insertQA(e.question, answer, answerNumber, answerType); // moved to new event
      		if (post_message) {
      			var selectionObj = {
      				event: "QuestionAnswered",
      				video: e.currentSegmentHandle,
      				question: e.question,
      				answer: answer,
      				answerNumber: answerNumber,
      				answerType: answerType,
      				nextVideo: e.nextSegmentHandle
      			};
      			var selectionJSON = JSON.stringify(selectionObj);
      			parent.postMessage(selectionJSON, "*");
      		}
      	}
      }


      var player = document.getElementById('videoplayer');

      var options = {
        autoplay: autoplay_video,
        allowSkip: allowSkip,
        displayControls: displayControls,
        poster: poster_url,
        source: videoUrl,
        resumePlayback: allowResume,
        playerType: 'interactive-landing-page',
        /*portrait: portraitMode,*/
        mode:playMode,
        captions: {
          languages: {},
          initalizeOnPlay: captionAutoplay,
          defaultLanguage: defaultLanguageCaption
        },
        events: {
          selection: selectionEvent,
          interactiveFormSubmission: selectionEvent2,
          ended: function() {i++; /*console.log('ended!!', i);*/ videoCompleted(i);},
          dimensionChange (data) {
            var play_count = 0;

            if(autoplay_video == false){
                $( ".lsvt-action-overlay, .jw-icon-playback" ).on( "click", function() {
                  play_count++;
                  if(play_count == 1 && !autoplay_video){
                    PlayClick();
                  }
                });
            }

            if(!isMobileDevice()){
              $("body,#videoplayer, .main-container").removeClass("mobile").addClass("desktop");

            }
            else{
              $("body, #videoplayer,.main-container").removeClass("desktop").addClass("mobile");

            }
            if(data.orientation == 'portrait'){
              console.log(data);

              $("#videoplayer").removeClass("landscape").addClass("portrait");
              $(".embed-responsive").removeClass("landscape").addClass("portrait");
              //$(".HeaderBar").css("margin-bottom", "0");
              $("#videoplayer").parent().removeClass("embed-responsive-16by9 embed-responsive");


              }
              else{
              $("#videoplayer").removeClass("portrait").addClass("landscape");
              $(".embed-responsive").removeClass("portrait").addClass("landscape");
              //$(".HeaderBar").css("margin-bottom", "48px");
              }
            }
        }
      }


      //var lsvtPlayer = lsvtPlayerAPI.player(player, options);

      $.post({
        url: signerUrl,
        contentType: 'application/json',
        data: JSON.stringify({ "data": enccryptedUrl }),
        crossDomain: true, // pass the crossDomain setting
        xhrFields: {
          withCredentials: true
        }, // pass the xhrFields setting
      }).done(function(data) {
        console.log(data);
        var lsvtPlayer = lsvtPlayerAPI.player(player, options);
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        var lsvtPlayer = lsvtPlayerAPI.player(player, options);
      });




      var i = 0;


      $("#videoplayer").css("opacity", "1");


    /*
    player.setSource(videoUrl);
    player.addListener('loadvideo', SetVideoSource.bind(null, 'loadvideo'));
    player.addListener('play', SetVideoSource.bind(null, 'loadvideo'));
    player.addListener('selection', GetVideoClick.bind(null, 'selection'));
    player.addListener('ended', videoCompleted);*/

    setTimeout(function() {
      $("#videoplayer").css("visibility", "visible");
      //$(".vjs-control-bar").css("visibility", "visible");
    }, 500);

/*
    {
  event: 'VideoProgress',
  video: 'Introduction'
  currentPosition: 23.684401,
  duration: 28.566666
}*/
  if(post_message)// stub for if post message enabled
  setInterval(function(){
    if (typeof lsvtPlayer.lsvtPlayer.interactivePlayer.currentVideoSegment.handle !== 'undefined') {
      if(lsvtPlayer.lsvtPlayer.player.currentState == 'playing'){
        var selectionObj = {event:"VideoProgress", video:lsvtPlayer.lsvtPlayer.interactivePlayer.currentVideoSegment.handle, currentPosition:lsvtPlayer.getCurrentTime(), duration:lsvtPlayer.duration};
        var selectionJSON = JSON.stringify(selectionObj);
        parent.postMessage(selectionJSON,"*");
      }
    }
  }, 1000);

    //listener for play/pause
    if (autoplay_video == true) {
      fullScreenLandscape();
      play_counter = 1;



      $.post("https://cfws.lightspeedvt.com/rest/restService/lsvtLPAPI/insertLogging", {
          uniqueID: uuid,
          clickAction: "autoplay",
          method: getCurrentPlayTime(),
          cmpID: CmpID,
          GUserID: GUserID,
          dsn: lsvt_env
        },
        function(data, status) {
          $(".logger").prepend("<br>DB Insert Status: " + status);
        });

        //webhook for player
        if (endpointURL != "") {
        	//send to endpoint
        	d = new Date();
        	var localeDateString = new Date().toLocaleString().replace(/[^ -~]/g, '').replace(',', '');
        	if (externalEmail != '') {
        		email2 = externalEmail;
        	} else {
        		email2 = email;
        	}
        	if (email != '') {
        		email2 = email;
        	}
        	if (window.location.href.indexOf("&email=") > -1) {
        		email2 = externalEmail;
        	}
        	if (LocationID == '') {
        		LocationID = 0;
        	}
        	if (GUserID == '') {
        		GUserID = 0;
        	}
        	jsonPayload = '{\
              "event":"ilp_played",\
              "data":{\
              "CampaignID": ' + CmpID + ',\
              "CampaignName": "' + cmpName + '",\
              "VtAccountID": ' + aid + ',\
              "VtAccountName": "' + accountName + '",\
              "LocationID": ' + LocationID + ',\
              "LocationName": "' + LocationName + '",\
              "ilpUserID": "' + ilpUserID + '",\
              "FirstName": "' + FirstName + '",\
              "LastName": "' + LastName + '",\
              "Phone1": "' + Phone + '",\
              "UserName": "' + UserName + '",\
              "UserID": ' + GUserID + ',\
              "Email": "' + email2 + '",\
              "uniqueId": "' + ExternalUserName + '"\
              },\
              "timeTriggered": "-timeTriggered-"\
            }';
        	$.post("postPlayEvent.cfm", {
        		eventType: "ilp_played",
        		cmpID: CmpID,
        		data: jsonPayload,
        		GUserID: GUserID,
        		Gdlrid: LocationID
        	}).done(function(results) {
        		//alert(results);
        		console.log("play event sent to webhook");
        	});
        }

    } else {
      play_counter = 0;
      //setTimeout(function(){theoplayer.player(0).pause();}, 500);

    }



/*
    $('.vjs-play-control .vjs-control-text').bind("DOMSubtreeModified",function(event){

      //event.stopPropagation();
      event.stopImmediatePropagation();
      mobileResize();
      //console.log($(this).text());
      if ($(this).text() == "Play") {
        undofullScreenLandscape();
        console.log("paused");
        //swal('user hit pause @' + getCurrentPlayTime());
        $(".logger").prepend("<br>~mr_r0b0t: hit pause @" + getCurrentPlayTime());

      } else {
        fullScreenLandscape();
        play_counter++;


        //swal('user hit play @' + getCurrentPlayTime());
        $(".logger").prepend("<br>~mr_r0b0t: hit play @" + getCurrentPlayTime());
        if (play_counter == 1) {

          if (endpointURL != "") {
            	//send to endpoint
            	d = new Date();
            	var localeDateString = new Date().toLocaleString().replace(/[^ -~]/g, '').replace(',', '');
            	if (externalEmail != '') {
            		email2 = externalEmail;
            	} else {
            		email2 = email;
            	}
            	if (email != '') {
            		email2 = email;
            	}
            	if (window.location.href.indexOf("&email=") > -1) {
            		email2 = externalEmail;
            	}
            	if (LocationID == '') {
            		LocationID = 0;
            	}
            	if (GUserID == '') {
            		GUserID = 0;
            	}
            	jsonPayload = '{\
                  "event":"ilp_played",\
                  "data":{\
                  "CampaignID": ' + CmpID + ',\
                  "CampaignName": "' + cmpName + '",\
                  "VtAccountID": ' + aid + ',\
                  "VtAccountName": "' + accountName + '",\
                  "LocationID": ' + LocationID + ',\
                  "LocationName": "' + LocationName + '",\
                  "FirstName": "' + FirstName + '",\
                  "LastName": "' + LastName + '",\
                  "Phone1": "' + Phone + '",\
                  "UserName": "' + UserName + '",\
                  "UserID": ' + GUserID + ',\
                  "Email": "' + email2 + '"\
                  },\
                  "timeTriggered": "-timeTriggered-"\
                }';
            	$.post("postPlayEvent.cfm", {
            		eventType: "ilp_played",
            		cmpID: CmpID,
            		data: jsonPayload,
            		GUserID: GUserID,
            		Gdlrid: LocationID
            	}).done(function(results) {
            		//alert(results);
            		console.log("play event sent to webhook");
            	});
            }




          $.post("https://cfws.lightspeedvt.com/rest/restService/lsvtLPAPI/insertLogging", {
              uniqueID: uuid,
              clickAction: "play",
              method: getCurrentPlayTime(),
              cmpID: CmpID,
              GUserID: GUserID,
              dsn: lsvt_env
            },
            function(data, status) {
              $(".logger").prepend("<br>DB Insert Status: " + status);
            });
        }
      }

    });*/





  } //if force emai
} //end of init

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function insertClickThrough(url, answer){
  $.post("https://cfws.lightspeedvt.com/rest/restService/lsvtLPAPI/insertLogging", {
          uniqueID: uuid,
          clickAction: "click-through",
          method: answer,
          cmpID: CmpID,
          GUserID: GUserID,
          dsn: lsvt_env
      },
      function(data, status) {
          console.log("click through logged as exit action.");
      });
}
let qaList = [];
let questionCounter = 1; // Counter to keep track of the order

function insertQA(quest, button_answer, answerNumber, answerType) {
  console.log("question: " + quest);
  console.log("answer: " + button_answer);

  // Create an object to store the question and answer details
  let qaEntry = {
    order: questionCounter,
    question: quest,
    answer: button_answer,
  };

   // Increment the counter for the next question
   questionCounter++;

  // Push the object to the qaList array
  qaList.push(qaEntry);

  if(answerType == 'form' && quest == 'Email Address'){
    externalEmail = button_answer;
  }

     //if exists set email
     if (localStorage.getItem("ILP" + CmpID + "EmailResume")) {
      externalEmail = localStorage.getItem("ILP" + CmpID + "EmailResume");
      //console.log("local storage exists", externalEmail);
    }

  $.post("https://cfws.lightspeedvt.com/rest/restService/lsvtLPAPI/insertInteractive", {
      uniqueID: uuid,
      question: quest,
      answer: button_answer,
      AnswerNumber: answerNumber,
      AnswerType: answerType,
      cmpID: CmpID,
      GUserID: GUserID,
      ilpUserID: ilpUserID,
      dsn: lsvt_env,
			email: externalEmail,
      ExternalUserName: ExternalUserName
    },
    function(data, status) {
      //completed
      try {
        question_ajax_complete = true;
        //console.log(data);
        rid = data.rid;
				questionID = data.questionID;
				answerID = data.answerID;
        console.log("QuestionID: " +"Q"+ questionID);
        console.log("AnswerID: " +"A"+ answerID );



        if (endpointURL != "") {
          //send to endpoint
          d = new Date();

          var localeDateString = new Date().toLocaleString().replace(/[^ -~]/g,'').replace(',','');



          if(externalEmail != ''){
            email2 = externalEmail;
          }
          else{
            email2 = email;
          }

          if(email != ''){
            email2 = email;
          }

          if(window.location.href.indexOf("&email=") > -1) {
             email2 = externalEmail;
          }

          if(LocationID == ''){
            LocationID = 0;
          }

          if(GUserID == ''){
            GUserID = 0;
          }

          //if exists set email
          if (localStorage.getItem("ILP" + CmpID + "EmailResume")) {
            externalEmail = localStorage.getItem("ILP" + CmpID + "EmailResume");
            console.log("local storage exists", externalEmail);
          }

          // remove line breaks.
          quest = quest.replace(/(\r\n|\n|\r)/gm, "");
          button_answer = button_answer.replace(/(\r\n|\n|\r)/gm, "");

          jsonPayload = '{\
            "event":"ilp_response",\
            "data":{\
            "QuestionID": "Q' + questionID + '",\
            "QuestionText": "' + quest + '",\
            "AnswerTextID": "A' + answerID + '",\
            "AnswerText": "' + button_answer + '",\
            "AnswerNumber": "' + answerNumber + '",\
            "AnswerType": "' + answerType + '",\
            "CampaignID": ' + CmpID + ',\
            "CampaignName": "' + cmpName + '",\
            "VtAccountID": ' + aid + ',\
            "VtAccountName": "' + accountName + '",\
            "LocationID": ' + LocationID + ',\
            "LocationName": "' + LocationName + '",\
            "ilpUserID": "' + ilpUserID + '",\
            "FirstName": "' + FirstName + '",\
            "LastName": "' + LastName + '",\
            "Phone1": "' + Phone + '",\
            "UserName": "' + UserName + '",\
            "UserID": ' + GUserID + ',\
            "Email": "' + email2 + '",\
            "uniqueId": "' + ExternalUserName + '"\
            },\
            "timeTriggered": "-timeTriggered-"\
          }';

          $.post("postData.cfm", {
              cmpID: CmpID,
              data: jsonPayload,
              GUserID: GUserID,
              Gdlrid: LocationID,
              question: quest,
              answer: button_answer,
              AnswerNumber: answerNumber,
              AnswerType: answerType
            })
            .done(function(results) {
              //alert(results);
            });

        }



      } catch (err) {
        rid = 0;
        console.log(err);
        console.log("error getting rid form api");
      }

    });

  if (votingEnabled) {
    $.post("voting.cfm", {
        uniqueID: uuid,
        question: quest,
        answer: button_answer,
        cmpID: CmpID,
        GUserID: GUserID,
        dsn: lsvt_env
      })
      .done(function(results) {
        var votingObj = $.parseJSON(results);
        generateVotingResults(votingObj.DATA);
      });

  }


}

function progressBar(percent, $element) {
  var progressBarWidth = percent * $element.width() / 100;

  $element.find('div').animate({
    width: progressBarWidth
  }, 800).html("&nbsp;");
  $element.after('<span class="PercentVal">' + percent + "%&nbsp;</span>");

  var animvalue = parseInt($element.next().text());
  $element.next().css("color", $element.find('div').css("background-color"));
  var percent_number_step = $.animateNumber.numberStepFactories.append('%');
  $element.next().animateNumber({
      number: animvalue,
      numberStep: percent_number_step,
      easing: 'easeInQuad',
    },
    'slow'
  );

}

function generateVotingResults(obj) {
  isFirstTime++;
  if (typeof lastUpdateInt !== 'undefined') {
    clearInterval(lastUpdateInt);
    updateCounter = 0;
  }

  $(".voting").html("");
  $(".voting").html('<h3>Live Voting Results <span class="lastUpdated"><i class="fa fa-clock-o" aria-hidden="true"></i>Updated just now</span></h3><div class="voteBox"></div>');
  $(".voting").show();

  lastUpdateInt = setInterval(function() {
    updateCounter++
    if (updateCounter == 1) {
      $(".lastUpdated").html('<i class="fa fa-clock-o" aria-hidden="true"></i> Updated one minute ago')
    } else {
      $(".lastUpdated").html('<i class="fa fa-clock-o" aria-hidden="true"></i> Updated ' + updateCounter + " minutes ago.")
    }
  }, 60000);

  //console.log( obj);
  //get total
  var total = 0;
  $.each(obj, function(key, value) {
    total = total + value[1];
  });

  $.each(obj, function(key, value) {
    var per = (value[1] / total) * 100;
    var per = Math.round(per);

    if (isFirstTime == 1) {
      colorArray.push(value[0]);
    }
    var key2 = colorArray.indexOf(value[0]);
    if (key2 == -1) {
      key2 = key;
    }

    $(".voting .voteBox").append('<span class="answer">' + value[0] + '</span><div id="progressBar' + key2 + '" class="default"><div></div></div>' + '<br />');
    //console.log( key + ": " + value[0] );
    //console.log( key + ": " + value[1] );
    progressBar(per, $('#progressBar' + key2));
  });

}

function getCurrentPlayTime() {
  var currTime = $(".jw-text-elapsed").text();
  currTime = currTime.replace("Current Time ", "");
  currTime = currTime.replace("Current Time ", "");
  return currTime;
  //swal(currTime);
}
$(function() {
  $(".loggerbtn").bind("click touchstart", function(e) {
    e.preventDefault();
    if ($(this).text() == 'Show Logger') {
      $(".logger").slideDown("slow");
      $(this).html('<span class="btn">Hide Logger</span>');
    } else {
      $(this).html('<span class="btn">Show Logger</span>');
      $(".logger").slideUp("slow");
    }
  });

});

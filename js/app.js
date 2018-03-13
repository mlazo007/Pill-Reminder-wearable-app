/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*jshint unused: vars*/


(function() {
    var animRequest = 0,
        timerUpdateDate = 0,
        modeStopwatch = "Pause",
        timePrevFrame,
        elmInnerSecond = document.getElementById("hand-dial-inner-second"),
        confirmationFlag = false,
        timeElapsed = 0,
        NEEDLE_DATA = {
            "START": {
                "transform": "rotate(0deg)"
            },
            "END": {
                "transform": "rotate(360deg)"
            }
        };

    /**
     * Removes all child of the element.
     * @private
     * @param {Object} elm - The object to be emptied
     * @return {Object} The emptied element
     */
    function emptyElement(elm) {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }

        return elm;
    }

    /**
     * Adds leading zero(s) to a number and make a string of fixed length.
     * @private
     * @param {number} number - A number to make a string.
     * @param {number} digit - The length of the result string.
     * @return {string} The result string
     */
    function addLeadingZero(number, digit) {
        var n = number.toString(),
            i,
            strZero = "";

        for (i = 0; i < digit - n.length; i++) {
            strZero += '0';
        }

        return strZero + n;
    }

    /**
     * Sets the text data to the element.
     * @private
     * @param {Object} elm - An element to be changed.
     * @param {string} data - A text string to set.
     */
    function setText(elm, data) {
        emptyElement(elm);
        elm.appendChild(document.createTextNode(data));
    }

    /**
     * Sets the style of element with the calculated style value from dataArray, by origPos, destPos, ratio.
     * Generally used for applying animation effect.
     * @private
     * @param {Object} elm - An object to be applied the calculated style value
     * @param {Object} dataArray- An array of style data
     * @param {string} origPos- Original position of transition
     * @param {string} destPos- Destination position of transition
     * @param {number} ratio - Progress ratio of transition
     */
    function applyStyleTransition(elm, dataArray, origPos, destPos, ratio) {
        var valOrigStyle,
            valDestStyle,
            valAnimStyle;

        if (ratio > 1) {
            ratio = 1;
        }

        // Calculate the style value of the element for the moment.
        Object.keys(dataArray[origPos]).forEach(function(key) {
            switch (key) {
                case "transform":
                    // Remove the "rotate(" string, then parse float value.
                    // After parsing, calculate the result value and recover the prefix "rotate(" and suffix "deg)".
                    valOrigStyle = parseFloat(dataArray[origPos][key].substring(7));
                    valDestStyle = parseFloat(dataArray[destPos][key].substring(7));
                    valAnimStyle = "rotate(" + (valOrigStyle + (valDestStyle - valOrigStyle) * ratio) + "deg)";
                    break;
                default:
                    break;
            }

            elm.style[key] = valAnimStyle;
        });
    }


    /**
     * Sets the style of elements in container by origPos, destPos, ratio.
     * @private
     * @param {Object} elm - An object to be animated
     * @param {Array} dataArray - An array that contains the style data of animation
     * @param {number} origPos- Original position of transition
     * @param {number} destPos- Destination position of transition
     * @param {number} ratio - Progress ratio of transition
     */
    function setAnimationStyle(elm, dataArray, origPos, destPos, ratio) {
        // Progress ratio cannot exceed 1.0
        if (ratio > 1) {
            ratio = 1;
        }

        // Apply style to the element
        applyStyleTransition(elm, dataArray, origPos, destPos, ratio);
    }


    /**
     * Makes a snapshot of main screen animation frame,
     * by setting style to elements by the current time.
     * @private
     * @param {number} timestamp - DOMHighResTimeStamp value passed by requestAnimationFrame.
     */
    function drawMainAnimationFrame(timestamp) {
        //var elmInnerSecond = document.querySelector("#hand-dial-inner-second");
        
        elmInnerSecond.classList.add("spin-timer");
//            datetime = tizen.time.getCurrentDateTime(),
//            hour = datetime.getHours(),
//            minute = datetime.getMinutes(),
//            second = datetime.getSeconds(),
//            milisecond = datetime.getMilliseconds(),
//            sum;
//        
//        // Second needle takes 60000 milliseconds to run one cycle
//        sum = milisecond + (second * 1000);
//        setAnimationStyle(elmInnerSecond, NEEDLE_DATA, "START", "END", (sum / 30000));
        
        animRequest = window.requestAnimationFrame(drawMainAnimationFrame);
    }
    
    function loopForNextDosage(){
    	console.log("my confirmationFlag on click is " + confirmationFlag);
    	if(confirmationFlag === true){
    		console.log("am i broken yet?");
    		drawMainAnimationFrame();
    		console.log("nope");
        	setTimeout(myTimeout1, 10000)
    	}
    	
    }
    
    function myTimeout1(){
    	
    	changeMode("Reminder");
    	console.log("i looped for 30 secs");
    	confirmationFlag = false;
    	console.log(confirmationFlag);
    	loopForNextDosage();
    }
    
    function drawMainAnimationFrameTime(timestamp) {
        var elmMainHour = document.querySelector("#hand-main-hour"),
            elmMainMinute = document.querySelector("#hand-main-minute"),
            datetime = tizen.time.getCurrentDateTime(),
            hour = datetime.getHours(),
            minute = datetime.getMinutes(),
            second = datetime.getSeconds(),
            milisecond = datetime.getMilliseconds(),
            sum;

        // Second needle takes 60000 milliseconds to run one cycle
        sum = milisecond + (second * 1000);
   
        // Minute needle takes 60 * 60000 milliseconds to run one cycle
        sum += (minute * 60000);
        setAnimationStyle(elmMainMinute, NEEDLE_DATA, "START", "END", (sum / 3600000));
        // Hour needle takes 12 * 60 * 60000 milliseconds to run one cycle
        sum += (hour * 3600000);
        setAnimationStyle(elmMainHour, NEEDLE_DATA, "START", "END", ((sum % 43200000) / 43200000));

        animRequest = window.requestAnimationFrame(drawMainAnimationFrameTime);
    }
    /**
     * Makes a snapshot of stopwatch screen animation frame,
     * by setting style to elements by elapsed time calculated by timestamp.
     * @private
     * @param {number} timestamp - DOMHighResTimeStamp value passed by requestAnimationFrame.
     */
    function drawStopwatchAnimationFrame(timestamp) {
        var elmStopwatchSecond = document.querySelector("#hand-swatch-second"),
            elmStopwatchMinute = document.querySelector("#hand-dial-swatch-minute"),
            elmStopwatchHour = document.querySelector("#hand-dial-swatch-hour"),
            elmTextMinute = document.querySelector("#text-swatch-minute"),
            elmTextSecond = document.querySelector("#text-swatch-second"),
            elmTextMsecond = document.querySelector("#text-swatch-msecond"),
            progress;

        // Check timestamp of the last frame of animation.
        if (!timePrevFrame) {
            timePrevFrame = timestamp;
        }
        // Progress is calculated by difference of timestamps between last time and now.
        progress = timestamp - timePrevFrame;
        // TimeElapsed is sum of progress from each calls.
        timeElapsed += progress;

        // Second needle takes 60000 milliseconds to run one cycle
        setAnimationStyle(elmStopwatchSecond, NEEDLE_DATA, "START", "END", ((timeElapsed % 60000) / 60000));
        // Minute needle takes 30 * 60000 milliseconds to run one cycle
        setAnimationStyle(elmStopwatchMinute, NEEDLE_DATA, "START", "END", ((timeElapsed % 1800000) / 1800000));
        // Hour needle takes 12 * 60 * 60000 milliseconds to run one cycle
        setAnimationStyle(elmStopwatchHour, NEEDLE_DATA, "START", "END", ((timeElapsed % 43200000) / 43200000));

        // Set time text to the center area
        setText(elmTextMinute, addLeadingZero(Math.floor(timeElapsed / 60000) % 60, 2));
        setText(elmTextSecond, addLeadingZero(Math.floor(timeElapsed / 1000) % 60, 2));
        setText(elmTextMsecond, addLeadingZero(Math.round(timeElapsed / 10) % 100, 2));

        // Save the timestamp to use a reference of last time in next frame.
        timePrevFrame = timestamp;
        animRequest = window.requestAnimationFrame(drawStopwatchAnimationFrame);
    }

    /**
     * Updates the date and sets refresh callback on the next day
     * @private
     * @param {number} prevDate - Date of the previous day.
     */
    function updateDate(prevDate) {
        var elmCircleDate = document.querySelector("#circle-date"),
            datetime = tizen.time.getCurrentDateTime(),
            nextInterval;

        // Check the update condition.
        // If prevDate is '0', it will always update the date.
        if (prevDate === datetime.getDate()) {
            // If the date was not changed(means something went wrong),
            // Call updateDate again after a second.
            nextInterval = 1000;
        } else {
            // If the date was changed,
            // Call updateDate at the beginning of the next day.
            nextInterval =
                (23 - datetime.getHours()) * 60 * 60 * 1000 +
                (59 - datetime.getMinutes()) * 60 * 1000 +
                (59 - datetime.getSeconds()) * 1000 +
                (1000 - datetime.getMilliseconds()) +
                1;
        }

        // Update the text of date
        setText(elmCircleDate, datetime.getDate());

        // If an updateDate timer already exists, clear the previous timer
        if (timerUpdateDate) {
            clearTimeout(timerUpdateDate);
        }

        // Set next timeout for date update
        timerUpdateDate = setTimeout(function() {
            updateDate(datetime.getDate());
        }, nextInterval);
    }


    /**
     * Changes the mode of the application.
     * @param {string} mode - Mode of the application to be changed.
     * @private
     */
    function changeMode(mode) {
        var elmCompMain = document.querySelector("#components-main"),
            elmCompStopwatch = document.querySelector("#components-swatch"),
            elmCompToucharea = document.querySelector("#components-toucharea");
        	elmCompNotification = document.querySelector("#confirmation");

        // Stop the animation before mode changing
        if (animRequest) {
            window.cancelAnimationFrame(animRequest);
        }

        switch (mode) {
            case "Stopwatch":
                // Main -> Stopwatch
                elmCompMain.style.display = "none";
                elmCompStopwatch.style.display = "block";
                elmCompToucharea.style.display = "none";
                break;
            case "Reminder":
                elmCompMain.style.display = "none";
                elmCompStopwatch.style.display = "none";
                elmCompToucharea.style.display = "none";
                elmCompNotification.style.display = "inline";
                break;
            case "Main":     
                animRequest = window.requestAnimationFrame(drawMainAnimationFrameTime);
                elmCompMain.style.display = "block";
                elmCompStopwatch.style.display = "none";
                elmCompToucharea.style.display = "block";
                elmCompNotification.style.display = "none";
                break;            
             default:
                break;
        }
    }

    /**
     * Toggle the stopwatch to start or pause.
     * @private
     */
    function toggleStopwatch() {
        var elmStopwatchStart = document.querySelector("#button-swatch-start");

        switch (modeStopwatch) {
            case "Pause":
                // Pause -> Start
                modeStopwatch = "Start";
                elmStopwatchStart.style.backgroundImage = "url('image/chrono_stopwatch_btn_stop.png')";
                animRequest = window.requestAnimationFrame(drawStopwatchAnimationFrame);
                break;
            case "Start":
                // Start -> Pause
                modeStopwatch = "Pause";
                timePrevFrame = 0;
                elmStopwatchStart.style.backgroundImage = "url('image/chrono_stopwatch_btn_resume.png')";
                window.cancelAnimationFrame(animRequest);
                break;
            default:
                break;
        }
    }

    /**
     * Sets default event listeners.
     * @private
     */
    function setDefaultEvents() {
        var elmTopSquare = document.querySelector("#toucharea-swatch-top"),
            elmBotSquare = document.querySelector("#toucharea-swatch-bot"),
            elmleftSquare = document.querySelector("#toucharea-swatch-left"),
            elmStopwatchStart = document.querySelector("#button-swatch-start"),
            elmStopwatchExit = document.querySelector("#button-swatch-exit"),
        	elmSelectYes = document.querySelector("#select-yes"),
        	elmSelectNo = document.querySelector("#select-no");
        	
       

        // Set initial date and refresh timer
        updateDate(0);

        //Set/determine Script refills
        setRefillsEvents();
        
       // buildScriptReminder();
       
        // Add an event listener to update the screen immediately when the device wakes up
        document.addEventListener("visibilitychange", function() {
            if (!document.hidden) {
                updateDate(0);
            }
        });
        // Add an event listener to update the screen immediately when the device wakes up
        tizen.time.setTimezoneChangeListener(function() {
            updateDate(0);
        });

        // Add event listeners to buttons and touch areas
        elmTopSquare.addEventListener("click", function() {
        	decrementRefillCount();
        });
        elmleftSquare.addEventListener("click", function() {
        	console.log("i clicked it");
        	changeMode("Reminder");
        	//confirmationFlag = true;
        	//loopForNextDosage();
        });
        elmSelectYes.addEventListener("click", function() {
        	console.log("I took my pill");
        	confirmationFlag = true;
        	applyStyleTransition(elmInnerSecond, NEEDLE_DATA, "START", "END", 0);
        	loopForNextDosage();
        	changeMode("Main");
        });
        elmSelectNo.addEventListener("click", function() {
        	console.log("click No");
        	elmInnerSecond.classList.remove("spin-timer");
        	changeMode("Main");
        	
        });
        elmBotSquare.addEventListener("click", function() {
            changeMode("Stopwatch");
        });
        elmStopwatchExit.addEventListener("click", function() {
        	
            changeMode("Main");
        });
        elmStopwatchStart.addEventListener("click", function() {
        	toggleStopwatch();
        	});
    }
    
    function buildScriptReminder(timestamp){
    	//var elmInnerSecond = document.querySelector("#hand-dial-inner-second"),
    	datetime = tizen.time.getCurrentDateTime(),
    	second = datetime.getSeconds(),
    	milisecond = datetime.getMilliseconds(),
        sum;

        // Second needle takes 30 seconds to run one cycle
        sum = milisecond + (second * 1000);
        setAnimationStyle(elmInnerSecond, NEEDLE_DATA, "START", "END", (sum / 30000));
    }
    
    
    /**
     * Sets default event listeners.
     * @private
     */
    function setRefillsEvents() {	
    	fetch('http://10.242.14.28:8080/setRefills/5', { method: 'GET' })
    	  .then(function(response) {
    	    return response.json();
    	  })
    	  .then(function(myJson) {
    		  getRefills(myJson);
    		  console.log(myJson);
    	  }, function(e) { console.log(e) });
    }
    function decrementRefillCount() {
    	fetch('http://10.242.14.28:8080/determineRefills', { method: 'GET' })
  	  .then(function(response) {
  	    return response.json();
  	  })
  	  .then(function(myJson) {
  		  getRefills(myJson);
  		  console.log(myJson);
  	  }, function(e) { console.log(e) });
    } 
    function getRefills(data){
    	var elmDialCSSSelector = document.querySelector("#dial");
    		elmDialCSSSelector.classList.remove("refill-one");
       		elmDialCSSSelector.classList.remove("refill-two");
	    	elmDialCSSSelector.classList.remove("refill-three");
	    	elmDialCSSSelector.classList.remove("refill-four");
	    	elmDialCSSSelector.classList.remove("refill-five");
    	 switch(data) {
 	    case 1:
 	    	elmDialCSSSelector.classList.add("refill-one");
 	        break;
 	    case 2:
 	    	elmDialCSSSelector.classList.add("refill-two");
 	        break;
 	    case 3:
 	    	elmDialCSSSelector.classList.add("refill-three");
 	        break;
 	    case 4:
 	    	elmDialCSSSelector.classList.add("refill-four");
 	        break;
 	    case 5:
 	    	elmDialCSSSelector.classList.add("refill-five");
 	        break;
 	    default:
 	    	elmDialCSSSelector.classList;
	        break;
    }
    }

    /**
     * Initiates the application.
     * @private
     */
    function init() {
        setDefaultEvents();
        drawMainAnimationFrameTime();
    }

    window.onload = init();
}());
/*
	@Author: Nazar Maksymchuk
	@Purpose: Generate HTML code, an outline for AmazingAudioPlayer, based on how track data is outlined on Days4God
*/
// Go back on stackoverflow to see how to use MAP - array function
var createButton = document.getElementById('buttonCreate'),
		clearButton = document.getElementById('clearInput'),
		firstTime = !0, //Unneccessary; Resets by default
		htmlplayground = document.getElementById('htmlplayground'), // Remove this, As data will be parsed through DOM?
		audioData = document.getElementById("input");

// Global variables to be used throughout multiple functions

var generatorData = {
		artist: "",
		album: "",
		artwork: "",
		progress: 0,
		progressTotal: 0,
		inProgress: 0,
		links: [],
		titles: [],
		duration: [],
		information: ""
	};
var initializeGenerator = function () {
	initializeGenerator.reset();
	inProgress = !0;// True, First Time...
	generatorData.information = string2DOM(audioData, "text/html");
	//Pushes links, and Titles to their proper places
	var gD = generatorData;
	gD.information.body.childNodes.forEach(function(item, i) {
		if(item.nodeName === "A" && item.hostname == "days4god.org" || item.hostname == "days4god.net") {
			console.log(i,": Link had been pushed into the Array\n")
			gD.links.push(item.href)
		} else if(item.nodeName === "#text" && item.nextElementSibling.nodeName === "A") {
			gD.titles.push(item.nodeValue.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))
			console.log(i,": Title had been pushed into the Array\n")
		}
	})
	progressTotal = Math.round(gD.links.length + gD.titles.length / 2) + 2;
	initializeGenerator.getAudioDuration(0, function(n, duration) {
		generatorData.duration[n] = parseInt(duration.toFixed());
	})
	/*if(gD.links.length != gD.titles.length || gD.titles.length != gD.duration.length) {
		console.warn("An unknown error has occured.\n", "\tThere are " + gD.links.length + " track links in the list, please double check and make sure they are properly ordered.\n","\tThere are " + gD.titles.length + " track titles in the list, please double check and make sure they are properly ordered.\n","\tThere are " + gD.duration.length + " duration records -- the amount should be equal to the number of tracks -- in the list, please double check and make sure they are properly ordered.\n")
	}*/
	// Devise a Async refresh system
}
initializeGenerator.reset = function () {
	Object.keys(generatorData).map(function (key) {
		var prop = generatorData[key].constructor; // Element's constructor function, Array, String, Object, etc.
		return prop == Array ? generatorData[key] = [] : prop == Object ? generatorData[key] = {} : generatorData[key] = ""
	})
	inProgress = !0;
}
initializeGenerator.progress = function () {
	return progressTotal || "0";
}
initializeGenerator.getAudioDuration = function (n, callback) {
	if(n != generatorData.links.length) { // recursive loop
		var audio = new Audio();
		audio.onloadedmetadata = function () {
			callback(n, audio.duration)
		}
		audio.onerror = function (e) {
			// Warn the user via UI to improve the UX - instead of console
			console.error("During the Audio the request, an error has occured.");
			callback(n, 0);
		}
		audio.src = generatorData.links[n]
		return initializeGenerator.getAudioDuration(n+1, callback)
	}
}
function progressBar() {
	return progressTotal || "0";
}

function string2DOM(data, type) {
	var audioDataDOM = new DOMParser().parseFromString(data.value, type);
	return audioDataDOM;
}


// old code
function createFile() {
	inProgress = true;
	progress = 0;
  // remove HTML code/appended if it is the second time and so on.
  if(firsttime == false) { //Reset - Clean Up
    console.log("Clean up in Progress.");
    document.getElementById("links").innerHTML = "";
		document.getElementById("htmlplayground").innerHTML = "";
		console.log("Clearing Variables");
		artist ="";
		album = "";
		artwork = "";
		titles = [];
		links = [];
		duration = [];
		tracks = "";
		n = 0;
		document.getElementById("output").value = "";
		console.clear();
		console.log("Variables cleared.")
	}
  firsttime = false;
	// Get Data from input
  artist = document.getElementById("artist").value;
  album = document.getElementById("album").value;
  artwork = document.getElementById("artwork").value;
  input = document.getElementById("input").value;
	// Replace content in that element w/ user input
  document.getElementById("htmlplayground").innerHTML = input;
	// Get title of the track based on the text next to the link text
	console.log("Gathering tracks, titles and links.");
	document.getElementById("htmlplayground").innerHTML = input;
	for (i=0; i < htmlplayground.childNodes.length; i++) {
		if(htmlplayground.childNodes[i].nodeName == "A") {
			progress += 1;
			titles.push(htmlplayground.childNodes[i].previousSibling.nodeValue); //Push each Title to the array
			progress += 1;
			links.push(htmlplayground.childNodes[i].href); // Like the titles, except for links
		}
	}
	progress += 8; // 6
	tracks = links.length;
	// Append HTML "<audio>" player
	progressTotal = tracks*5 + 11;
	updateProgressBar();
	appendAudio(0);
}
function clearInput() {
	document.getElementById("artist").value = "";
  document.getElementById("album").value = "";
  document.getElementById("artwork").value = "";
  document.getElementById("input").value = "";
	document.getElementById("output").value = "";
	document.getElementById('executionProgress').style.width = "0%";
	document.getElementById("clearInput").disabled = true;
}
createButton.addEventListener('click', createFile);
clearButton.addEventListener('click', clearInput);
function updateProgressBar() {
	document.getElementById('executionProgress').style.width = (progress/progressTotal*100) +"%";
}
function appendAudio(n) {
	progress += 1; //7
	updateProgressBar();
	if(n != tracks) { // recursive loop
		console.log("Appending track,\n", (n+1) ,": ", titles[n]);
		var audio = document.createElement("audio");
			audio.src = links[n]; // Assign attribute values
			audio.id = "audiotrack" + n;
			audio.autoplay = true;
			audio.muted = true;
		htmlplayground.innerHTML = audio.outerHTML;
		// get Duration of the track appended above
		console.log("Getting duration");
		getDuration(n);
	} else {
		console.log("Process Complete.")
		checkdurationLength();
		// Clean up HTML after function has done it's job
		// $("#htmlplayground").html();
	}
}
function getDuration(n) {
	progress += 1; //8
	updateProgressBar();
	var audio = document.getElementById("audiotrack" + n);
	audio.onerror = function() {
		console.log("Error " + audio.error.code + "; details: " + audio.error.message);

	}
	if(audio.error == null) {
		console.log("THere are no errors!");
		audio.oncanplaythrough = function () {
			// declare elment in a variable
			var myAudio = document.getElementById("audiotrack" + n); //Object Identifier
			// parse the duration and append it into the array
			duration[n] = parseInt(myAudio.duration.toFixed()); // Get duration of the Track and Round it and convert it into a integer
			console.log("- Duration Set.");
			if(audio.error != null) {
				if (audio.error.code == 4) {
				console.log("File not found.");
				}
			}
			if(duration[n] == undefined && audio.error == null) {
				getDuration(n)
			} else {
				appendAudio(n+1);
			}
		}
	} else {
		appendAudio(n+1)
	}
}
function checkdurationLength() {
	progress += 1; //10
	updateProgressBar();
	if(duration.length == tracks) {
		createPlayer();
	} else if (duration.length < tracks){
		if(duration.length == 0) {
			console.log("There are 0 values in the variable duration.");
		} else {
			console.log("Some are missing duration.");
		}
	} else if (duration.length > tracks) {
		console.log("To many values in duration.");
	} else {
		console.log("An unknown error occured.");
	}
}
function createPlayer() {
	progress += 1;// 11
	updateProgressBar();
	htmlplayground.innerHTML = "";
	console.log("Creating Player for", artist , "-", album);
	output = "<div style=\"margin:12px auto;\" align=\"center\">\n\t<div id=\"amazingaudioplayer-1\" style=\"display:block;position:relative;width:100%;height:auto;margin:0px auto 0px;\">\n\t\t<ul class=\"amazingaudioplayer-audios\" style=\"display:none;\">\n";
	for(n = 0; n < links.length; n++) {
		output += "\t\t\t<li data-artist=\""+artist+ //insert value into data-type
							"\" data-title=\"" + titles[n] + //insert value into data-type
							"\" data-album=\""+album+ //insert value into data-type
							"\" data-info=\"\" data-image=\""+artwork+ //insert value into data-type
							"\" data-duration=\""+duration[n]+ //insert value into data-type
							"\">\n\t\t\t\t<div class=\"amazingaudioplayer-source\" data-src=\"" + links[n]+ //insert value into data-type
							" \" data-type=\"audio/mpeg\"></div>\n\t\t\t</li>\n";
	}
	output += "\t\t</ul>\n\t</div>\n</div>";
	progress += 1;
	console.log(progress);
	document.getElementById("output").value = output;
	console.log("Player has been created successfully!");
	updateProgressBar();
	document.getElementById("clearInput").disabled = false;
	inProgress = false;
}

var createButton = document.getElementById('buttonCreate');
var clearButton = document.getElementById('clearInput');
var firsttime = true;
// Global variables to be used throughout multiple functions
var artist, album, artwork, tracks;
var links = [];
var titles= [];
var duration = [];
var htmlplayground = document.getElementById('htmlplayground');
var progress;
var progressTotal;
var inProgress;
function createFile() {
	inProgress = true;
	progress = 0;
	progressTotal = 1;
  updateProgressBar();
	progress = 1;
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
	progress += 1; // 1
  artist = document.getElementById("artist").value;
	progress += 1; // 2
  album = document.getElementById("album").value;
	progress += 1; // 3
  artwork = document.getElementById("artwork").value;
	progress += 1; // 4
  input = document.getElementById("input").value;
	// Replace content in that element w/ user input
	progress += 1; // 5
  document.getElementById("htmlplayground").innerHTML = input;
	// Get title of the track based on the text next to the link text
	console.log("Gathering track titles and links.");
	for (i=0; i < htmlplayground.childNodes.length; i++) {
		document.getElementById("htmlplayground").innerHTML = input;
		if(htmlplayground.childNodes[i].nodeName == "A") {
			progress += 1;
			titles.push(htmlplayground.childNodes[i].previousSibling.nodeValue); //Push each Title to the array
			progress += 1;
			links.push(htmlplayground.childNodes[i].href); // Like the titles, except for links
		}
	}
	progress += 1; // 6
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
		htmlplayground.innerHTML = "<audio id=\"audiotrack" + n +"\" src=\""+ links[n] +"\" autoplay muted></audio>";
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

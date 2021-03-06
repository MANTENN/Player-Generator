/*
	@Author: Nazar Maksymchuk
	@Purpose: Generate HTML code, an outline for AmazingAudioPlayer, based on how track data is outlined on Days4God
*/
// Go back on stackoverflow to see how to use MAP - array function
var createButton = document.getElementById('buttonCreate'),
		clearButton = document.getElementById('clearInput'),
		firstTime = !0, //Unneccessary; Resets by default
		htmlplayground = document.getElementById('htmlplayground'), // Remove this, As data will be parsed through DOM?
		audioData = document.getElementById("input"),
		completed,
		outputEl = document.getElementById("output");
;

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
function checkStatus(tempduration) {
	var tempd = generatorData.duration.filter( function(item) {
		if(item == null || undefined)
			counter++; console.log("missing", item)
		return item !== null || undefined
	})
	return tempd.length == generatorData.links.length
}
var initializeGenerator = function () {
	clearInterval(completed);

	completed = setInterval(
		function() {
			initializeGenerator.updateProgressBar();
			if(checkStatus()) {
				renderHTML();
				console.log("Player Structure Generated!")
				clearInterval(completed);
			}
		}, 5000);
	initializeGenerator.reset();
	artist = document.getElementById("artist").value;
	album = document.getElementById("album").value;
	artwork = document.getElementById("artwork").value;
	input = document.getElementById("input").value;
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
	generatorData.progressTotal = gD.links.length;
	initializeGenerator.getAudioDuration(0, function(n, duration) {
		generatorData.progress++;
		generatorData.duration[n] = parseInt(duration.toFixed());
	})
	/*if(gD.links.length != gD.titles.length || gD.titles.length != gD.duration.length) {
		console.warn("An unknown error has occured.\n", "\tThere are " + gD.links.length + " track links in the list, please double check and make sure they are properly ordered.\n","\tThere are " + gD.titles.length + " track titles in the list, please double check and make sure they are properly ordered.\n","\tThere are " + gD.duration.length + " duration records -- the amount should be equal to the number of tracks -- in the list, please double check and make sure they are properly ordered.\n")
	}*/
	// Devise a Async progress system in progress :)
}
initializeGenerator.reset = function () {
	Object.keys(generatorData).map(function (key) {
		var prop = generatorData[key].constructor; // Element's constructor function, Array, String, Object, etc.
		return prop == Array ? generatorData[key] = [] : prop == Object ? generatorData[key] = {} : prop == String ? generatorData[key] = "" : generatorData[key] = 0
	})
	initializeGenerator.updateProgressBar();
	inProgress = !0;
	artist = "";
	album = "";
	artwork = "";
	$("#amazingaudioplayer-1").html("");
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
		if(n == generatorData.links.length) {
			window.CustomEvent ? window.dispatchEvent(dataParsingCompleted) : console.warn("This(" + Window.CustomEvent + ") is not supported on your browser!")
		}
		return initializeGenerator.getAudioDuration(n+1, callback)
	}
}
initializeGenerator.updateProgressBar = function () {
	document.getElementById('executionProgress').style.width = (generatorData.progress/generatorData.progressTotal*100) +"%";
}

function string2DOM(data, type) {
	var audioDataDOM = new DOMParser().parseFromString(data.value, type);
	return audioDataDOM;
}
function renderHTML() {
	var output = "<div style=\"margin:12px auto;\" align=\"center\">\n\t<div id=\"amazingaudioplayer-1\" style=\"display:block;position:relative;width:100%;height:auto;margin:0px auto 0px;\">\n\t\t<ul class=\"amazingaudioplayer-audios\" style=\"display:none;\">\n";
	for(n = 0; n < generatorData.links.length; n++) {
		output += "\t\t\t<li data-artist=\""+artist+ //insert value into data-type
							"\" data-title=\"" + generatorData.titles[n] + //insert value into data-type
							"\" data-album=\""+album+ //insert value into data-type
							"\" data-info=\"\" data-image=\""+artwork+ //insert value into data-type
							"\" data-duration=\""+generatorData.duration[n]+ //insert value into data-type
							"\">\n\t\t\t\t<div class=\"amazingaudioplayer-source\" data-src=\"" + generatorData.links[n]+ //insert value into data-type
							" \" data-type=\"audio/mpeg\"></div>\n\t\t\t</li>\n";
	}
	output += "\t\t</ul>\n\t</div>\n</div>";
	outputEl.value = output;
	document.getElementById("clearInput").disabled = false;
	document.getElementById("buttonPreview").disabled = false;
	$("#amazingaudioplayer-1").html(output);
	var jsFolder = "/musicplayer/";
	jQuery("#amazingaudioplayer-1").amazingaudioplayer({
        jsfolder:jsFolder,
        skinsfoldername:"",
        titleinbarwidthmode:"fixed",
        timeformatlive:"%CURRENT% / LIVE",
        volumeimagewidth:24,
        barbackgroundimage:"",
        showtime:false,
        titleinbarwidth:80,
        showprogress:true,
        random:false,
        titleformat:"%TITLE%",
        height:300,
        loadingformat:"Loading...",
        prevnextimage:"prevnext-48-48-1.png",
        showinfo:true,
        imageheight:180,
        skin:"LightBox",
        loopimage:"loop-24-24-2.png",
        loopimagewidth:24,
        showstop:false,
        prevnextimageheight:48,
        infoformat:"%ARTIST% %ALBUM%<br />%INFO%",
        stopotherplayers:true,
        showloading:false,
        forcefirefoxflash:false,
        showvolumebar:true,
        imagefullwidth:true,
        width:300,
        showtitleinbar:false,
        showloop:true,
        volumeimage:"volume-24-24-2.png",
        playpauseimagewidth:48,
        loopimageheight:24,
        tracklistitem:99,
        tracklistitemformat:"%ID%. %TITLE% <span class='amazingaudioplayer-track-duration'>%DURATION%</span>",
        prevnextimagewidth:48,
        tracklistarrowimage:"tracklistarrow-16-16-0.png",
        forceflash:false,
        playpauseimageheight:48,
        showbackgroundimage:false,
        imagewidth:300,
        stopimage:"stop-48-48-0.png",
        playpauseimage:"playpause-48-48-1.png",
        forcehtml5:false,
        showprevnext:true,
        backgroundimage:"",
        autoplay:false,
        volumebarpadding:8,
        progressheight:8,
        showtracklistbackgroundimage:false,
        titleinbarscroll:true,
        showtitle:true,
        defaultvolume:100,
        tracklistarrowimageheight:16,
        heightmode:"fixed",
        titleinbarformat:"%TITLE%",
        showtracklist:true,
        stopimageheight:48,
        volumeimageheight:24,
        stopimagewidth:48,
        volumebarheight:80,
        noncontinous:false,
        tracklistbackgroundimage:"",
        showbarbackgroundimage:false,
        showimage:true,
        tracklistarrowimagewidth:16,
        timeformat:"%CURRENT% / %DURATION%",
        showvolume:true,
        fullwidth:true,
        loop:1,
        preloadaudio:true
    });
	console.log("Player Outline has been Generated")
}
function clearInput() {
	initializeGenerator.reset();
	document.getElementById("artist").value = "";
  document.getElementById("album").value = "";
  document.getElementById("artwork").value = "";
  document.getElementById("input").value = "";
	document.getElementById("output").value = "";
	document.getElementById('executionProgress').style.width = "0%";
	document.getElementById("clearInput").disabled = true;
}
createButton.addEventListener('click', initializeGenerator);
clearButton.addEventListener('click', clearInput);

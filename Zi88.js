document.addEventListener("DOMContentLoaded", () => {

	chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "", getStats)
	});

	// home button (navbar) event listener
	document.getElementById("home").addEventListener("click", () => location.reload());

	// about button event listener
	document.getElementById("about").addEventListener("click", showAbout);
	
	// clear all data button event listener
	document.getElementById("clearAllData").addEventListener("click", clearAllData);

	// save button event listener
	document.getElementById("save").addEventListener("click", save);

	// tweet button event listener
	document.getElementById("tweet").addEventListener("click", tweet);

	// search button event listener
	document.addEventListener("submit", search);

	}, false);

//get playing statistics from YouTube page.
function getStats(stats){
	console.log(stats);

	if (stats === undefined){
		displayError("There was an error. Check your internet connection or if you are on www.youtube.com");
		document.querySelector(".spinner-1").style.display = "none";
	} 

	musicList = document.getElementById("playlist");
	Object.entries(stats).forEach(
		([key, value]) => {
			
			index = key.indexOf("v=");
			videoId = key.slice(index+2);
			videoData = getVideoInfo(videoId, value);
		});
	
	document.querySelector(".playlist").style.display = "block";
	document.querySelector(".spinner-1").style.display = "none";
}

function getVideoInfo(videoId, value){

	fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyDu5IvZjAwtER32DW8JF9UWw3UpjhMUf1k&id=" + videoId)
	.then(response => response.json())
	.then(data => {

		videoCategory = data.items[0].snippet.categoryId;

		//display data for Music only
		if (videoCategory === "10"){
			
			videoTitle = data.items[0].snippet.title;

			//make an li tag for each video
			let li = document.createElement("li");
			li.className = "d-flex flex-row";
			li.id = videoId;

			//image
			let thumbnail = new Image(64, 56);
			thumbnail.src = data.items[0].snippet.thumbnails.medium.url;

			//setting up URL link to video
			let videoUrl = document.createElement("a");
			videoUrl.href = "https://www.youtube.com/watch?v=" + videoId;
			videoUrl.target = "_blank";
			videoUrl.textContent = videoTitle;
				
			let deleteRecord = document.createElement("span");
			deleteRecord.className = "deleteRecord";
			deleteRecord.textContent = "X";
		
			deleteRecord.onclick = event => {
				let span = event.target;
				let div = span.parentNode;
				let li = div.parentNode;
							
				chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, li.id)
				});

				li.nextSibling.remove()
				li.remove();	
				
			}

			let border = document.createElement("hr");

			//count variable
			let timesWatched = document.createElement("span");
			timesWatched.textContent = value;
			timesWatched.className = "timesWatched";

			let divImage = document.createElement("div");
			divImage.style.float = "left";
			divImage.appendChild(thumbnail);
			divImage.className = "p-2";

			let divLink = document.createElement("div");
			divLink.appendChild(videoUrl);
			divLink.className = "p-2";

			let divCount = document.createElement("div");
			divCount.style.height = "64px";
			divCount.style.float = "right";
			divCount.className = "p-2";
			divCount.style.position = "relative";
			divCount.appendChild(timesWatched);
			divCount.appendChild(deleteRecord);
		
			li.appendChild(divImage);
			li.appendChild(divLink);
			li.appendChild(divCount)

			musicList.appendChild(li);
			musicList.appendChild(border);
		}
	})	
	.catch(error => {
		let div = document.getElementById("displayError")

		if (div.childElementCount === 0){
			displayError(error);
		}
		
		console.error(`Error ${error}`);
	});
}

function clearAllData(){
	chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, "clear")
			});

	document.getElementById("playlist").innerHTML = "";
}

function tweet(){
	alert("Please note twitter has a 280 character limit!")
	let tweet = getPlaylist("tweet")
	docRefId = localStorage.getItem("docRefId")
	
	//console.log(tweet);	
	tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet) + encodeURIComponent("via #Zi88\n") + docRefId;
	window.open(tweetUrl);
}

function save(){
	let playlistArray = getPlaylist("save");
	document.querySelector(".spinner-1").style.display = "block";
	writeToFirebase(playlistArray);
}

function getPlaylist(type){
	let text = "";
	let playlistArray = [];

	ulTag = document.getElementById("playlist");
	liTags = document.getElementsByTagName("li");
	
	liTagArray=Object.values(liTags);
	liTagArray.forEach(liTag => {

		divs = liTag.getElementsByTagName("div");
		
		// get the title of the video
		titleDiv = divs[1];
	    link = titleDiv.getElementsByTagName("a")[0];
		videoTitle = link.innerHTML;
		videoLink = link.href
		
		// get the number of times played		
		countDiv = divs[2];
		span = countDiv.getElementsByTagName("span")[0];
		count = span.innerText

		text = text + videoTitle + "\t" + "-" + "\t" + count + "\n";
		playlistArray.push(videoLink)
	})

	switch (type){
		case "tweet":
			return text;
		case "save":
			return playlistArray;
	}	
	return alert("Error");
}

// Display the error 
function displayError(error){
	let div = document.getElementById("displayError")
	let notification = document.createElement("span");
	notification.className = "errorNotification";
	notification.textContent = `${error}`;
	div.appendChild(notification);
}

// Search for requested playlist
function search(event){
	
	// Hide the playlist <ul>  and show the spinner
	document.getElementById("playlist").innerHTML = "";
	document.querySelector(".playlist").style.display = "none";
	document.querySelector(".spinner-1").style.display = "block";

	let searchText = document.getElementById("search").value;
	searchPlaylist(searchText.trim());
	console.log("Search complete");
	
	event.preventDefault();
}

function showAbout(){
	document.getElementById("aboutDiv").style.display = "block";
	document.querySelector(".playlist").style.display = "none";
	document.getElementById("clearAllData").style.display = "none";
}
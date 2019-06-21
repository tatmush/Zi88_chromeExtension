document.addEventListener("DOMContentLoaded", () => {

	chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, "", getStats)
		});

	document.getElementById("clearAllData").addEventListener("click", clearAllData);

	}, false);

function getStats(stats){

	musicList = document.getElementById("playList");
	Object.entries(stats).forEach(
		([key, value]) => {

			index = key.indexOf("v=");
			videoId = key.slice(index+2);
			videoData = getVideoInfo(videoId, value);
	});
}

function getVideoInfo(videoId, value){

	let options = {
		part: "snippet",
		key: "AIzaSyDu5IvZjAwtER32DW8JF9UWw3UpjhMUf1k",
		id: videoId
	}
		
	$.getJSON("https://www.googleapis.com/youtube/v3/videos", options, data => {
			
		//console.log(data);

		videoCategory = data.items[0].snippet.categoryId;
		//Music video categoryId is "10" for youtube
		if (videoCategory === "10"){
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
			videoUrl.textContent = data.items[0].snippet.title;
				
			let timesWatched = document.createElement("span");

			let deleteRecord = document.createElement("span");
			deleteRecord.id = "deleteRecord";
			deleteRecord.textContent = "X";
			deleteRecord.style.position = "absolute";
			deleteRecord.style.bottom = "0";
			deleteRecord.style.right = "0";
		
			deleteRecord.onclick = event => {
				let span = event.target;
				let div = span.parentNode;
				let li = div.parentNode;

				chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, li.id, getStats)
				});

				li.remove();
			}

			let border = document.createElement("hr");

			timesWatched.textContent = value;

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
	});

}

function clearAllData(){
	chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, "clear", getStats)
			});

	document.getElementById("playList").innerHTML = "";
}

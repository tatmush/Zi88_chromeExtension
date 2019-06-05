chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	stats = {};

	switch (request){
		case "":
			Object.entries(localStorage).forEach((entry) => {
			entry[0].includes("https://www.youtube.com/watch") ? stats[entry[0]] = entry[1] : null;
			});
			sendResponse(stats);
			break;

		case "clear":
			localStorage.clear();
			console.log("deleted all local storage");
			break

		default:
			localStorage.removeItem("https://www.youtube.com/watch?v=" + request);
			console.log("deleted video from local storage https://www.youtube.com/watch?v=" + request);
	}

});

$(document).ready( () => {
	let url = window.location.href;
	
	if (url.includes("https://www.youtube.com/watch")) {

		//Looping videos

		videoElement = document.getElementsByClassName("video-stream html5-main-video")[0];
		var config = {attributes : true}

		var callback = (mutationList, observer) => {
			for (var mutation of mutationList){
				if(videoElement.hasAttribute("loop")){
					console.log("[+] Looping video.");
					videoElement.ontimeupdate = () => {
						if(videoElement.currentTime == 0){
							let url = window.location.href;
							addTimesWatched(url);
						}
					}
				}
			}
		}

		var observer = new MutationObserver(callback);

		observer.observe(videoElement, config);

		if(localStorage.getItem(url) != null){
			addTimesWatched(url);
		}
		else{
			console.log("[+] New video added to list");
			addTimesWatched(url);
		}
	}

	
	//detecting a URL change in youtube
	document.addEventListener('transitionend', function(e) {
		if (e.target.id === 'progress'){
			console.log("[+] Change in URL detected");
			let url = window.location.href;
		    if(url.includes("watch")){
		    	console.log("[+] URL contains watch phrase");
				if(localStorage.getItem(url) != null){
					let numberOfTimesWatched = Number(localStorage.getItem(url));
					//what if numberOfTimesWatched is Nan
					numberOfTimesWatched+=1;
					localStorage.setItem(url, numberOfTimesWatched);
					console.log("[+] This video has been played " + numberOfTimesWatched + " times.");
				}
				else{
					console.log("[+] inside else now")
					localStorage.setItem(url, 1);
				}
			}
			console.log(localStorage.length);
		} 
	    
	});

});

function writeToCache(url, value){
	localStorage.setItem(url, value);
}

function addTimesWatched(url){
	timesWatched = Number(localStorage.getItem(url)) + 1;
	localStorage.setItem(url, timesWatched);
	console.log("[+] This video has been played " + timesWatched + " times.");
}
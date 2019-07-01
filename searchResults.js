console.log(JSON.parse(localStorage.getItem("importedPlaylist")));

let obj = JSON.parse(localStorage.getItem("importedPlaylist"));
let x = obj.playlistArray;
document.getElementById("playlist").innerHTML = "";

x.forEach(parse);

function parse(item, index){
    index = item.indexOf("v=");
    videoId = item.slice(index+2);
    console.log(videoId);
    videoData = getVideoInfo(videoId, "");    
}
console.log(JSON.parse(localStorage.getItem("importedPlaylist")));

let obj = JSON.parse(localStorage.getItem("importedPlaylist"));
let x = obj.playlistArray;
let searchResults = document.getElementById("searchResults");

x.forEach(parse);

function parse(item, index){
    let li = document.createElement("li");
    let span = document.createElement("span");
    li.className = "d-flex flex-row";

    span.textContent = item

    li.appendChild(span);
    searchResults.appendChild(li);
}
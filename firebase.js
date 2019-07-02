// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCYSRyGF3lWnYApImx7f6W4Htu_phgqfl4",
    authDomain: "zi88-3f03b.firebaseapp.com",
    databaseURL: "https://zi88-3f03b.firebaseio.com",
    projectId: "zi88-3f03b",
    storageBucket: "",
    messagingSenderId: "1052095360003",
    appId: "1:1052095360003:web:1bee5b55e3806b06"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function writeToFirebase(playlistArray){
    let db = firebase.firestore();

    db.collection("playlists").add({
        playlistArray: playlistArray,
    })
    .then((docRef) => {
        console.log("Document written with ID: " , docRef.id);
        document.querySelector(".spinner-1").style.display = "none";
        alert("Saved");
        //alert(docRef.id);
        localStorage.setItem("docRefId", docRef.id);
    })
    .catch((error) => {
        alert(error);
        displayError(error);

        console.log("Error adding document: ", error);
    })
}

function searchPlaylist(searchText){
    //console.log(searchText);
    let db = firebase.firestore();

    let docRef = db.collection("playlists").doc(searchText);

    docRef.get().then(doc => {
        if (doc.exists) {
            console.log("Document data: ", doc.data());
            
            let playlist = doc.data().playlistArray;
            //console.log(playlist);

            // Hide the spinner and show the playlist <ul> 
            document.querySelector(".playlist").style.display = "block";
	        document.querySelector(".spinner-1").style.display = "none";

            playlist.forEach((item, index) => {
                index = item.indexOf("v=");
                videoId = item.slice(index+2);
                console.log(videoId);
                videoData = getVideoInfo(videoId, "");
            });  
        }
        else {
            displayError("Playlist not found");
            document.querySelector(".spinner-1").style.display = "none";
            console.log("no such document")
        }
    })
    .catch(error => {
        console.log("Error getting document: ", error);
    });
}

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
    var db = firebase.firestore();

    db.collection("playlists").add({
        playlistArray: playlistArray,
    })
    .then((docRef) => {
        console.log("Document written with ID: " , docRef.id);
        alert("Saved");
        alert(docRef.id);
        //localStorage.setItem("docRefId", docRef.id);
    })
    .catch((error) => {
        alert("Error in saving data" + error);
        console.log("Error adding document: ", error);
    })
}

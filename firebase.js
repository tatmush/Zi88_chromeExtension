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

var db = firebase.firestore();

db.collection("playlists").add({
    videoUrl: "https://www.youtube.com/watch?v=lR6y3Zcjcsk",
})
.then((docRef) => {
    console.log("Document written with ID: " , docRef.id);
})
.catch((error) => {
    console.log("Error adding document: ", error);
})
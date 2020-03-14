window.onload = intialize;

function intialize(){
    loadFirebase();
    downloadNews();
}

function loadFirebase() {
    console.log("Firebase Loaded");
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyCWusAXBApIFx5YnC-hxSbQNl_tv0aOIK0",
      authDomain: "aiki20.firebaseapp.com",
      databaseURL: "https://aiki20.firebaseio.com",
      projectId: "aiki20",
      storageBucket: "aiki20.appspot.com",
      messagingSenderId: "769004079783",
      appId: "1:769004079783:web:93a8c53c46137655686982"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }


  function downloadNews() {
    var news = firebase.database().ref("/news");
    news.on("value", showNews);
}

function showNews(snap) {
    var data = snap.val();

    var rows = "";
    for (var key in data) {
        rows += 
        //Escribir aqui el codigo html que se muestre
        '<td>' + data[key].name + '</td>'
    }

    var TNews = document.getElementById("news-content");
    TNews.innerHTML = rows;

   /* var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", deletePeti);
    }*/
}
window.onload = initialize;

function initialize() {
    loadFirebase();
    loadButtons();
    screenMax();
}

function loadButtons() {
    document.getElementById("subs-form").addEventListener("submit", validateForm);
    document.getElementById("close-TY-mdl").addEventListener("click", closeModal);
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

function addInfo() {
    var formSubs = event.target;

    var name = formSubs.name.value;
    var school = formSubs.school.value;
    var country = formSubs.country.value;
    var email = formSubs.email.value;
    firebase.database().ref("/subscriptions").push({
        name,
        school,
        country,
        email
    });
    document.getElementById("modal-TY").style.display = "unset";
    document.getElementById("p1").style.display = "none";
    document.getElementById("p2").style.display = "none";
    document.getElementById("p3").style.display = "none";
    document.getElementById("p4").style.display = "none";
    document.getElementById("subs-form").reset();
}

function closeModal() {
    document.getElementById("modal-TY").style.display = "none";
}

function validateForm(event) {
    event.preventDefault();
    var formSubs = event.target;
    var name = formSubs.name.value;
    var school = formSubs.school.value;
    var country = formSubs.country.value;
    var email = formSubs.email.value;

    if (name == "") {
        document.getElementById("p1").style.display = "unset";
        return false;
    }
    if (school == "") {
        document.getElementById("p2").style.display = "unset";
        return false;
    }
    if (country == "") {
        document.getElementById("p3").style.display = "unset";
         return false;
    }
    if (email == "") {
        document.getElementById("p4").style.display = "unset";
        return false;
    }
   addInfo();
}

function screenMax(){
    if(screen.width < 500){
      console.log(screen.width)
     // var columsCont = document.getElementById("col-contact");
      //columsCont.style.;
      var map = document.getElementById("contact-map");
      map.style.height = "450px";
    }
  }
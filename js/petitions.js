window.onload = initialize;

var errorSI = false;

function initialize() {
    loadFirebase();
    loadButtons();
    downloadPets();
}

function loadButtons() {
    document.getElementById("add-stu").addEventListener("click", openAddNSMdl);
    document.getElementById("close-add-NS-mdl").addEventListener("click", closeAddNSMdl);
    document.getElementById("submit-add-NS").addEventListener("submit", addNewStudent);
    document.getElementById("close-good-NS-mdl").addEventListener("click", closeGoodNSMdl);

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

function downloadPets() {
    var petis = firebase.database().ref("/subscriptions");
    petis.on("value", showPets);
}

function showPets(snap) {
    var data = snap.val();

    var rows = "";
    for (var key in data) {
        rows += '<tr>' +
            '<td>' + data[key].name + '</td>' +
            '<td>' + data[key].school + '</td>' +
            '<td>' + data[key].country + '</td>' +
            '<td>' + data[key].email + '</td>' +
            '<td>' +
            '<i class="far fa-trash-alt delete" data-peti="' + key + '"></i>' +
            '</td>' +
            '</tr>';
    }

    var myTBody = document.getElementById("t-body-student");
    myTBody.innerHTML = rows;

    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", deletePeti);
    }
}

function deletePeti(event) {
    var buttonClicked = event.target;
    var keyPetiToDelete = buttonClicked.getAttribute("data-peti");
    var refPetiToDelete = firebase.database().ref("/subscriptions/" + keyPetiToDelete);
    refPetiToDelete.remove();
}

function openAddNSMdl() {
    document.getElementById("mdl-add-stu").style.display = "unset";
}

function closeAddNSMdl() {
    document.getElementById("mdl-add-stu").style.display = "none";
}

function closeGoodNSMdl() {
    document.getElementById("mdl-add-good").style.display = "none";
}

function addNewStudent(event) {
    event.preventDefault();

    var email = event.target.addNSEmail.value;
    var password = event.target.addNSPwd.value;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        errorSI = true;
        console.log(errorSI);
        alert("Error, Asegurese de que la contraseña tiene mas de 6 caracteres");
        document.getElementById("mdl-add-good").style.display = "none";
        errorSI = false;
        return false;
    });
// Si hay un error va a ejecutarse esta parte de codigo de abajo , pero si hay error va a salir que se se creo correctamente
// pero no es asi , asi que habra que hacer algo para que si hay error no lea esto
    document.getElementById("mdl-add-good").style.display = "unset";
    document.getElementById("mdl-add-stu").style.display = "none";
}


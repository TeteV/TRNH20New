window.onload = initialize;
var errorSI = false;

function initialize(){
loadFirebase();
loadButtons();
}

function loadButtons(){
    document.getElementById("submit-add-NS").addEventListener("submit", validatePass);
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

  function validatePass(){
      var pwd1 = document.getElementById("addNSPwd").value;
      var pwd2 = document.getElementById("addNSPwd2").value;

      if(pwd1 == pwd2){
          addNewStudent();
      }else{
          alert("contraseñas no coinciden");
          document.getElementById("submit-add-NS").reset();
          return false;
      }
  }

function addNewStudent() {
    //event.preventDefault();

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
    setTimeout("redirigir()",5000);
}

function redirigir(){
    alert("jeje")
    // aqui va el link de nuestra pagina de firebase
}

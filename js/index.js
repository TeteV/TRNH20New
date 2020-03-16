window.onload = initialize;

const ADD = "add";
const UPDATE = "update";
var operation = ADD;
var data;
var selection;
var storageRef;
var fichero;
var email = "invitado";

function initialize() {
  loadFirebase();
  checkIfLogin();
  downloadTechs();
  loadButtons();
  downloadNews();
  storageRef = firebase.storage().ref();
  fichero = document.getElementById("mdl-add-img");

  document.getElementById("all-content").style.display = "none";
  document.getElementById("to-signin").style.display = "unset";
}

function loadButtons() {
  document.getElementById("login-btn").addEventListener("click", openLogInMdl);
  document.getElementById("close-login-mdl").addEventListener("click", closeLogInMdl);
  document.getElementById("cancelLog").addEventListener("click", closeLogInMdl);
  document.getElementById("btn-cls").addEventListener("click", closeModal);
  document.getElementById("add-btn").addEventListener("click", openAddMdl);
  document.getElementById("add-mdl-cls").addEventListener("click", closeAddMdl);
  document.getElementById("form1").addEventListener("submit", AddTechToList);
  document.getElementById("form-login-mdl").addEventListener("submit", logIn);
  document.getElementById("log-out-btn").addEventListener("click", logOut);
  document.getElementById("clicked-petis").addEventListener("click", petiZoneWind);
  document.getElementById("news-btn").addEventListener("click", showTakedaNews);
  document.getElementById("techs-btn").addEventListener("click", showTechsList);
  document.getElementById("add-news-btn").addEventListener("click", openAddNewsMdl);
  document.getElementById("add-news-mdl-cls").addEventListener("click", closeAddNewsMdl);
  document.getElementById("form-add-news-mdl").addEventListener("submit", AddNewsToList);
}

function downloadTechs() {
  selection = document.getElementById("sel1").value;
  var techniques = firebase.database().ref(selection + "/technique");
  techniques.on("value", showTec);
}

function AddTechToList(event) {
  console.log("TEcnica revisando si es edit o enviar");

  event.preventDefault();

  var formTech = event.target;
  selection = document.getElementById("sel1").value;

  if (operation == ADD) {
    console.log("Revisado para enviar");
    document.getElementById("add-tech-btn").style.display = "unset";
    document.getElementById("edit-tech-btn").style.display = "none";

    var name = formTech.name.value;
    var imagenASubir = fichero.files[0];
    var FType = imagenASubir.type;

    if (imagenASubir.type == "image/jpeg") {
      console.log("imagen")
      var uploadTask = storageRef.child(selection + "/image/" + imagenASubir.name).put(imagenASubir);
      uploadTask.on("state_changed",
        function (snapshot) {
          console.log("primer")
        }, function (error) {
          console.log(error);
        }, function () {
          console.log("funciona")
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            firebase.database().ref(selection + "/technique").push({
              url: downloadURL,
              name,
              FType
            });
          });
        });
    } else {
      console.log("video")
      var uploadTask = storageRef.child(selection + "/video/" + imagenASubir.name).put(imagenASubir);
      uploadTask.on("state_changed",
        function (snapshot) {
          console.log("primer")
        }, function (error) {
          console.log(error);
        }, function () {
          console.log("funciona")
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
            firebase.database().ref(selection + "/technique").push({
              url: downloadURL,
              name,
              FType
            });
          });
        });
    }

    operation = ADD;

    document.getElementById("add-mdl").style.display = "none";
  } else {

    console.log("Revisado para editar")

    var refTech = firebase.database().ref(selection + "/technique/" + keyTechToEdit);
    console.log("La key del producto recien editado es: " + keyTechToEdit);

    refTech.update({
      name: formTech.name.value/*, 
      url: formTech.url.value*/
    });

    document.getElementById("edit-tech-btn").style.display = "unset";
    document.getElementById("add-tech-btn").style.display = "none";

    operation = ADD;
    document.getElementById("add-mdl").style.display = "none";
  }
  resetForm();
}

function showTec(snap) {
  data = snap.val();
  var rows = "";

  if (email != "invitado") {
    if (email == "admin@admin.com") {
      document.getElementById("all-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("subs-peti-zone").style.display = "block";
      for (var key in data) {
        console.log("Admin")
        rows +=
          '<tr>' +
          '<td>' + data[key].name + '</td>' +
          '<td><button type="button" data-tech="' + key + '" class="btn-mdl btn btn-primary btn-sm">Show</button></td>' +
          '<td>' +
          '<i class="far fa-trash-alt delete" data-tech="' + key + '"></i>' +
          '<i class="far fa-edit edit" data-tech="' + key + '"></i>' +
          '</td>' +
          '</tr>';
      }
    } else {
      document.getElementById("all-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      for (var key in data) {
        console.log("Normal")
        rows +=
          '<tr>' +
          '<td>' + data[key].name + '</td>' +
          '<td><button type="button" data-tech="' + key + '" class="btn-mdl btn btn-primary btn-sm">Show</button></td>' +
          '<td>' +
          '</td>' +
          '</tr>';
      }
      document.getElementById("add-btn").style.display = "none";
    }
    var myTBody = document.getElementById("my-tbody");
    myTBody.innerHTML = rows;

    var btns = document.getElementsByClassName("btn-mdl");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", openModal);
    }
    var editButtons = document.getElementsByClassName("edit");
    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteTech);
      editButtons[i].addEventListener("click", editTech);
    }
    document.getElementById("news-btn").style.display = "block";
    document.getElementById("techs-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("log-out-btn").style.display = "block";
  } else {//end If email != invitado
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
  }
  userLogged();
}

function editTech(event) {
  console.log("Estoy en edit");

  document.getElementById("add-tech-btn").style.display = "none";
  document.getElementById("edit-tech-btn").style.display = "unset";
  operation = UPDATE;

  var buttonClicked = event.target;

  var formTech = document.getElementById("form1");
  keyTechToEdit = buttonClicked.getAttribute("data-tech");
  var refTechToEdit = firebase.database().ref(selection + "/technique/" + keyTechToEdit);
  console.log("La key de la tecnica apunto de editar es: " + keyTechToEdit)

  refTechToEdit.once("value", function (snap) {
    var data = snap.val();
    formTech.name.value = data.name/*,
    formTech.url.value = data.url*/
  });
  openAddMdl();
}

function deleteTech(event) {
  var buttClick = event.target;
  var keyTechToDelete = buttClick.getAttribute("data-tech");
  var refTechToDelete = firebase.database().ref(selection + "/technique/" + keyTechToDelete);
  refTechToDelete.remove();
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

function openModal(event) {
  var buttonClicked = event.target;
  var key = buttonClicked.getAttribute("data-tech");
  selection = document.getElementById("sel1").value;

  var MdlName = document.getElementById("mdl-name");
  MdlName.innerHTML = data[key].name;

  if (data[key].FType == "image/jpeg") {
    var MdlImg = document.getElementById("mdl-img");
    MdlImg.src = data[key].url;
    document.getElementById("mdl-vid").style.display = "none";
    document.getElementById("mdl-img").style.display = "unset";
  } else {
    var MdlVid = document.getElementById("mdl-vid");
    MdlVid.src = data[key].url;
    document.getElementById("mdl-img").style.display = "none";
    document.getElementById("mdl-vid").style.display = "unset";
  }
  document.getElementById("mdls-cont").style.display = "unset";
}

function resetForm() {
  console.log("formtBodyario reseteado");
  var formRes = document.getElementById("form1");
  formRes.reset();
  document.getElementById("add-tech-btn").style.display = "unset";
  document.getElementById("edit-tech-btn").style.display = "none";
  operation = ADD;
}

function closeModal() {
  document.getElementById("mdls-cont").style.display = "none";
  var MdlVid = document.getElementById("mdl-vid");
  MdlVid.pause();
}

function closeAddMdl() {
  document.getElementById("add-mdl").style.display = "none";
  resetForm();
}

function openAddMdl() {
  document.getElementById("add-mdl").style.display = "unset";
}

function openLogInMdl() {
  document.getElementById("login-mdl").style.display = "unset";
}

function closeLogInMdl() {
  document.getElementById("login-mdl").style.display = "none";
  var formLogin = document.getElementById("form-login-mdl");
  formLogin.reset();
}

function logIn(event) {
  event.preventDefault();

  var formLogin = event.target;
  email = formLogin.email.value;
  var password = formLogin.pwd.value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error")
    alert("Usuario o contraseña erroneos");
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
    window.location.href = "consultory.html";
    // ...
  });
  document.getElementById('login-mdl').style.display = "none";
  downloadTechs();
}

function checkIfLogin() {
  //event.preventDefault();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Ha entrado como: " + email)
    } else {
      console.log("Ha salido")
    }
  });
}

function logOut() {
  firebase.auth().signOut().then(function () {
    // Sign-out successftBody.
    console.log("ha salido correctamente")
    window.location.href = "consultory.html";
  }).catch(function (error) {
    // An error happened.
    console.log("error")
  });
}

function userLogged() {
  document.getElementById("email-logged").innerHTML = email;
}

function searchTech() {
  var input, filter, tBody, tr, a, i;
  input = document.getElementById("mySearch");
  filter = input.value.toUpperCase();
  tBody = document.getElementById("my-tbody");
  tr = tBody.getElementsByTagName("tr");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    a = tr[i].getElementsByTagName("td")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

function petiZoneWind() {
  window.location.href = "petitionsWindow.html";
}

function showTakedaNews() {
  document.getElementById("news-content").style.display = "block";
  document.getElementById("all-content").style.display = "none";
}

function showTechsList() {
  document.getElementById("news-content").style.display = "none";
  document.getElementById("add-news-btn").style.display = "none";
  document.getElementById("all-content").style.display = "unset";
}

function downloadNews() {
  var Taknews = firebase.database().ref("news");
  Taknews.on("value", showNews);
}

function showNews(snap) {
  console.log("Viendo news")
  data = snap.val();
  var rows = "";

  if (email != "invitado") {
    if (email == "admin@admin.com") {
      document.getElementById("all-content").style.display = "none";
      document.getElementById("news-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("subs-peti-zone").style.display = "block";
      document.getElementById("add-news-btn").style.display = "unset";
      for (var key in data) {
        console.log("Admin")
        rows +=
          '<div class="media border p-3 col-sm-12 mt-3">' +
          '<div class="media-body">' +
          '<h4>' + data[key].title + '<small>&nbsp;&nbsp;<i>' + data[key].date + '</i></small></h4>' +
          '<p>' + data[key].body + '</p>' +
          '<div class="row">' +
         // '<i  class="fas fa-ellipsis-h ml-3 plask" data-news="' + key + '"></i>' +
          '<div id="sniegel">' +
          '<i class="far fa-trash-alt delete ml-3" data-news="' + key + '"></i>' +
          '<i class="far fa-edit edit " data-news="' + key + '"></i>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '<img src="img/trnk.png" class="rounded-circle" style="width:60px;" />  ' +
          '</div>'
      }
      // estoy va en el elipsis    data-toggle="collapse" data-target="#demo"
      // y esto en el div solitario  id="demo" class="collapse"
    } else {
      document.getElementById("all-content").style.display = "none";
      document.getElementById("news-content").style.display = "unset";
      document.getElementById("to-signin").style.display = "none";
      document.getElementById("add-news-btn").style.display = "none";
      for (var key in data) {
        console.log("Normal")
        rows +=
          '<div class="media border p-3 col-sm-12 mt-3">' +
          '<div class="media-body">' +
          '<h4>' + data[key].title + '<small><i>' + data[key].date + '</i></small></h4>' +
          '<p>' + data[key].body + '</p>' +
          '</div>' +
          '<img src="img/trnk.png" class="rounded-circle" style="width:60px;" />' +
          '</div>'
      }
      document.getElementById("add-news-btn").style.display = "none";
    }
    var newsBody = document.getElementById("news-content");
    newsBody.innerHTML = rows;

    var elips = document.getElementsByClassName("plask");
    for (var j = 0; j < elips.length; j++) {
      elips[j].addEventListener("click", showDelEdit);
    }

    var editButtons = document.getElementsByClassName("edit");
    var deleteButtons = document.getElementsByClassName("delete");
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteNews);
      editButtons[i].addEventListener("click", editNews);
    }
    document.getElementById("news-btn").style.display = "block";
    document.getElementById("techs-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("log-out-btn").style.display = "block";
  } else {//end If email != invitado
    document.getElementById("all-content").style.display = "none";
    document.getElementById("to-signin").style.display = "unset";
  }
  userLogged();
}

function deleteNews(event) {
  var buttClick = event.target;
  var keyNewsToDelete = buttClick.getAttribute("data-news");
  var refNewsToDelete = firebase.database().ref("news/" + keyNewsToDelete);
  refNewsToDelete.remove();
}

function editNews(event) {
  console.log("Estoy en edit");

  document.getElementById("add-news-mdl-btn").style.display = "none";
  document.getElementById("edit-news-btn").style.display = "unset";
  operation = UPDATE;

  var buttonClicked = event.target;

  var formNews = document.getElementById("form-add-news-mdl");
  keyNewsToEdit = buttonClicked.getAttribute("data-news");
  var refNewsToEdit = firebase.database().ref("news/" + keyNewsToEdit);
  console.log("La key de la tecnica apunto de editar es: " + keyNewsToEdit)

  refNewsToEdit.once("value", function (snap) {
    var data = snap.val();
    formNews.title.value = data.title,
      formNews.Nbody.value = data.body
  });
  openAddNewsMdl();
}

function AddNewsToList(event) {
  console.log("Noticia revisando si es edit o enviar");

  event.preventDefault();

  var formNews = event.target;

  if (operation == ADD) {
    console.log("Revisado para enviar");
    document.getElementById("add-news-btn").style.display = "unset";
    document.getElementById("edit-news-btn").style.display = "none";

    var title = formNews.title.value;
    var body = formNews.Nbody.value;
    date = new Date();
    var meses = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
    date = date.getDate()+"/" + meses[date.getMonth()] +"/"+  date.getFullYear();
    firebase.database().ref("news/").push({
      title,
      body,
      date
    });
    operation = ADD;

    document.getElementById("mdl-add-news").style.display = "none";
  } else {

    console.log("Revisado para editar")

    var refTech = firebase.database().ref("news/" + keyNewsToEdit);
    console.log("La key de la noticia recien editada es: " + keyNewsToEdit);

    refTech.update({
      title: formNews.title.value,
      body: formNews.Nbody.value
    });

    document.getElementById("edit-news-btn").style.display = "unset";
    document.getElementById("add-news-btn").style.display = "none";

    operation = ADD;
    document.getElementById("mdl-add-news").style.display = "none";
  }
  resetNewsForm();
}

function closeAddNewsMdl() {
  document.getElementById("mdl-add-news").style.display = "none";
  resetNewsForm();
}

function openAddNewsMdl() {
  console.log("modal abierto")
  if(operation == ADD){
    document.getElementById("add-news-mdl-btn").style.display = "unset";
    document.getElementById("edit-news-btn").style.display = "none";
  }else{
    document.getElementById("add-news-mdl-btn").style.display = "none";
    document.getElementById("edit-news-btn").style.display = "unset";
  }
  
  document.getElementById("mdl-add-news").style.display = "unset";
}

function resetNewsForm() {
  console.log("form News reseteado");
  var formRes = document.getElementById("form-add-news-mdl");
  document.getElementById("add-news-btn").style.display = "unset";
  document.getElementById("edit-news-btn").style.display = "none";
  formRes.reset();
  operation = ADD;
}


// function showDelEdit(event) {
//   var buttonClicked = event.target;
//   var key = buttonClicked.getAttribute("data-news");
//   var site1 = document.getElementById("sniegel");
//   var btnns = document.getElementsByClassName("plask");

// var content = 
// '<i class="far fa-trash-alt delete ml-3 wiwi" data-news="' + key + '"></i>' +
// '<i class="far fa-edit edit wiwi" data-news="' + key + '"></i>';

// for (var j = 0; j < btnns.length; j++) {
//   btnns[j] = content;
// }

// site1.innerHTML = content;

// }

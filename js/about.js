window.onload = initialize;

function initialize() {
    loadButtns();
}

function loadButtns() {
   var colBtn =  document.getElementsByClassName("collapsible");

    for (var i = 0; i < colBtn.length; i++) {
        colBtn[i].addEventListener("click", loadCollapsive);
      }
}

function loadCollapsive() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("activee");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
}
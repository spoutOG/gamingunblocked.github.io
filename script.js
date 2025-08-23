function myFunction() {
   var element = document.body;
   element.classList.toggle("dark-mode");
   if (element.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
   } else {
      localStorage.setItem("darkMode", "disabled");
   }
}

// On page load, set dark mode if remembered
window.addEventListener("DOMContentLoaded", function() {
   if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
   }
});
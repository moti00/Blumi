document.addEventListener("DOMContentLoaded", function () {
  if (typeof feather !== "undefined") {
    replaceFeatherIcons();
  }
});

document.addEventListener("click", function (event) {
  const clientMenu = document.getElementById("clientMenu");
  const projectMenu = document.getElementById("projectMenu");
  if (clientMenu && !event.target.closest(".menu-dots")) {
    clientMenu.classList.remove("visible");
    setTimeout(() => {
      clientMenu.style.display = "none";
    }, 200);
  }
  if (projectMenu && !event.target.closest(".menu-dots")) {
    projectMenu.classList.remove("visible");
    setTimeout(() => {
      projectMenu.style.display = "none";
    }, 200);
  }
});

showMainView();

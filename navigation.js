const indicator = document.querySelector(".nav-indicator-wrapper");
const glow = document.querySelector(".nav-glow");
const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

function handleNavigation(el) {
  navItems.forEach((item) => {
    item.classList.remove("is-active");
  });

  const width = `${el.offsetWidth}px`;
  const left = `${el.offsetLeft}px`;

  indicator.style.width = width;
  indicator.style.left = left;

  glow.style.width = width;
  glow.style.left = left;

  el.classList.add("is-active");

  // Show corresponding page
  const pageId = el.dataset.page;
  pages.forEach((page) => {
    page.classList.remove("is-active");
    if (page.id === pageId) {
      page.classList.add("is-active");
    }
  });

  // Handle specific logic for the 'list' page
  if (pageId === "list") {
    showListView(); // Function to show the client list view
  }
}

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    handleNavigation(item);
  });

  // Set initial active state
  if (item.classList.contains("is-active")) {
    handleNavigation(item);
  }
});

function showListView() {
  document.getElementById("main-view").style.display = "block";
  document.getElementById("client-details").style.display = "none";
  document.getElementById("project-details").style.display = "none";
  renderClientList();
}

let clients = JSON.parse(localStorage.getItem("clients")) || [];

function saveToLocalStorage() {
  localStorage.setItem("clients", JSON.stringify(clients));
}

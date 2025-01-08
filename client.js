function addClientFromModal() {
  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const clientPhone = document.getElementById("clientPhone").value.trim();
  const defaultPaymentType = document.getElementById(
    "clientDefaultPaymentType"
  ).value;
  const defaultHourlyRate =
    parseFloat(document.getElementById("clientDefaultHourlyRate").value) || 0;
  const defaultGlobalRate =
    parseFloat(document.getElementById("clientDefaultGlobalRate").value) || 0;
  if (clientName) {
    const client = {
      id: Date.now(),
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      defaultPaymentType,
      defaultHourlyRate,
      defaultGlobalRate,
      projects: [],
    };
    clients.push(client);
    saveToLocalStorage();
    renderClientList();
    closeAddClientModal();
    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("clientDefaultHourlyRate").value = "";
    document.getElementById("clientDefaultGlobalRate").value = "";
  }
}

function saveClientEdit() {
  const newName = document.getElementById("editClientName").value.trim();
  const newEmail = document.getElementById("editClientEmail").value.trim();
  const newPhone = document.getElementById("editClientPhone").value.trim();
  const newDefaultPaymentType = document.getElementById(
    "editClientDefaultPaymentType"
  ).value;
  const newDefaultHourlyRate =
    parseFloat(document.getElementById("editClientDefaultHourlyRate").value) ||
    0;
  const newDefaultGlobalRate =
    parseFloat(document.getElementById("editClientDefaultGlobalRate").value) ||
    0;
  if (newName) {
    const client = clients.find((c) => c.id === currentClient);
    if (client) {
      client.name = newName;
      client.email = newEmail;
      client.phone = newPhone;
      client.defaultPaymentType = newDefaultPaymentType;
      client.defaultHourlyRate = newDefaultHourlyRate;
      client.defaultGlobalRate = newDefaultGlobalRate;
      saveToLocalStorage();
      showClientDetails(currentClient);
      closeEditClientModal();
    }
  }
}

function deleteClient() {
  if (confirm("האם אתה בטוח שברצונך למחוק את הלקוח?")) {
    clients = clients.filter((c) => c.id !== currentClient);
    saveToLocalStorage();
    showMainView();
  }
  document.getElementById("clientMenu").style.display = "none";
}

function showClientDetails(clientId) {
  currentClient = clientId;
  const client = clients.find((c) => c.id === clientId);
  if (client) {
    document.getElementById("main-view").style.display = "none";
    document.getElementById("client-details").style.display = "block";
    document.getElementById("project-details").style.display = "none";
    window.scrollTo(0, 0);
    const clientDetailsHtml = `
        <div class="header-container nav-header">
          <div class="nav-breadcrumb">
            <span class="nav-arrow" onclick="showMainView()" data-feather="chevrons-right"></span>
            <span class="nav-link" onclick="showMainView()">לקוחות</span>
            <span class="nav-separator">/</span>
            <span class="nav-current">${client.name}</span>
          </div>
          <div class="menu-dots" onclick="toggleClientMenu(event)">
            <div class="menu-dot"></div>
            <div class="menu-dot"></div>
            <div class="menu-dot"></div>
          </div>
        </div>
        <h2 style="text-align: center; font-weight: bold;">${client.name}</h2>
        <table class="details-table">
          <tr>
            <td>כתובת מייל:</td>
            <td>${client.email || "-"}</td>
          </tr>
          <tr>
            <td>טלפון:</td>
            <td>${client.phone || "-"}</td>
          </tr>
          <tr>
            <td>סוג תשלום ברירת מחדל:</td>
            <td>${
              client.defaultPaymentType === "hourly" ? "שעתי" : "גלובלי"
            }</td>
          </tr>
          <tr>
            <td>סכום שעתי ברירת מחדל:</td>
            <td>${client.defaultHourlyRate || 0} ₪</td>
          </tr>
          <tr>
            <td>סכום גלובלי ברירת מחדל:</td>
            <td>${client.defaultGlobalRate || 0} ₪</td>
          </tr>
        </table>
        
        <div id="client-projects"></div>
        <div class="dropdown-menu" id="clientMenu">
          <div class="dropdown-item" onclick="openEditClientModal()">ערוך לקוח</div>
          <div class="dropdown-item" onclick="deleteClient()">מחק לקוח</div>
        </div>
      `;
    document.getElementById("client-details").innerHTML = clientDetailsHtml;
    renderProjects(client);
    replaceFeatherIcons();
  }
}

function toggleClientMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById("clientMenu");
  const menuDots = event.currentTarget;
  const rect = menuDots.getBoundingClientRect();
  menu.style.top = `${rect.bottom}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.right = "auto";
  if (menu.style.display === "block") {
    menu.classList.remove("visible");
    setTimeout(() => {
      menu.style.display = "none";
    }, 200);
  } else {
    menu.style.display = "block";
    requestAnimationFrame(() => {
      menu.classList.add("visible");
    });
  }
}

// פונקציה שמוסיפה לקוח מהמודל
function addClientFromModal() {
  // מקבלת את הערכים משדות הקלט ומסירה רווחים מיותרים
  const clientName = document.getElementById("clientName").value.trim();
  const clientEmail = document.getElementById("clientEmail").value.trim();
  const clientPhone = document.getElementById("clientPhone").value.trim();
  // מקבלת את סוג התשלום המוגדר כברירת מחדל
  const defaultPaymentType = document.getElementById(
    "clientDefaultPaymentType"
  ).value;
  // מקבלת את התעריף השעתי המוגדר כברירת מחדל או 0 אם לא הוכנס ערך
  const defaultHourlyRate =
    parseFloat(document.getElementById("clientDefaultHourlyRate").value) || 0;
  // מקבלת את התעריף הגלובלי המוגדר כברירת מחדל או 0 אם לא הוכנס ערך
  const defaultGlobalRate =
    parseFloat(document.getElementById("clientDefaultGlobalRate").value) || 0;
  // בודקת אם הוכנס שם לקוח
  if (clientName) {
    // יוצרת אובייקט לקוח חדש
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
    // מוסיפה את הלקוח למערך הלקוחות
    clients.push(client);
    // שומרת את השינויים ב-localStorage
    saveToLocalStorage();
    // מרנדרת את רשימת הלקוחות
    renderClientList();
    // סוגרת את המודל להוספת לקוח
    closeAddClientModal();
    // מאפסת את שדות הקלט
    document.getElementById("clientName").value = "";
    document.getElementById("clientEmail").value = "";
    document.getElementById("clientPhone").value = "";
    document.getElementById("clientDefaultHourlyRate").value = "";
    document.getElementById("clientDefaultGlobalRate").value = "";
  }
}

// פונקציה ששומרת את העריכה של לקוח
function saveClientEdit() {
  // מקבלת את הערכים החדשים משדות הקלט ומסירה רווחים מיותרים
  const newName = document.getElementById("editClientName").value.trim();
  const newEmail = document.getElementById("editClientEmail").value.trim();
  const newPhone = document.getElementById("editClientPhone").value.trim();
  // מקבלת את סוג התשלום המוגדר כברירת מחדל
  const newDefaultPaymentType = document.getElementById(
    "editClientDefaultPaymentType"
  ).value;
  // מקבלת את התעריף השעתי המוגדר כברירת מחדל או 0 אם לא הוכנס ערך
  const newDefaultHourlyRate =
    parseFloat(document.getElementById("editClientDefaultHourlyRate").value) ||
    0;
  // מקבלת את התעריף הגלובלי המוגדר כברירת מחדל או 0 אם לא הוכנס ערך
  const newDefaultGlobalRate =
    parseFloat(document.getElementById("editClientDefaultGlobalRate").value) ||
    0;
  // בודקת אם הוכנס שם לקוח
  if (newName) {
    // מחפשת את הלקוח הנוכחי
    const client = clients.find((c) => c.id === currentClient);
    // אם הלקוח נמצא
    if (client) {
      // מעדכנת את פרטי הלקוח
      client.name = newName;
      client.email = newEmail;
      client.phone = newPhone;
      client.defaultPaymentType = newDefaultPaymentType;
      client.defaultHourlyRate = newDefaultHourlyRate;
      client.defaultGlobalRate = newDefaultGlobalRate;
      // שומרת את השינויים ב-localStorage
      saveToLocalStorage();
      // מציגה את פרטי הלקוח
      showClientDetails(currentClient);
      // סוגרת את המודל לעריכת לקוח
      closeEditClientModal();
    }
  }
}

// פונקציה שמוחקת לקוח
function deleteClient() {
  // שואלת את המשתמש אם הוא בטוח שברצונו למחוק את הלקוח
  if (confirm("האם אתה בטוח שברצונך למחוק את הלקוח?")) {
    // מסננת את הלקוח מהמערך
    clients = clients.filter((c) => c.id !== currentClient);
    // שומרת את השינויים ב-localStorage
    saveToLocalStorage();
    // מציגה את התצוגה הראשית
    showMainView();
  }
  // מסתירה את התפריט של הלקוח
  document.getElementById("clientMenu").style.display = "none";
}

// פונקציה שמציגה את פרטי הלקוח
function showClientDetails(clientId) {
  // מגדירה את הלקוח הנוכחי
  currentClient = clientId;
  // מחפשת את הלקוח הנוכחי
  const client = clients.find((c) => c.id === clientId);
  // אם הלקוח נמצא
  if (client) {
    // מסתירה את התצוגות האחרות ומציגה את פרטי הלקוח
    document.getElementById("main-view").style.display = "none";
    document.getElementById("client-details").style.display = "block";
    document.getElementById("project-details").style.display = "none";
    // מעבירה את התצוגה לראש הדף
    window.scrollTo(0, 0);
    // יוצרת את ה-HTML של פרטי הלקוח
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
          <td>תשלום ברירת מחדל:</td>
          <td>${client.defaultPaymentType === "hourly" ? "שעתי" : "גלובלי"}</td>
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
    // מעדכנת את ה-HTML של פרטי הלקוח
    document.getElementById("client-details").innerHTML = clientDetailsHtml;
    // מרנדרת את רשימת הפרויקטים של הלקוח
    renderProjects(client);
    // מחליפה את האייקונים
    replaceFeatherIcons();
  }
}

// פונקציה שפותחת או סוגרת את תפריט הלקוח
function toggleClientMenu(event) {
  // מונעת את הפעולה של לחיצה על אלמנט ההורה
  event.stopPropagation();
  // מקבלת את התפריט
  const menu = document.getElementById("clientMenu");
  // מקבלת את כפתור התפריט
  const menuDots = event.currentTarget;
  // מקבלת את המיקום של כפתור התפריט
  const rect = menuDots.getBoundingClientRect();
  // מגדירה את מיקום התפריט
  menu.style.top = `${rect.bottom}px`;
  menu.style.left = `${rect.left}px`;
  menu.style.right = "auto";
  // אם התפריט גלוי, מסתירה אותו
  if (menu.style.display === "block") {
    menu.classList.remove("visible");
    // לאחר 200 מילישניות מסתירה את התפריט
    setTimeout(() => {
      menu.style.display = "none";
    }, 200);
    // אם התפריט לא גלוי, מציגה אותו
  } else {
    menu.style.display = "block";
    // מפעילה אנימציה
    requestAnimationFrame(() => {
      menu.classList.add("visible");
    });
  }
}

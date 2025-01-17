// פונקציה שפותחת את המודל להוספת פרויקט
function openAddProjectModal() {
  // מציגה את המודל
  document.getElementById("addProjectModal").style.display = "block";
  // מקבלת את תיבת הבחירה לסוג תשלום ואת שדה סכום התשלום
  const paymentTypeSelect = document.getElementById("paymentType");
  const paymentAmountInput = document.getElementById("paymentAmount");
  const startDateInput = document.getElementById("projectStartDate");
  // מגדירה את תאריך ההתחלה לזמן הנוכחי
  const now = new Date();
  startDateInput.value = now.toISOString().slice(0, 16);
  // מחפשת את הלקוח הנוכחי
  const client = clients.find((c) => c.id === currentClient);
  // אם הלקוח נמצא
  if (client) {
    // מגדירה את ברירת המחדל של סוג התשלום
    paymentTypeSelect.value = client.defaultPaymentType;
    // אם סוג התשלום הוא שעתי, מגדירה את ברירת המחדל של סכום התשלום השעתי
    if (client.defaultPaymentType === "hourly") {
      paymentAmountInput.value = client.defaultHourlyRate || "";
      // אם סוג התשלום הוא גלובלי, מגדירה את ברירת המחדל של סכום התשלום הגלובלי
    } else if (client.defaultPaymentType === "global") {
      paymentAmountInput.value = client.defaultGlobalRate || "";
    } else {
      // אחרת, מאפסת את הסכום
      paymentAmountInput.value = "";
    }
    // מגדירה פונקציה שתפעל כאשר משנים את סוג התשלום
    paymentTypeSelect.onchange = () => {
      // אם סוג התשלום הוא שעתי, מגדירה את ברירת המחדל של סכום התשלום השעתי
      if (paymentTypeSelect.value === "hourly") {
        paymentAmountInput.value = client.defaultHourlyRate || "";
        // אם סוג התשלום הוא גלובלי, מגדירה את ברירת המחדל של סכום התשלום הגלובלי
      } else if (paymentTypeSelect.value === "global") {
        paymentAmountInput.value = client.defaultGlobalRate || "";
      } else {
        // אחרת, מאפסת את הסכום
        paymentAmountInput.value = "";
      }
    };
    // אם הלקוח לא נמצא
  } else {
    // מאפסת את הסכום וברירת המחדל לסוג התשלום "שעתי"
    paymentAmountInput.value = "";
    paymentTypeSelect.value = "hourly";
  }
}

// פונקציה שמוסיפה פרויקט מהמודל
function addProjectFromModal() {
  // מקבלת את שם הפרויקט, סוג התשלום, סכום התשלום, תאריך ההתחלה ותאריך היעד
  const projectName = document.getElementById("projectName").value.trim();
  const paymentType = document.getElementById("paymentType").value;
  const paymentAmount = parseFloat(
    document.getElementById("paymentAmount").value
  );
  const startDate = document.getElementById("projectStartDate").value;
  const endDate = document.getElementById("projectEndDate").value;
  // בודקת שהשם וסכום התשלום קיימים
  if (projectName && paymentAmount) {
    // יוצרת אובייקט פרויקט חדש
    const project = {
      id: Date.now(),
      name: projectName,
      paymentType: paymentType,
      paymentAmount: paymentAmount,
      timeEntries: [],
      startDate: startDate,
      endDate: endDate,
      status: "פעיל",
      lastUsed: Date.now(),
    };
    // מחפשת את הלקוח הנוכחי
    const client = clients.find((c) => c.id === currentClient);
    // אם הלקוח נמצא
    if (client) {
      // מוסיפה את הפרויקט לראש רשימת הפרויקטים של הלקוח
      client.projects.unshift(project);
      // שומרת את השינויים ב-localStorage
      saveToLocalStorage();
      // מציגה את פרטי הלקוח
      showClientDetails(currentClient);
      // סוגרת את המודל
      closeAddProjectModal();
      // מאפסת את שדות הקלט
      document.getElementById("projectName").value = "";
      document.getElementById("paymentAmount").value = "";
    }
  }
}

// פונקציה שפותחת את המודל לעריכת פרויקט
function openEditProjectModal() {
  // מחפשת את הלקוח והפרויקט הנוכחיים
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  // אם הפרויקט נמצא
  if (project) {
    // מעדכנת את שדות הקלט בערכים הקיימים
    document.getElementById("editProjectName").value = project.name;
    document.getElementById("editPaymentType").value = project.paymentType;
    document.getElementById("editPaymentAmount").value = project.paymentAmount;
    document.getElementById("editProjectStartDate").value = project.startDate;
    document.getElementById("editProjectEndDate").value = project.endDate;
    document.getElementById("editProjectStatus").value = project.status;
    // מקבלת את תיבת הבחירה לסוג התשלום ואת שדה סכום התשלום
    const paymentTypeSelect = document.getElementById("editPaymentType");
    const paymentAmountInput = document.getElementById("editPaymentAmount");
    // מגדירה פונקציה שתפעל כאשר משנים את סוג התשלום
    paymentTypeSelect.onchange = () => {
      // אם סוג התשלום הוא שעתי, מגדירה את ברירת המחדל של סכום התשלום השעתי
      if (paymentTypeSelect.value === "hourly") {
        paymentAmountInput.value = client.defaultHourlyRate || "";
        // אם סוג התשלום הוא גלובלי, מגדירה את ברירת המחדל של סכום התשלום הגלובלי
      } else if (paymentTypeSelect.value === "global") {
        paymentAmountInput.value = client.defaultGlobalRate || "";
      } else {
        // אחרת, מאפסת את הסכום
        paymentAmountInput.value = "";
      }
    };
    // מציגה את המודל
    document.getElementById("editProjectModal").style.display = "block";
  }
  // מסתירה את התפריט של הפרויקט
  document.getElementById("projectMenu").style.display = "none";
}

// פונקציה ששומרת את עריכת הפרויקט
function saveProjectEdit() {
  // מקבלת את הערכים החדשים
  const newName = document.getElementById("editProjectName").value.trim();
  const newPaymentType = document.getElementById("editPaymentType").value;
  const newPaymentAmount = parseFloat(
    document.getElementById("editPaymentAmount").value
  );
  const newStartDate = document.getElementById("editProjectStartDate").value;
  const newEndDate = document.getElementById("editProjectEndDate").value;
  const newStatus = document.getElementById("editProjectStatus").value;
  // מחפשת את הלקוח והפרויקט הנוכחיים
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  // מגדירה את תאריך הסיום בפועל, אם הסטטוס השתנה ל"הסתיים"
  let actualEndDate = project.actualEndDate;
  if (newStatus === "הסתיים") {
    actualEndDate = new Date().toISOString();
    // מאפסת את תאריך הסיום אם הסטטוס השתנה ל"מושהה" או "פעיל"
  } else if (newStatus === "מושהה" || newStatus === "פעיל") {
    actualEndDate = null;
  }
  // בודקת שהשם וסכום התשלום קיימים
  if (newName && newPaymentAmount) {
    // אם הפרויקט נמצא
    if (project) {
      // מעדכנת את פרטי הפרויקט
      project.name = newName;
      project.paymentType = newPaymentType;
      project.paymentAmount = newPaymentAmount;
      project.startDate = newStartDate;
      project.endDate = newEndDate;
      project.status = newStatus;
      project.actualEndDate = actualEndDate;
      // שומרת את השינויים ב-localStorage
      saveToLocalStorage();
      // מציגה את פרטי הפרויקט
      showProjectDetails(currentProject);
      // סוגרת את המודל
      closeEditProjectModal();
    }
  }
}

// פונקציה שמוחקת פרויקט
function deleteProject() {
  // שואלת את המשתמש אם הוא בטוח שהוא רוצה למחוק את הפרויקט
  if (confirm("האם אתה בטוח שברצונך למחוק את הפרויקט?")) {
    // מחפשת את הלקוח הנוכחי
    const client = clients.find((c) => c.id === currentClient);
    // אם הלקוח נמצא
    if (client) {
      // מסננת את הפרויקט מהמערך
      client.projects = client.projects.filter((p) => p.id !== currentProject);
      // שומרת את השינויים ב-localStorage
      saveToLocalStorage();
      // מציגה את פרטי הלקוח
      showClientDetails(currentClient);
    }
  }
  // מסתירה את התפריט של הפרויקט
  document.getElementById("projectMenu").style.display = "none";
}

// פונקציה שמציגה את פרטי הפרויקט
function showProjectDetails(projectId) {
  // מגדירה את הפרויקט הנוכחי
  currentProject = projectId;
  // מחפשת את הלקוח והפרויקט הנוכחיים
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === projectId);
  // אם הפרויקט נמצא
  if (project) {
    // מסתירה את התצוגות האחרות ומציגה את פרטי הפרויקט
    document.getElementById("main-view").style.display = "none";
    document.getElementById("client-details").style.display = "none";
    document.getElementById("project-details").style.display = "block";
    // מעבירה את התצוגה לראש הדף
    window.scrollTo(0, 0);
    // מעדכנת את ה-HTML של פרטי הפרויקט עם פרטי הפרויקט והלקוח הנוכחיים
    document.getElementById("project-details").innerHTML = `
      <div class="header-container nav-header">
        <div class="nav-breadcrumb">
          <span class="nav-arrow" onclick="showClientDetails(${currentClient})" data-feather="chevrons-right"></span>
          <span class="nav-link" onclick="showMainView()">לקוחות</span>
          <span class="nav-separator">/</span>
          <span class="nav-link" onclick="showClientDetails(${currentClient})">${client.name}</span>
          <span class="nav-separator">/</span>
          <span class="nav-current">${project.name}</span>
        </div>
        <div class="menu-dots" onclick="toggleProjectMenu(event)">
          <div class="menu-dot"></div>
          <div class="menu-dot"></div>
          <div class="menu-dot"></div>
        </div>
      </div>
              <h2 style="text-align: center; font-weight: bold;">${client.name}, ${project.name}</h2>

      <div id="project-info"></div>
      <div id="time-entries"></div>
      <div class="dropdown-menu" id="projectMenu">
        <div class="dropdown-item" onclick="openEditProjectModal()">ערוך פרויקט</div>
        <div class="dropdown-item" onclick="deleteProject()">מחק פרויקט</div>
      </div>
    `;
    // מרנדרת את פרטי הפרויקט
    renderProjectDetails(project);
    // מחליפה את האייקונים
    feather.replace({
      "chevrons-right": {
        width: 24,
        height: 24,
      },
    });
  }
}

// פונקציה שמציגה או מסתירה את תפריט הפרויקט
function toggleProjectMenu(event) {
  // מונעת את הפעולה של לחיצה על ההורה
  event.stopPropagation();
  // מקבלת את תפריט הפרויקט
  const menu = document.getElementById("projectMenu");
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
    setTimeout(() => {
      menu.style.display = "none";
    }, 200);
    // אחרת, מציגה את התפריט
  } else {
    menu.style.display = "block";
    requestAnimationFrame(() => {
      menu.classList.add("visible");
    });
  }
}

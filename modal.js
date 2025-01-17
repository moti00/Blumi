// פונקציה שפותחת את המודל להוספת לקוח
function openAddClientModal() {
  // מציגה את המודל עם ה-ID "addClientModal"
  document.getElementById("addClientModal").style.display = "block";
}

// פונקציה שסוגרת את המודל להוספת לקוח
function closeAddClientModal() {
  // מסתירה את המודל עם ה-ID "addClientModal"
  document.getElementById("addClientModal").style.display = "none";
}

// פונקציה שפותחת את המודל להוספת פרויקט
function openAddProjectModal() {
  // מציגה את המודל עם ה-ID "addProjectModal"
  document.getElementById("addProjectModal").style.display = "block";
}

// פונקציה שסוגרת את המודל להוספת פרויקט
function closeAddProjectModal() {
  // מסתירה את המודל עם ה-ID "addProjectModal"
  document.getElementById("addProjectModal").style.display = "none";
}

// פונקציה שפותחת את המודל להוספת רישום זמן
function openAddTimeEntryModal() {
  // מציגה את המודל עם ה-ID "addTimeEntryModal"
  document.getElementById("addTimeEntryModal").style.display = "block";
  // מקבלת את הזמן הנוכחי
  const now = new Date();
  // מקבלת את שדות התאריך והשעה
  const timeEntryStart = document.getElementById("timeEntryStart");
  const timeEntryEnd = document.getElementById("timeEntryEnd");
  // מגדירה את שדות התאריך והשעה לזמן הנוכחי
  timeEntryStart.value = now.toISOString().slice(0, 16);
  timeEntryEnd.value = now.toISOString().slice(0, 16);
}

// פונקציה שסוגרת את המודל להוספת רישום זמן
function closeAddTimeEntryModal() {
  // מסתירה את המודל עם ה-ID "addTimeEntryModal"
  document.getElementById("addTimeEntryModal").style.display = "none";
}

// פונקציה שפותחת את המודל לעריכת לקוח
function openEditClientModal() {
  // מחפשת את הלקוח הנוכחי
  const client = clients.find((c) => c.id === currentClient);
  // אם הלקוח נמצא
  if (client) {
    // מעדכנת את שדות הקלט בערכים הקיימים
    document.getElementById("editClientName").value = client.name;
    document.getElementById("editClientEmail").value = client.email || "";
    document.getElementById("editClientPhone").value = client.phone || "";
    document.getElementById("editClientDefaultPaymentType").value =
      client.defaultPaymentType || "hourly";
    document.getElementById("editClientDefaultHourlyRate").value =
      client.defaultHourlyRate || "";
    document.getElementById("editClientDefaultGlobalRate").value =
      client.defaultGlobalRate || "";
    // מציגה את המודל לעריכת לקוח
    document.getElementById("editClientModal").style.display = "block";
  }
  // מסתירה את התפריט של הלקוח
  document.getElementById("clientMenu").style.display = "none";
}

// פונקציה שסוגרת את המודל לעריכת לקוח
function closeEditClientModal() {
  // מסתירה את המודל עם ה-ID "editClientModal"
  document.getElementById("editClientModal").style.display = "none";
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
    // מציגה את המודל לעריכת פרויקט
    document.getElementById("editProjectModal").style.display = "block";
  }
  // מסתירה את תפריט הפרויקט
  document.getElementById("projectMenu").style.display = "none";
}

// פונקציה שסוגרת את המודל לעריכת פרויקט
function closeEditProjectModal() {
  // מסתירה את המודל עם ה-ID "editProjectModal"
  document.getElementById("editProjectModal").style.display = "none";
}

// פונקציה שפותחת את המודל לעריכת רישום זמן
function openEditTimeEntryModal(entryId) {
  // מחפשת את הלקוח והפרויקט הנוכחיים
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  // מחפשת את רישום הזמן
  const entry = project?.timeEntries.find((e) => e.id === entryId);
  // אם רישום הזמן נמצא
  if (entry) {
    // מעדכנת את שדות הקלט בערכים הקיימים
    document.getElementById("editTimeEntryStart").value = entry.startTime.slice(
      0,
      16
    );
    document.getElementById("editTimeEntryEnd").value = entry.endTime.slice(
      0,
      16
    );
    // מציגה את המודל לעריכת רישום זמן
    document.getElementById("editTimeEntryModal").style.display = "block";
    // שומרת את ה-ID של רישום הזמן
    document.getElementById("editTimeEntryModal").dataset.entryId = entryId;
  }
}

// פונקציה שסוגרת את המודל לעריכת רישום זמן
function closeEditTimeEntryModal() {
  // מסתירה את המודל עם ה-ID "editTimeEntryModal"
  document.getElementById("editTimeEntryModal").style.display = "none";
}

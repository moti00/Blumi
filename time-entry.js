// פונקציה ששומרת זמן עבודה
function saveTimeEntry(duration, isStart = false) {
  // מקבלת את תיבת הבחירה של הפרויקטים
  const projectSelect = document.getElementById("timerProjectSelect");
  // מקבלת את ה-ID של הפרויקט הנבחר
  const selectedProjectId = parseInt(projectSelect.value);
  // בודקת אם יש ID של פרויקט נבחר
  if (selectedProjectId) {
    // עוברת על כל הלקוחות
    clients.forEach((client) => {
      // מחפשת את הפרויקט שנבחר
      const projectIndex = client.projects.findIndex(
        (p) => p.id === selectedProjectId
      );
      // אם הפרויקט נמצא
      if (projectIndex !== -1) {
        // אם הפונקציה נקראה כשמתחילים את הטיימר
        if (isStart) {
          // מחפשת אם כבר יש רישום זמן פעיל
          const existingEntry = client.projects[projectIndex].timeEntries.find(
            (entry) => entry.endTime === null
          );
          // אם אין רישום זמן פעיל
          if (!existingEntry) {
            // יוצרת רישום זמן חדש
            const timeEntry = {
              id: Date.now(),
              startTime: new Date().toISOString(),
              duration: 0,
              endTime: null,
              projectId: selectedProjectId,
            };
            // מוסיפה את רישום הזמן למערך של רישומי הזמן של הפרויקט
            client.projects[projectIndex].timeEntries.push(timeEntry);
            // מעדכנת את הזמן האחרון שהשתמשו בפרויקט
            client.projects[projectIndex].lastUsed = Date.now();
            // מעבירה את הפרויקט לראש הרשימה
            const [project] = client.projects.splice(projectIndex, 1);
            client.projects.unshift(project);
          }
          // אם הפונקציה נקראה כשעוצרים את הטיימר
        } else {
          // מחפשת את רישום הזמן הפעיל
          const lastEntry = client.projects[projectIndex].timeEntries.find(
            (entry) => entry.endTime === null
          );
          // אם נמצא רישום זמן פעיל
          if (lastEntry) {
            // מעדכנת את זמן הסיום
            lastEntry.endTime = new Date().toISOString();
            // מעדכנת את משך הזמן
            lastEntry.duration = duration;
          }
        }
      }
    });
    // שומרת את השינויים ב-localStorage
    saveToLocalStorage();
    // אם יש פרויקט נוכחי, מרנדרת את פרטי הפרויקט
    if (currentProject) {
      showProjectDetails(currentProject);
    }
    // מעדכנת את תיבת הבחירה של הפרויקטים
    updateProjectSelect();
  }
}

// פונקציה שמוסיפה רישום זמן דרך מודל
function addTimeEntryFromModal() {
  // מקבלת את זמני ההתחלה והסיום
  const startTime = new Date(document.getElementById("timeEntryStart").value);
  const endTime = new Date(document.getElementById("timeEntryEnd").value);
  // בודקת שזמני ההתחלה והסיום חוקיים
  if (startTime && endTime && startTime < endTime) {
    const duration = (endTime - startTime) / 1000;
    // יוצרת רישום זמן חדש
    const timeEntry = {
      id: Date.now(),
      startTime: startTime.toISOString(),
      duration: duration,
      endTime: endTime.toISOString(),
    };
    // מחפשת את הלקוח הנוכחי
    const client = clients.find((c) => c.id === currentClient);
    // אם הלקוח נמצא
    if (client) {
      // מחפשת את הפרויקט הנוכחי
      const projectIndex = client.projects.findIndex(
        (p) => p.id === currentProject
      );
      // אם הפרויקט נמצא
      if (projectIndex !== -1) {
        // מוסיפה את הרישום זמן לפרויקט
        client.projects[projectIndex].timeEntries.push(timeEntry);
        // ממיינת את רישומי הזמן לפי תאריך התחלה
        client.projects[projectIndex].timeEntries.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        // מעדכנת את הזמן האחרון שהשתמשו בפרויקט
        client.projects[projectIndex].lastUsed = Date.now();
        // מעבירה את הפרויקט לראש הרשימה
        const [project] = client.projects.splice(projectIndex, 1);
        client.projects.unshift(project);
        // שומרת את השינויים ב-localStorage
        saveToLocalStorage();
        // מרנדרת את פרטי הפרויקט
        showProjectDetails(currentProject);
        // סוגרת את המודל
        closeAddTimeEntryModal();
      }
    }
  }
}

// פונקציה ששומרת את העריכה של רישום זמן
function saveTimeEntryEdit() {
  // מקבלת את ה-ID של רישום הזמן שנערך
  const entryId = parseInt(
    document.getElementById("editTimeEntryModal").dataset.entryId
  );
  // מקבלת את זמני ההתחלה והסיום
  const startTime = new Date(
    document.getElementById("editTimeEntryStart").value
  );
  const endTime = new Date(document.getElementById("editTimeEntryEnd").value);
  // בודקת שזמני ההתחלה והסיום חוקיים
  if (startTime && endTime && startTime < endTime) {
    // מחפשת את הלקוח הנוכחי
    const client = clients.find((c) => c.id === currentClient);
    // מחפשת את הפרויקט הנוכחי
    const project = client?.projects.find((p) => p.id === currentProject);
    // אם הפרויקט נמצא
    if (project) {
      // מסננת את רישום הזמן הישן מתוך המערך
      project.timeEntries = project.timeEntries.filter((e) => e.id !== entryId);
      // יוצרת רישום זמן חדש
      const newEntry = {
        id: entryId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: (endTime - startTime) / 1000,
      };
      // מוסיפה את רישום הזמן החדש
      project.timeEntries.push(newEntry);
      // ממיינת את רישומי הזמן
      project.timeEntries.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      // שומרת את השינויים ב-localStorage
      saveToLocalStorage();
      // מרנדרת את פרטי הפרויקט
      showProjectDetails(currentProject);
      // סוגרת את המודל
      closeEditTimeEntryModal();
    }
  }
}

// פונקציה שמציגה או מסתירה את האפשרויות של רישום זמן
function toggleTimeEntry(entryId) {
  // מקבלת את האלמנט הקדמי של רישום הזמן
  const frontEl = document.querySelector(
    `#time-entry-${entryId} .time-entry-front`
  );
  // מוסיפה או מסירה את המחלקה 'collapsed'
  frontEl.classList.toggle("collapsed");
}

// פונקציה שמוחקת רישום זמן
function deleteTimeEntry(entryId) {
  // מקבלת את אלמנט רישום הזמן
  const entryElement = document.getElementById(`time-entry-${entryId}`);
  if (entryElement) {
    // שמירת הגובה המקורי לפני האנימציה
    const originalHeight = entryElement.offsetHeight;
    entryElement.style.maxHeight = originalHeight + "px";

    // שלב ראשון - החלקה והיעלמות
    entryElement.classList.add("time-entry-delete-animation-1");

    // שלב שני - כיווץ הגובה
    setTimeout(() => {
      entryElement.classList.add("time-entry-delete-animation-2");

      // מחיקה מהדאטה ורענון התצוגה רק אחרי שהאנימציה הסתיימה
      setTimeout(() => {
        // מחפשת את הלקוח הנוכחי
        const client = clients.find((c) => c.id === currentClient);
        // מחפשת את הפרויקט הנוכחי
        const project = client?.projects.find((p) => p.id === currentProject);
        // אם הפרויקט נמצא
        if (project) {
          // מסננת את רישום הזמן מהמערך
          project.timeEntries = project.timeEntries.filter(
            (entry) => entry.id !== entryId
          );
          // שומרת את השינויים ב-localStorage
          saveToLocalStorage();
          // מרנדרת את פרטי הפרויקט
          showProjectDetails(currentProject);
        }
      }, 300); // הזמן הכולל של האנימציה
    }, 300);
  }
}

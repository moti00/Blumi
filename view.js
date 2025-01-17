// פונקציה שמציגה את התצוגה הראשית (רשימת לקוחות)
function showMainView() {
  // מציגה את האלמנט עם ה-ID "main-view" (הופכת אותו לגלוי)
  document.getElementById("main-view").style.display = "block";
  // מסתירה את האלמנטים עם ה-IDs "client-details" ו-"project-details" (הופכת אותם ללא גלויים)
  document.getElementById("client-details").style.display = "none";
  document.getElementById("project-details").style.display = "none";
  // מאפסת את הלקוח והפרויקט הנוכחיים
  currentClient = null;
  currentProject = null;
  // מרנדרת את רשימת הלקוחות
  renderClientList();
  // מעדכנת את רשימת הפרויקטים בתוך תיבת הבחירה
  updateProjectSelect();
  // מחליפה את הסמלים (אייקונים) בעזרת ספריית Feather
  replaceFeatherIcons();
}

// פונקציה שמרנדרת את רשימת הלקוחות
function renderClientList() {
  // מקבלת את האלמנט של רשימת הלקוחות מה-DOM
  const clientList = document.getElementById("clientList");
  // מנקה את התוכן הקיים של רשימת הלקוחות
  clientList.innerHTML = "";
  // עוברת על כל לקוח במערך הלקוחות
  clients.forEach((client) => {
    // יוצרת אלמנט רשימה (<li>) עבור כל לקוח
    const li = document.createElement("li");
    // מוסיפה לו מחלקה בשם "client-item"
    li.className = "client-item";
    // יוצרת אלמנט span עבור שם הלקוח
    const nameSpan = document.createElement("span");
    // מגדירה את הטקסט של ה-span להיות שם הלקוח
    nameSpan.textContent = client.name;
    // יוצרת אלמנט div עבור כמות הפרויקטים
    const countDiv = document.createElement("div");
    // מוסיפה לו מחלקה בשם "project-count"
    countDiv.className = "project-count";
    // יוצרת אלמנט div עבור מספר הפרויקטים
    const countNumber = document.createElement("div");
    // מוסיפה לו מחלקה בשם "project-count-number"
    countNumber.className = "project-count-number";
    // מגדירה את הטקסט של ה-div להיות כמות הפרויקטים של הלקוח
    countNumber.textContent = client.projects.length;
    // יוצרת אלמנט div עבור הטקסט "פרויקטים"
    const countLabel = document.createElement("div");
    // מגדירה את הטקסט של ה-div להיות "פרויקטים"
    countLabel.textContent = "פרויקטים";
    // מוסיפה את מספר הפרויקטים והטקסט של הכמות אל ה-div הראשי
    countDiv.appendChild(countNumber);
    countDiv.appendChild(countLabel);
    // מוסיפה את שם הלקוח ואת כמות הפרויקטים ל-li
    li.appendChild(nameSpan);
    li.appendChild(countDiv);
    // מגדירה פונקציה שתפעל כאשר לוחצים על ה-li, שתציג את פרטי הלקוח
    li.onclick = () => showClientDetails(client.id);
    // מוסיפה את ה-li לרשימת הלקוחות
    clientList.appendChild(li);
  });
  // מעדכנת את רשימת הפרויקטים בתוך תיבת הבחירה
  updateProjectSelect();
  // מוסיפה Tooltip לאייקון הוספת לקוח
  const panelHTML = document.querySelector(".panel");
  if (panelHTML) {
    const headerContainer = panelHTML.querySelector(".header-container");
    if (headerContainer) {
      const addIcon = headerContainer.querySelector(".add-icon");
      if (addIcon) {
        addIcon.classList.add("tooltip");
        addIcon.setAttribute("data-tooltip", "הוסף לקוח");
      }
    }
  }
}

// פונקציה שמרנדרת את רשימת הפרויקטים של לקוח מסוים
function renderProjects(client) {
  // מקבלת את אלמנט ה-div שמכיל את רשימת הפרויקטים
  const projectsContainer = document.getElementById("client-projects");
  // מרנדרת את הכותרת של רשימת הפרויקטים, כולל כפתור הוספה
  projectsContainer.innerHTML = `
      <div class="header-container">
        <h2>רשימת פרויקטים</h2>
        <div class="add-icon tooltip" data-tooltip="הוספת פרויקט חדש" onclick="openAddProjectModal()">+</div>
      </div>
      <ul class="project-list"></ul>
    `;
  // מקבלת את רשימת ה-ul של הפרויקטים
  const projectsList = projectsContainer.querySelector(".project-list");
  // יוצרת עותק של מערך הפרויקטים וממיינת אותו לפי התאריך האחרון שנעשה בו שימוש
  const sortedProjects = [...client.projects].sort(
    (a, b) => (b.lastUsed || 0) - (a.lastUsed || 0)
  );
  // עוברת על כל פרויקט ממוין
  sortedProjects.forEach((project) => {
    // יוצרת אלמנט רשימה עבור הפרויקט
    const li = document.createElement("li");
    // מוסיפה לו מחלקה בשם "project-item"
    li.className = "project-item";
    // יוצרת אלמנט span עבור שם הפרויקט
    const nameSpan = document.createElement("span");
    // מגדירה את הטקסט של ה-span להיות שם הפרויקט
    nameSpan.textContent = project.name;
    // מחשבת את סך הזמן של כל הtime-entries של הפרויקט בשניות
    const totalSeconds = project.timeEntries.reduce(
      (acc, entry) => (entry.endTime ? acc + entry.duration : acc),
      0
    );
    // ממירה את השניות לשעות ודקות
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    // יוצרת מחרוזת של שעות:דקות
    const timeStr = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;
    // יוצרת אלמנט span עבור זמן הפרויקט
    const timeSpan = document.createElement("span");
    // מוסיפה לו מחלקה בשם "project-time"
    timeSpan.className = "project-time";
    // מגדירה את הטקסט של ה-span להיות הזמן שחושב
    timeSpan.textContent = timeStr;
    // מוסיפה את שם הפרויקט ואת הזמן ל-li
    li.appendChild(nameSpan);
    li.appendChild(timeSpan);
    // מגדירה פונקציה שתפעל כאשר לוחצים על ה-li, שתציג את פרטי הפרויקט
    li.onclick = () => showProjectDetails(project.id);
    // מוסיפה את ה-li לרשימת הפרויקטים
    projectsList.appendChild(li);
  });
}

// פונקציה שמרנדרת את פרטי הפרויקט
function renderProjectDetails(project) {
  // מקבלת את האלמנטים שמכילים את פרטי הפרויקט ואת רשימת הזמנים
  const projectInfo = document.getElementById("project-info");
  const timeEntries = document.getElementById("time-entries");
  // מחשבת את סך הזמן של כל הtime-entries של הפרויקט בשניות
  const totalSeconds = project.timeEntries.reduce(
    (acc, entry) => acc + entry.duration,
    0
  );
  // ממירה את השניות לשעות ודקות
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  // יוצרת מחרוזת של שעות:דקות
  const totalTimeStr = `${String(totalHours).padStart(2, "0")}:${String(
    totalMinutes
  ).padStart(2, "0")}`;
  // מקבלת את התאריך הנוכחי
  const now = new Date();
  // יוצרת אובייקטי תאריך מהתאריכים של הפרויקט
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  // מגדירה טקסט וסגנון לסטטוס הפרויקט
  let statusText = project.status;
  let statusClass = "";
  let statusTooltip = "";

  // בודקת את הסטטוס של הפרויקט ומעדכנת את הטקסט והסגנון בהתאם
  if (!(startDate instanceof Date) || isNaN(startDate)) {
    statusText = "לא הוגדר";
  } else if (startDate > now) {
    statusText = "עתידי";
  } else if (!(endDate instanceof Date) || isNaN(endDate)) {
    statusText = "לא הוגדר";
  } else if (statusText === "פעיל") {
    if (endDate < now) {
      statusClass = "project-status-overdue";
      statusTooltip =
        "הפרויקט עדיין פעיל למרות שתאריך היעד שלו עבר, ניתן לשנות את הסטטוס או את תאריך היעד בעריכת הפרויקט";
    }
  }
  // מגדירה tooltip לתשלום
  const paymentTooltip = "הסכום יכול להשתנות כל עוד לא סיימו לעבוד על הפרויקט";

  // מרנדרת את פרטי הפרויקט לתוך ה-HTML
  projectInfo.innerHTML = `
      <div id="total-time-container">
        <div id="total-time-display">
          <span id="total-time-value">${totalTimeStr}</span>
          <span id="total-time-label">שעות עבודה</span>
        </div>
      </div>
      <table class="details-table">
        <tr>
          <td>סוג תשלום:</td>
          <td>${project.paymentType === "hourly" ? "שעתי" : "גלובלי"}</td>
        </tr>
        <tr>
          <td>סכום:</td>
          <td>${project.paymentAmount} ₪ ${
    project.paymentType === "hourly" ? "לשעה" : "לפרויקט"
  }</td>
        </tr>
        <tr>
          <td>תאריך התחלה:</td>
          <td>${
            project.startDate
              ? new Date(project.startDate).toLocaleString()
              : "לא הוגדר"
          }</td>
        </tr>
        <tr>
          <td>תאריך יעד:</td>
          <td>${
            project.endDate
              ? new Date(project.endDate).toLocaleString()
              : "לא הוגדר"
          }</td>
        </tr>
        ${
          project.actualEndDate
            ? `
                <tr>
                  <td>תאריך סיום:</td>
                  <td>${
                    project.actualEndDate
                      ? new Date(project.actualEndDate).toLocaleString()
                      : "לא הוגדר"
                  }</td>
                </tr>
              `
            : ""
        }
        <tr>
          <td>${
            project.paymentType === "hourly" ? 'סה"כ לתשלום' : "יוצא לשעה"
          }:</td>
          <td>
            ${
              project.paymentType === "hourly"
                ? `${((totalSeconds / 3600) * project.paymentAmount).toFixed(
                    2
                  )} ₪`
                : `${
                    totalSeconds > 0
                      ? (project.paymentAmount / (totalSeconds / 3600)).toFixed(
                          2
                        )
                      : "0"
                  } ₪ `
            }
            <span class="info-icon tooltip" data-tooltip="${paymentTooltip}">
              <i data-feather="info" style="width: 12px; height: 12px;"></i>
            </span>
          </td>
        </tr>
        <tr>
          <td>סטטוס:</td>
          <td class="${statusClass}">${statusText} ${
    statusClass !== ""
      ? `<span class="info-icon tooltip" data-tooltip="${statusTooltip}">
                   <i data-feather="info" style="width: 12px; height: 12px;"></i>
                 </span>`
      : ""
  }</td>
        </tr>
      </table>
    `;
  // מרנדרת את הכותרת של רשימת הזמנים
  timeEntries.innerHTML = `
      <div class="header-container">
        <h3>רשימת שעות</h3>
        <div class="add-icon tooltip" data-tooltip="הוספת זמן עבודה" onclick="openAddTimeEntryModal()">+</div>
      </div>
    `;
  // יוצרת אובייקט שמכיל מערכים של זמן עבודה, מופרדים לפי תאריך
  const entriesByDate = {};
  project.timeEntries.forEach((entry) => {
    const date = new Date(entry.startTime);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString();
    if (!entriesByDate[dateKey]) {
      entriesByDate[dateKey] = [];
    }
    entriesByDate[dateKey].push(entry);
  });
  // ממיינת את התאריכים בסדר יורד
  const sortedDates = Object.keys(entriesByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  // עוברת על כל תאריך
  sortedDates.forEach((dateKey) => {
    // יוצרת כותרת עבור כל תאריך
    const dateHeader = document.createElement("h4");
    // מגדירה את הטקסט של הכותרת להיות התאריך בפורמט קריא
    dateHeader.textContent = formatDate(dateKey);
    // מוסיפה את הכותרת לרשימת הזמנים
    timeEntries.appendChild(dateHeader);
    // ממיינת את הזמני עבודה של אותו יום
    const sortedEntries = entriesByDate[dateKey].sort(
      (a, b) => new Date(b.startTime) - new Date(a.startTime)
    );
    // עוברת על כל זמן עבודה
    sortedEntries.forEach((entry) => {
      // יוצרת אלמנט div עבור הזמן עבודה
      const div = document.createElement("div");
      // מוסיפה לו מחלקה בשם "time-entry-container"
      div.className = "time-entry-container";
      // מגדירה לו ID
      div.id = `time-entry-${entry.id}`;
      // יוצרת div קדמי (מוצג כברירת מחדל)
      const frontDiv = document.createElement("div");
      // מוסיפה לו מחלקה בשם "time-entry-front"
      frontDiv.className = "time-entry-front";
      // מגדירה פונקציה שתופעל בלחיצה על הזמן עבודה, ושתציג או תסתיר את האפשרויות השונות
      frontDiv.onclick = () => toggleTimeEntry(entry.id);
      // מחשבת את השעות והדקות של זמן העבודה
      const hours = Math.floor(entry.duration / 3600);
      const minutes = Math.floor((entry.duration % 3600) / 60);
      // יוצרת מחרוזת של שעות:דקות
      const timeStr = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      // מחשבת את התשלום עבור זמן העבודה, אם יש תשלום שעתי
      const entryPayment =
        project.paymentType === "hourly"
          ? (entry.duration / 3600) * project.paymentAmount
          : null;
      // מקבלת את הזמן התחלה והסוף של זמן העבודה
      const startTime = new Date(entry.startTime);
      const endTime = entry.endTime ? new Date(entry.endTime) : null;
      // מרנדרת את המידע בתוך ה-div הקדמי
      frontDiv.innerHTML = `
          <div class="time-entry-details">
            <table class="time-entry-table">
              <tr>
                <td>התחלה:</td>
                <td>${startTime.toLocaleTimeString()}</td>
              </tr>
              <tr>
                <td>סיום:</td>
                <td>${endTime ? endTime.toLocaleTimeString() : ""}</td>
              </tr>
              ${
                entryPayment !== null
                  ? `
                      <tr>
                        <td>תשלום:</td>
                        <td>${entryPayment.toFixed(2)} ₪</td>
                      </tr>
                    `
                  : ""
              }
            </table>
          </div>
          <div class="time-entry-duration">${timeStr}</div>
        `;
      // יוצרת div אחורי (מוסתר כברירת מחדל)
      const backDiv = document.createElement("div");
      // מוסיפה לו מחלקה בשם "time-entry-back"
      backDiv.className = "time-entry-back";
      // מרנדרת את האפשרויות עריכה ומחיקה בתוך ה-div האחורי
      backDiv.innerHTML = `
          <button class="time-entry-action" onclick="openEditTimeEntryModal('${entry.id}')" data-feather="edit-2"></button>
          <div class="time-entry-action-divider"></div>
          <button class="time-entry-action" onclick="deleteTimeEntry(${entry.id})" data-feather="trash-2"></button>
        `;
      // מוסיפה את ה-div האחורי והקדמי ל-div הראשי של זמן העבודה
      div.appendChild(backDiv);
      div.appendChild(frontDiv);
      // מוסיפה את ה-div הראשי לרשימת הזמנים
      timeEntries.appendChild(div);
    });
  });
  // מרעננת את האייקונים
  feather.replace();
  replaceFeatherIcons();
}

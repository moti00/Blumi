function showMainView() {
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("is-active"));
  document.getElementById("list").classList.add("is-active");
  showListView();
}

function showListView() {
  document.getElementById("main-view").style.display = "block";
  document.getElementById("client-details").style.display = "none";
  document.getElementById("project-details").style.display = "none";
  currentClient = null;
  currentProject = null;
  renderClientList();
  updateProjectSelect();
  replaceFeatherIcons();
}

function showClientDetails(clientId) {
  const client = clients.find((client) => client.id === clientId);
  if (client) {
    currentClient = client;
    document.getElementById("main-view").style.display = "none";
    document.getElementById("client-details").style.display = "block";
    document.getElementById("project-details").style.display = "none";
    document.getElementById("client-details-name").textContent = client.name;
    renderProjects(client);
  }
}

function showProjectDetails(projectId) {
  const project = currentClient.projects.find(
    (project) => project.id === projectId
  );
  if (project) {
    currentProject = project;
    document.getElementById("main-view").style.display = "none";
    document.getElementById("client-details").style.display = "none";
    document.getElementById("project-details").style.display = "block";
    document.getElementById("project-details-name").textContent = project.name;
    renderProjectDetails(project);
  }
}

function renderClientList() {
  const clientList = document.getElementById("clientList");
  clientList.innerHTML = "";
  clients.forEach((client) => {
    const li = document.createElement("li");
    li.className = "client-item";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = client.name;
    const countDiv = document.createElement("div");
    countDiv.className = "project-count";
    const countNumber = document.createElement("div");
    countNumber.className = "project-count-number";
    countNumber.textContent = client.projects.length;
    const countLabel = document.createElement("div");
    countLabel.textContent = "פרויקטים";
    countDiv.appendChild(countNumber);
    countDiv.appendChild(countLabel);
    li.appendChild(nameSpan);
    li.appendChild(countDiv);
    li.onclick = () => showClientDetails(client.id);
    clientList.appendChild(li);
  });
  updateProjectSelect();
  const panelHTML = document.querySelector(".panel");
  if (panelHTML) {
    const headerContainer = document.querySelector(".header-container");
    if (headerContainer) {
      const addIcon = headerContainer.querySelector(".add-icon");
      if (addIcon) {
        addIcon.classList.add("tooltip");
        addIcon.setAttribute("data-tooltip", "הוסף לקוח");
      }
    }
  }
}

function renderProjects(client) {
  const projectsContainer = document.getElementById("client-projects");
  projectsContainer.innerHTML = `
    <div class="header-container">
      <h2>רשימת פרויקטים</h2>
      <div class="add-icon tooltip" data-tooltip="הוספת פרויקט חדש" onclick="openAddProjectModal()">+</div>
    </div>
    <ul class="project-list"></ul>
  `;
  const projectsList = projectsContainer.querySelector(".project-list");
  const sortedProjects = [...client.projects].sort(
    (a, b) => (b.lastUsed || 0) - (a.lastUsed || 0)
  );
  sortedProjects.forEach((project) => {
    const li = document.createElement("li");
    li.className = "project-item";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = project.name;
    const totalSeconds = project.timeEntries.reduce(
      (acc, entry) => acc + entry.duration,
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const timeStr = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;
    const timeSpan = document.createElement("span");
    timeSpan.className = "project-time";
    timeSpan.textContent = timeStr;
    li.appendChild(nameSpan);
    li.appendChild(timeSpan);
    li.onclick = () => showProjectDetails(project.id);
    projectsList.appendChild(li);
  });
}

function renderProjectDetails(project) {
  const projectInfo = document.getElementById("project-info");
  const timeEntries = document.getElementById("time-entries");
  const totalSeconds = project.timeEntries.reduce(
    (acc, entry) => acc + entry.duration,
    0
  );
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalTimeStr = `${String(totalHours).padStart(2, "0")}:${String(
    totalMinutes
  ).padStart(2, "0")}`;
  const now = new Date();
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  let statusText = project.status;
  let statusClass = "";
  let statusTooltip = "";

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
  const paymentTooltip = "הסכום יכול להשתנות כל עוד לא סיימו לעבוד על הפרויקט";

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
        <td>${
          project.paymentType === "hourly"
            ? `${((totalSeconds / 3600) * project.paymentAmount).toFixed(2)} ₪`
            : `${
                totalSeconds > 0
                  ? (project.paymentAmount / (totalSeconds / 3600)).toFixed(2)
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
  timeEntries.innerHTML = `
    <div class="header-container">
      <h3>רשימת שעות</h3>
      <div class="add-icon tooltip" data-tooltip="הוספת זמן עבודה" onclick="openAddTimeEntryModal()">+</div>
    </div>
  `;
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
  const sortedDates = Object.keys(entriesByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  sortedDates.forEach((dateKey) => {
    const dateHeader = document.createElement("h4");
    dateHeader.textContent = formatDate(dateKey);
    timeEntries.appendChild(dateHeader);
    const sortedEntries = entriesByDate[dateKey].sort(
      (a, b) => new Date(b.startTime) - new Date(a.startTime)
    );
    sortedEntries.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "time-entry-container";
      div.id = `time-entry-${entry.id}`;
      const frontDiv = document.createElement("div");
      frontDiv.className = "time-entry-front";
      frontDiv.onclick = () => toggleTimeEntry(entry.id);
      const hours = Math.floor(entry.duration / 3600);
      const minutes = Math.floor((entry.duration % 3600) / 60);
      const timeStr = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
      const entryPayment =
        project.paymentType === "hourly"
          ? (entry.duration / 3600) * project.paymentAmount
          : null;
      const startTime = new Date(entry.startTime);
      const endTime = new Date(entry.endTime);
      frontDiv.innerHTML = `
        <div class="time-entry-details">
          <table class="time-entry-table">
            <tr>
              <td>זמן התחלה:</td>
              <td>${startTime.toLocaleTimeString()}</td>
            </tr>
            <tr>
              <td>זמן סיום:</td>
              <td>${endTime.toLocaleTimeString()}</td>
            </tr>
            ${
              project.paymentType === "hourly"
                ? `
            <tr>
              <td>סכום:</td>
              <td>${entryPayment.toFixed(2)} ₪</td>
            </tr>`
                : ""
            }
          </table>
        </div>
        <div class="time-entry-duration">${timeStr}</div>
      `;
      const backDiv = document.createElement("div");
      backDiv.className = "time-entry-back";
      backDiv.innerHTML = `
        <button class="time-entry-action" onclick="openEditTimeEntryModal(${entry.id})" data-feather="edit-2"></button>
        <div class="time-entry-action-divider"></div>
        <button class="time-entry-action" onclick="deleteTimeEntry(${entry.id})" data-feather="trash-2"></button>
      `;
      div.appendChild(backDiv);
      div.appendChild(frontDiv);
      timeEntries.appendChild(div);
    });
  });
  feather.replace();
  replaceFeatherIcons();
}

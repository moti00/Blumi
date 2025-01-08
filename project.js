function openAddProjectModal() {
  document.getElementById("addProjectModal").style.display = "block";
  const paymentTypeSelect = document.getElementById("paymentType");
  const paymentAmountInput = document.getElementById("paymentAmount");
  const startDateInput = document.getElementById("projectStartDate");
  const now = new Date();
  startDateInput.value = now.toISOString().slice(0, 16);
  const client = clients.find((c) => c.id === currentClient);
  if (client) {
    paymentTypeSelect.value = client.defaultPaymentType;
    if (client.defaultPaymentType === "hourly") {
      paymentAmountInput.value = client.defaultHourlyRate || "";
    } else if (client.defaultPaymentType === "global") {
      paymentAmountInput.value = client.defaultGlobalRate || "";
    } else {
      paymentAmountInput.value = "";
    }
    paymentTypeSelect.onchange = () => {
      if (paymentTypeSelect.value === "hourly") {
        paymentAmountInput.value = client.defaultHourlyRate || "";
      } else if (paymentTypeSelect.value === "global") {
        paymentAmountInput.value = client.defaultGlobalRate || "";
      } else {
        paymentAmountInput.value = "";
      }
    };
  } else {
    paymentAmountInput.value = "";
    paymentTypeSelect.value = "hourly";
  }
}

function addProjectFromModal() {
  const projectName = document.getElementById("projectName").value.trim();
  const paymentType = document.getElementById("paymentType").value;
  const paymentAmount = parseFloat(
    document.getElementById("paymentAmount").value
  );
  const startDate = document.getElementById("projectStartDate").value;
  const endDate = document.getElementById("projectEndDate").value;
  if (projectName && paymentAmount) {
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
    const client = clients.find((c) => c.id === currentClient);
    if (client) {
      client.projects.unshift(project);
      saveToLocalStorage();
      showClientDetails(currentClient);
      closeAddProjectModal();
      document.getElementById("projectName").value = "";
      document.getElementById("paymentAmount").value = "";
    }
  }
}

function openEditProjectModal() {
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  if (project) {
    document.getElementById("editProjectName").value = project.name;
    document.getElementById("editPaymentType").value = project.paymentType;
    document.getElementById("editPaymentAmount").value = project.paymentAmount;
    document.getElementById("editProjectStartDate").value = project.startDate;
    document.getElementById("editProjectEndDate").value = project.endDate;
    document.getElementById("editProjectStatus").value = project.status;
    const paymentTypeSelect = document.getElementById("editPaymentType");
    const paymentAmountInput = document.getElementById("editPaymentAmount");

    paymentTypeSelect.onchange = () => {
      if (paymentTypeSelect.value === "hourly") {
        paymentAmountInput.value = client.defaultHourlyRate || "";
      } else if (paymentTypeSelect.value === "global") {
        paymentAmountInput.value = client.defaultGlobalRate || "";
      } else {
        paymentAmountInput.value = "";
      }
    };
    document.getElementById("editProjectModal").style.display = "block";
  }
  document.getElementById("projectMenu").style.display = "none";
}

function saveProjectEdit() {
  const newName = document.getElementById("editProjectName").value.trim();
  const newPaymentType = document.getElementById("editPaymentType").value;
  const newPaymentAmount = parseFloat(
    document.getElementById("editPaymentAmount").value
  );
  const newStartDate = document.getElementById("editProjectStartDate").value;
  const newEndDate = document.getElementById("editProjectEndDate").value;
  const newStatus = document.getElementById("editProjectStatus").value;
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  let actualEndDate = project.actualEndDate;
  if (newStatus === "הסתיים") {
    actualEndDate = new Date().toISOString();
  } else if (newStatus === "מושהה" || newStatus === "פעיל") {
    actualEndDate = null;
  }
  if (newName && newPaymentAmount) {
    if (project) {
      project.name = newName;
      project.paymentType = newPaymentType;
      project.paymentAmount = newPaymentAmount;
      project.startDate = newStartDate;
      project.endDate = newEndDate;
      project.status = newStatus;
      project.actualEndDate = actualEndDate;
      saveToLocalStorage();
      showProjectDetails(currentProject);
      closeEditProjectModal();
    }
  }
}

function deleteProject() {
  if (confirm("האם אתה בטוח שברצונך למחוק את הפרויקט?")) {
    const client = clients.find((c) => c.id === currentClient);
    if (client) {
      client.projects = client.projects.filter((p) => p.id !== currentProject);
      saveToLocalStorage();
      showClientDetails(currentClient);
    }
  }
  document.getElementById("projectMenu").style.display = "none";
}

function showProjectDetails(projectId) {
  currentProject = projectId;
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === projectId);
  if (project) {
    document.getElementById("main-view").style.display = "none";
    document.getElementById("client-details").style.display = "none";
    document.getElementById("project-details").style.display = "block";
    window.scrollTo(0, 0);
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
    renderProjectDetails(project);
    feather.replace({
      "chevrons-right": {
        width: 24,
        height: 24,
      },
    });
  }
}

function toggleProjectMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById("projectMenu");
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

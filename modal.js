function openAddClientModal() {
  document.getElementById("addClientModal").style.display = "block";
}

function closeAddClientModal() {
  document.getElementById("addClientModal").style.display = "none";
}

function openAddProjectModal() {
  document.getElementById("addProjectModal").style.display = "block";
}

function closeAddProjectModal() {
  document.getElementById("addProjectModal").style.display = "none";
}

function openAddTimeEntryModal() {
  document.getElementById("addTimeEntryModal").style.display = "block";
  const now = new Date();
  const timeEntryStart = document.getElementById("timeEntryStart");
  const timeEntryEnd = document.getElementById("timeEntryEnd");
  timeEntryStart.value = now.toISOString().slice(0, 16);
  timeEntryEnd.value = now.toISOString().slice(0, 16);
}

function closeAddTimeEntryModal() {
  document.getElementById("addTimeEntryModal").style.display = "none";
}

function openEditClientModal() {
  const client = clients.find((c) => c.id === currentClient);
  if (client) {
    document.getElementById("editClientName").value = client.name;
    document.getElementById("editClientEmail").value = client.email || "";
    document.getElementById("editClientPhone").value = client.phone || "";
    document.getElementById("editClientDefaultPaymentType").value =
      client.defaultPaymentType || "hourly";
    document.getElementById("editClientDefaultHourlyRate").value =
      client.defaultHourlyRate || "";
    document.getElementById("editClientDefaultGlobalRate").value =
      client.defaultGlobalRate || "";
    document.getElementById("editClientModal").style.display = "block";
  }
  document.getElementById("clientMenu").style.display = "none";
}

function closeEditClientModal() {
  document.getElementById("editClientModal").style.display = "none";
}

function openEditProjectModal() {
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  if (project) {
    document.getElementById("editProjectName").value = project.name;
    document.getElementById("editPaymentType").value = project.paymentType;
    document.getElementById("editPaymentAmount").value = project.paymentAmount;
    document.getElementById("editProjectModal").style.display = "block";
  }
  document.getElementById("projectMenu").style.display = "none";
}

function closeEditProjectModal() {
  document.getElementById("editProjectModal").style.display = "none";
}

function openEditTimeEntryModal(entryId) {
  const client = clients.find((c) => c.id === currentClient);
  const project = client?.projects.find((p) => p.id === currentProject);
  const entry = project?.timeEntries.find((e) => e.id === entryId);
  if (entry) {
    document.getElementById("editTimeEntryStart").value = entry.startTime.slice(
      0,
      16
    );
    document.getElementById("editTimeEntryEnd").value = entry.endTime.slice(
      0,
      16
    );
    document.getElementById("editTimeEntryModal").style.display = "block";
    document.getElementById("editTimeEntryModal").dataset.entryId = entryId;
  }
}

function closeEditTimeEntryModal() {
  document.getElementById("editTimeEntryModal").style.display = "none";
}

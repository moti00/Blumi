function saveTimeEntry() {
  const projectSelect = document.getElementById("timerProjectSelect");
  const selectedProjectId = parseInt(projectSelect.value);
  if (selectedProjectId) {
    const duration = (new Date() - startTime) / 1000;
    const timeEntry = {
      id: Date.now(),
      startTime: startTime.toISOString(),
      duration: duration,
      endTime: new Date().toISOString(),
    };
    clients.forEach((client) => {
      const projectIndex = client.projects.findIndex(
        (p) => p.id === selectedProjectId
      );
      if (projectIndex !== -1) {
        client.projects[projectIndex].timeEntries.push(timeEntry);
        client.projects[projectIndex].lastUsed = Date.now();
        const [project] = client.projects.splice(projectIndex, 1);
        client.projects.unshift(project);
      }
    });
    saveToLocalStorage();
    if (currentProject) {
      showProjectDetails(currentProject);
    }
    updateProjectSelect();
  }
}

function addTimeEntryFromModal() {
  const startTime = new Date(document.getElementById("timeEntryStart").value);
  const endTime = new Date(document.getElementById("timeEntryEnd").value);
  if (startTime && endTime && startTime < endTime) {
    const duration = (endTime - startTime) / 1000;
    const timeEntry = {
      id: Date.now(),
      startTime: startTime.toISOString(),
      duration: duration,
      endTime: endTime.toISOString(),
    };
    const client = clients.find((c) => c.id === currentClient);
    if (client) {
      const projectIndex = client.projects.findIndex(
        (p) => p.id === currentProject
      );
      if (projectIndex !== -1) {
        client.projects[projectIndex].timeEntries.push(timeEntry);
        client.projects[projectIndex].timeEntries.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
        client.projects[projectIndex].lastUsed = Date.now();
        const [project] = client.projects.splice(projectIndex, 1);
        client.projects.unshift(project);
        saveToLocalStorage();
        showProjectDetails(currentProject);
        closeAddTimeEntryModal();
      }
    }
  }
}

function saveTimeEntryEdit() {
  const entryId = parseInt(
    document.getElementById("editTimeEntryModal").dataset.entryId
  );
  const startTime = new Date(
    document.getElementById("editTimeEntryStart").value
  );
  const endTime = new Date(document.getElementById("editTimeEntryEnd").value);
  if (startTime && endTime && startTime < endTime) {
    const client = clients.find((c) => c.id === currentClient);
    const project = client?.projects.find((p) => p.id === currentProject);
    if (project) {
      project.timeEntries = project.timeEntries.filter((e) => e.id !== entryId);
      const newEntry = {
        id: entryId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: (endTime - startTime) / 1000,
      };
      project.timeEntries.push(newEntry);
      project.timeEntries.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      saveToLocalStorage();
      showProjectDetails(currentProject);
      closeEditTimeEntryModal();
    }
  }
}

function toggleTimeEntry(entryId) {
  const frontEl = document.querySelector(
    `#time-entry-${entryId} .time-entry-front`
  );
  frontEl.classList.toggle("collapsed");
}

function deleteTimeEntry(entryId) {
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
        const client = clients.find((c) => c.id === currentClient);
        const project = client?.projects.find((p) => p.id === currentProject);
        if (project) {
          project.timeEntries = project.timeEntries.filter(
            (entry) => entry.id !== entryId
          );
          saveToLocalStorage();
          showProjectDetails(currentProject);
        }
      }, 300); // הזמן הכולל של האנימציה
    }, 300);
  }
}

function formatDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);
  if (inputDate.getTime() === today.getTime()) {
    return "היום";
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return "אתמול";
  } else {
    return inputDate.toLocaleDateString();
  }
}

function updateProjectSelect() {
  const select = document.getElementById("timerProjectSelect");
  select.innerHTML = "";
  let allProjects = [];
  clients.forEach((client) => {
    client.projects.forEach((project) => {
      allProjects.push({
        clientName: client.name,
        project: project,
      });
    });
  });
  allProjects.sort(
    (a, b) => (b.project.lastUsed || 0) - (a.project.lastUsed || 0)
  );
  allProjects.forEach(({ clientName, project }) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = `${clientName} - ${project.name}`;
    select.appendChild(option);
  });
  if (allProjects.length > 0) {
    select.value = allProjects[0].project.id;
  }
}

function replaceFeatherIcons() {
  if (typeof feather !== "undefined") {
    feather.replace({
      "chevrons-right": {
        width: 24,
        height: 24,
      },
    });
  }
}

// פונקציה שמקבלת תאריך ומחזירה מחרוזת בפורמט קריא (היום, אתמול, או תאריך)
function formatDate(date) {
  // מקבלת את התאריך הנוכחי
  const today = new Date();
  // מאפסת את השעות, הדקות, השניות והמילישניות של התאריך הנוכחי
  today.setHours(0, 0, 0, 0);
  // יוצרת אובייקט תאריך חדש שהוא התאריך של אתמול
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  // יוצרת אובייקט תאריך חדש מהתאריך שהתקבל בפונקציה
  const inputDate = new Date(date);
  // מאפסת את השעות, הדקות, השניות והמילישניות של התאריך שהתקבל
  inputDate.setHours(0, 0, 0, 0);
  // בודקת אם התאריך שהתקבל הוא היום
  if (inputDate.getTime() === today.getTime()) {
    // מחזירה את המחרוזת "היום"
    return "היום";
    // בודקת אם התאריך שהתקבל הוא אתמול
  } else if (inputDate.getTime() === yesterday.getTime()) {
    // מחזירה את המחרוזת "אתמול"
    return "אתמול";
    // אם התאריך אינו היום או אתמול
  } else {
    // מחזירה את התאריך בפורמט מקומי
    return inputDate.toLocaleDateString();
  }
}

// פונקציה שמעדכנת את רשימת הפרויקטים בתיבת הבחירה של הטיימר
function updateProjectSelect() {
  // מקבלת את האלמנט של תיבת הבחירה
  const select = document.getElementById("timerProjectSelect");
  // מנקה את התוכן הקיים של תיבת הבחירה
  select.innerHTML = "";
  // יוצרת מערך ריק שיכיל את כל הפרויקטים
  let allProjects = [];
  // עוברת על כל הלקוחות
  clients.forEach((client) => {
    // עוברת על כל הפרויקטים של הלקוח
    client.projects.forEach((project) => {
      // מוסיפה את הפרויקט למערך יחד עם שם הלקוח
      allProjects.push({
        clientName: client.name,
        project: project,
      });
    });
  });
  // ממיינת את הפרויקטים לפי התאריך האחרון שנעשה בהם שימוש (האחרון ראשון)
  allProjects.sort(
    (a, b) => (b.project.lastUsed || 0) - (a.project.lastUsed || 0)
  );
  // עוברת על כל הפרויקטים הממוינים
  allProjects.forEach(({ clientName, project }) => {
    // יוצרת אלמנט option עבור כל פרויקט
    const option = document.createElement("option");
    // מגדירה את הערך של ה-option להיות ה-ID של הפרויקט
    option.value = project.id;
    // מגדירה את הטקסט של ה-option להיות שם הלקוח ושם הפרויקט
    option.textContent = `${clientName} - ${project.name}`;
    // מוסיפה את ה-option לתיבת הבחירה
    select.appendChild(option);
  });
  // אם יש פרויקטים ברשימה, בוחרת את הראשון כברירת מחדל
  if (allProjects.length > 0) {
    select.value = allProjects[0].project.id;
  }
}

// פונקציה שמחליפה את הסמלים (אייקונים) בעזרת ספריית Feather
function replaceFeatherIcons() {
  // בודקת אם ספריית feather קיימת
  if (typeof feather !== "undefined") {
    // מחליפה את האייקונים, ומגדירה גודל מותאם אישית עבור אייקון ה"חצים ימינה"
    feather.replace({
      "chevrons-right": {
        width: 24,
        height: 24,
      },
    });
  }
}

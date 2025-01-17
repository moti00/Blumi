// אירוע שפועל כאשר ה-DOM נטען במלואו
document.addEventListener("DOMContentLoaded", function () {
  // בודקת אם ספריית feather קיימת
  if (typeof feather !== "undefined") {
    // מחליפה את האייקונים באמצעות הפונקציה replaceFeatherIcons
    replaceFeatherIcons();
  }
});

// אירוע שפועל בלחיצה על המסמך
document.addEventListener("click", function (event) {
  // מקבלת את התפריט של הלקוח
  const clientMenu = document.getElementById("clientMenu");
  // מקבלת את התפריט של הפרויקט
  const projectMenu = document.getElementById("projectMenu");
  // אם התפריט של הלקוח קיים והלחיצה לא הייתה על כפתור התפריט
  if (clientMenu && !event.target.closest(".menu-dots")) {
    // מסירה את המחלקה "visible" שגורמת לתפריט להיות גלוי
    clientMenu.classList.remove("visible");
    // לאחר 200 מילישניות מסתירה את התפריט
    setTimeout(() => {
      clientMenu.style.display = "none";
    }, 200);
  }
  // אם התפריט של הפרויקט קיים והלחיצה לא הייתה על כפתור התפריט
  if (projectMenu && !event.target.closest(".menu-dots")) {
    // מסירה את המחלקה "visible" שגורמת לתפריט להיות גלוי
    projectMenu.classList.remove("visible");
    // לאחר 200 מילישניות מסתירה את התפריט
    setTimeout(() => {
      projectMenu.style.display = "none";
    }, 200);
  }
});

// קריאה לפונקציה showMainView כדי להציג את התצוגה הראשית
showMainView();

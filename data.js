// מנסה לקבל את הנתונים של הלקוחות מה-localStorage, ואם אין כאלה יוצר מערך ריק
let clients = JSON.parse(localStorage.getItem("clients")) || [];

// פונקציה ששומרת את הנתונים של הלקוחות ב-localStorage
function saveToLocalStorage() {
  // ממירה את מערך הלקוחות למחרוזת JSON ושומרת אותו ב-localStorage תחת המפתח "clients"
  localStorage.setItem("clients", JSON.stringify(clients));
}

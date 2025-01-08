let currentTimer = null;
let startTime = null;
let isRunning = false;
let seconds = 0;
let buttonState = "start";

const display = document.getElementById("display");
const controlButton = document.getElementById("controlButton");
let buttonContent = controlButton.querySelector(".button-content");
const timeText = document.getElementById("timeText");
const digits = display.querySelectorAll(".digit span");
const hourHand = document.querySelector(".hour");
const minuteHand = document.querySelector(".minute");
const secondHand = document.querySelector(".second");

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function updateDisplay() {
  const time = formatTime(seconds).replace(/:/g, "");
  for (let i = 0; i < 6; i++) {
    const newDigit = time[i];
    const digitElement = digits[i];
    if (digitElement.textContent !== newDigit) {
      const oldDigit = digitElement.textContent;
      digitElement.style.transform = "translateY(-100%)";
      setTimeout(() => {
        digitElement.style.transition = "none";
        digitElement.style.transform = "translateY(100%)";
        digitElement.textContent = newDigit;
        setTimeout(() => {
          digitElement.style.transition = "transform 0.3s ease-in-out";
          digitElement.style.transform = "translateY(0)";
        }, 20);
      }, 150);
    }
  }
}

function updateClock() {
  const secondsDegrees = (seconds % 60) * 6;
  const minutesDegrees = ((seconds / 60) % 60) * 6;
  const hoursDegrees = ((seconds / 3600) % 12) * 30;

  if (seconds % 60 === 0) {
    secondHand.style.transition = "none";
  } else {
    secondHand.style.transition = "";
  }

  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  secondHand.offsetHeight;
}

function resetClock() {
  secondHand.style.transition = "transform 1s ease-in-out";
  minuteHand.style.transition = "transform 1s ease-in-out";
  hourHand.style.transition = "transform 1s ease-in-out";

  secondHand.style.transform = "rotate(0deg)";
  minuteHand.style.transform = "rotate(0deg)";
  hourHand.style.transform = "rotate(0deg)";

  setTimeout(() => {
    secondHand.style.transition = "";
    minuteHand.style.transition = "";
    hourHand.style.transition = "";
  }, 1000);
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startTime = new Date();
    currentTimer = setInterval(() => {
      seconds++;
      updateDisplay();
      updateClock();
    }, 1000);
    animateButton("start");
    const button = document.getElementById("startTimer");
    if (button) {
      button.textContent = "עצור";
      button.style.background = "#dc3545";
    }
  }
}

function stopTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(currentTimer);
    const finalTime = formatTime(seconds);
    // שמור את רישום הזמן כאן (השתמש בפונקציה הקיימת שלך)
    saveTimeEntry(seconds);
    seconds = 0;
    updateDisplay();
    resetClock();
    animateButton("stop", finalTime);
    const button = document.getElementById("startTimer");
    if (button) {
      button.textContent = "התחל";
      button.style.background = "#1a73e8";
    }
  }
}

function animateButton(action, finalTime = "") {
  switch (action) {
    case "start":
      buttonContent.style.top = "-80px";
      buttonState = "stop";
      break;
    case "stop":
      buttonContent.style.top = "-150px";
      document.querySelector("#timeText").textContent = finalTime;
      buttonState = "time";
      setTimeout(() => {
        const newButtonContent = buttonContent.cloneNode(true);
        newButtonContent.style.top = "70px";
        controlButton.appendChild(newButtonContent);

        buttonContent.style.transition =
          "top 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        buttonContent.style.top = "-210px";

        newButtonContent.style.transition =
          "top 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        setTimeout(() => {
          newButtonContent.style.top = "-10px";
        }, 50);

        setTimeout(() => {
          controlButton.removeChild(buttonContent);
          buttonContent = newButtonContent;
          buttonState = "start";
        }, 500);
      }, 1000);
      break;
  }
}

function toggleTimer() {
  if (buttonState === "start") {
    startTimer();
  } else if (buttonState === "stop") {
    stopTimer();
  }
}

resetClock();

// עדכון event listener לכפתור החדש
controlButton.addEventListener("click", toggleTimer);

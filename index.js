const url = "https://learnlangapp1.herokuapp.com/";
let currentLevel, maxLevel, lastLevel;
const initialMaxLevel = 2;
const initialLevel = 1;
const timeAll = 120000;
let timeRemained = 120000;
let timeStart = 0;
let timeCurrent = 0;
const levelContainer = document.querySelector(".level-container");
const buttonStart = document.querySelector(".button-start");
const buttonStop = document.querySelector(".button-stop");
const loadingElement = document.querySelector(".loading");
const clockContainer = document.querySelector(".clock-container");
const clockStrip = document.querySelector(".clock-strip");
const clock = document.querySelector(".clock");
const gamepad = document.querySelector(".gamepad-container");
let wordsArray = [];

class WordGame {
  constructor() {}
  getLevel() {
    if (localStorage.getItem("currentLevel")) {
      currentLevel = +localStorage.getItem("currentLevel");
    } else {
      this.setLevel(initialLevel);
    }
  }
  setLevel(level) {
    currentLevel = level;
    localStorage.setItem("currentLevel", level.toString());
  }
  getMaxLevel() {
    let item = localStorage.getItem("maxLevel");
    if (item !== null && item !== undefined && item !== "0") {
      maxLevel = +localStorage.getItem("maxLevel");
    } else {
      this.setMaxLevel(initialMaxLevel);
    }
  }
  setMaxLevel(level) {
    maxLevel = level;
    localStorage.setItem("maxLevel", level.toString());
  }
  showLevels() {
    let levels = document.querySelectorAll(".level-element");
    for (let el of levels) {
      let elementLevel = this.getElementLevel(el);
      if (elementLevel <= maxLevel) {
        el.textContent = elementLevel.toString();
      }
      if (elementLevel > maxLevel) {
        el.textContent = "lock";
        game.showDisabledLevel(el);
      }
      if (elementLevel === currentLevel) {
        game.showCurrentLevel(el);
      }
      if (elementLevel !== currentLevel && elementLevel <= maxLevel) {
        game.showInactiveLevel(el);
      }
    }
  }
  getElementLevel(el) {
    let elementLevel = Number(el.className.at(-1));
    return elementLevel;
  }

  chooseLevel(level) {
    this.setLevel(level);
    this.showLevels();
  }

  showDisabledLevel(el) {
    el.style.backgroundImage = "radial-gradient(#fff, #eee)";
    el.style.color = "#999";
    el.style.cursor = "auto";
  }
  showCurrentLevel(el) {
    el.style.backgroundImage = "radial-gradient(#0a0, #0f0)";
    el.style.color = "white";
  }
  showInactiveLevel(el) {
    el.style.backgroundImage = "radial-gradient(#eee, #aaa)";
    el.style.color = "#999";
  }
  showGamepad() {
    gamepad.style.visibility = "visible";
    gamepad.style.opacity = "1";
  }
  hideGamePad() {
    gamepad.style.visibility = "hidden";
    gamepad.style.opacity = "0";
  }
  showClock() {
    clockContainer.style.visibility = "visible";
    clockContainer.style.opacity = "1";
  }
  hideClock() {
    clockContainer.style.visibility = "hidden";
    clockContainer.style.opacity = "0";
  }
  showButtonStart() {
    buttonStart.style.visibility = "visible";
  }
  hideButtonStart() {
    buttonStart.style.visibility = "hidden";
  }
  showButtonStop() {
    buttonStop.style.visibility = "visible";
  }
  hideButtonStop() {
    buttonStop.style.visibility = "hidden";
  }
  showLevelsContainer() {
    levelContainer.style.visibility = "visible";
  }
  hideLevelsContainer() {
    levelContainer.style.visibility = "hidden";
  }
  handleButtonStart() {
    buttonStart.addEventListener("click", (e) => {
      e.preventDefault();
      vibrate("ordinary");
      this.startGame();
    });
  }
  handleButtonStop() {
    buttonStop.addEventListener("click", (e) => {
      e.preventDefault();
      vibrate("ordinary");
    this.stopGame()
    });
  }
  startGame() {
    this.hideButtonStart();
    this.hideLevelsContainer();
    if (lastLevel !== currentLevel) {
      wordsArray = [];
    }
    this.loadWords();
  }
  stopGame() {
    lastLevel = currentLevel;
    this.hideClock();
    this.clockStyleReset()
    this.hideGamePad();
    this.hideButtonStop();
    this.showButtonStart();
    this.showLevelsContainer();
  }
  loadWords(page = 0) {
    this.showLoading(true);
    if (lastLevel !== currentLevel) {
      let URL = url + `words/?group=${currentLevel - 1}&page=${page}`;
      fetch(URL)
        .then((response) => response.json())
        .then((arr) => (wordsArray = [...wordsArray, ...arr]))
        .then(() => {
          if (page < 29) {
            page++;
            setTimeout(() => this.loadWords(page));
          } else {
            this.afterLoading();
          }
        })
        .catch(console.log);
    } else {
      this.afterLoading();
    }
  }
  afterLoading() {
    this.showLoading(false);
    this.showButtonStop();
    this.showGamepad();
    this.showClock();
    this.operateClock();

    console.log(wordsArray);
  }
  showLoading(visibility) {
    let v = visibility ? "visible" : "hidden";
    loadingElement.style.visibility = v;
  }
  operateClock() {
    timeStart = Date.now();
    this.operateEverySecond()
    let interval = setInterval(() => {
     this.operateEverySecond()
      if (timeRemained <= 0) {
        clearInterval(interval);
        this.stopGame();
      }
    }, 500);
  }
  operateEverySecond(){
    timeCurrent = Date.now();
    timeRemained = timeAll - (timeCurrent - timeStart);
    clock.textContent = this.convertTime(timeRemained);
    this.clockStyle(timeRemained)
  }
clockStyle(time){
    clockStrip.style.width=`${70/timeAll*time}vw`;
    if(time<=20000){
        clockStrip.style.backgroundImage="linear-gradient(#ff0000, #aa0000)"
    }  
}
clockStyleReset(){
    clockStrip.style.backgroundImage="linear-gradient(#00ff00, #00aa00)";
    clockStrip.style.width=`70vw`
}
  convertTime(time) {
    let min = 0;
    let sec = Math.floor(time / 1000);
    if (sec >= 60) {
      min = Math.floor(sec / 60);
      sec = sec - min * 60;
    }
    if (min < 10) {
      min = "0" + min.toString();
    }
    if (sec < 10) {
      sec = "0" + sec.toString();
    }
    return `${min}:${sec}`;
  }
}
const game = new WordGame();

function levelChooseHandler() {
  levelContainer.addEventListener("click", (e) => {
    let el = e.target;
    if (el.className.includes("level-element")) {
      let level = game.getElementLevel(el);
      if (level <= maxLevel) {
        vibrate("ordinary");
        game.chooseLevel(level);
      }
    }
  });
}

function init() {
  wakeLock();
  game.getLevel();
  game.getMaxLevel();
  game.showLevelsContainer();
  game.showLevels();
  levelChooseHandler();
  game.showButtonStart();
  game.handleButtonStart();
  game.handleButtonStop();
}
function wakeLock() {
  navigator.wakeLock.request("screen").catch(console.log);
}
function vibrate(type) {
  let pattern =
    type === "right" ? [50, 10, 50] : type === "wrong" ? [100, 10, 100] : [50];
  navigator.vibrate(pattern);
}

document.addEventListener("DOMContentLoaded", init);

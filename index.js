const mainUrl = "https://learnlangapp1.herokuapp.com/";
const url = "./assets/json/";
const failedSound = "./assets/mp3/failed.mp3";
const successSound = "./assets/mp3/success.mp3";
let currentLevel, maxLevel, lastLevel;
const initialMaxLevel = 6;
const initialLevel = 1;
const timeAll = 120000;
const maxLife = 5;
const leftWords = {
  left0: undefined,
  left1: undefined,
  left2: undefined,
  left3: undefined,
  left4: undefined,
  left5: undefined,
};
const rightWords = {
  right0: undefined,
  right1: undefined,
  right2: undefined,
  right3: undefined,
  right4: undefined,
  right5: undefined,
};
const wordsQuantity = 6;
let timeRemained = 120000;
let timeStart = 0;
let timeCurrent = 0;
let score = 0;
let currentLife = maxLife;
let wordsIndexes = [];
const levelContainer = document.querySelector(".level-container");
const buttonStart = document.querySelector(".button-start");
const buttonStop = document.querySelector(".button-stop");
const loadingElement = document.querySelector(".loading");
const clockContainer = document.querySelector(".clock-container");
const clockStrip = document.querySelector(".clock-strip");
const clock = document.querySelector(".clock");
const gamepad = document.querySelector(".gamepad-container");
const info = document.querySelector(".info");
const life = document.querySelector(".life");
const heart = document.querySelector(".heart");
let wordsArray = [];
const audio = new Audio();

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
  getLastRecord() {
    let value = localStorage.getItem(`level-${currentLevel}`);
    if (value) {
      return value;
    } else {
      value = 0;
      this.setRecord(value);
    }
  }
  setRecord(score) {
    localStorage.setItem(`level-${currentLevel}`, score);
  }
  showInfo(html) {
    info.style.opacity = "1";
    info.style.transform = "translateY(0%)";
    info.innerHTML = html;
    setTimeout(() => {
      info.style.opacity = "0";
      info.style.transform = "translateY(-200%)";
    }, 4000);
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
      this.stopGame();
    });
  }
  startGame() {
    score = 0;
    currentLife = maxLife;
    this.setLife();
    this.hideButtonStart();
    this.hideLevelsContainer();
    if (lastLevel !== currentLevel) {
      wordsArray = [];
    }
    this.loadWords();
    this.playWords();
  }
  stopGame() {
    lastLevel = currentLevel;
    this.hideClock();
    this.clockStyleReset();
    this.hideGamePad();
    this.hideButtonStop();
    this.showButtonStart();
    this.showLevelsContainer();
    let lastRecord = this.getLastRecord();
    this.showInfo(
      `<p>Вы нашли <span> ${score}</span> слов. Предыдущий рекорд на уровне <span> ${currentLevel} </span> был <span> ${lastRecord} </span> слов.</p>`
    );
    if (score > lastRecord) {
      this.setRecord(score);
    }
  }

  setLife() {
    life.textContent = currentLife;
    heart.style.opacity = `${1 * (currentLife / maxLife)}`;
  }
  loadWords() {
    this.showLoading(true);
    if (lastLevel !== currentLevel) {
      let URL = url + `level-${currentLevel}.json`;
      fetch(URL)
        .then((response) => response.json())
        .then((item) => item.data)
        .then((arr) => {
          wordsArray = [...arr];
          this.afterLoading();
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
    this.setWordsIndexes();
    this.defineLeftWords();
    this.defineRightWords();
    this.firstTimeShowWords();
  }
  showLoading(visibility) {
    let v = visibility ? "visible" : "hidden";
    loadingElement.style.visibility = v;
  }
  operateClock() {
    timeStart = Date.now();
    this.operateEverySecond();
    let interval = setInterval(() => {
      this.operateEverySecond();
      if (timeRemained <= 0) {
        clearInterval(interval);
        this.stopGame();
      }
    }, 500);
  }
  operateEverySecond() {
    timeCurrent = Date.now();
    timeRemained = timeAll - (timeCurrent - timeStart);
    if (timeRemained <= 1000) {
      playAudio(failedSound);
    }
    clock.textContent = this.convertTime(timeRemained);
    this.clockStyle(timeRemained);
  }
  clockStyle(time) {
    clockStrip.style.width = `${(60 / timeAll) * time}vw`;

    clockStrip.style.backgroundImage = `linear-gradient(rgba(${
      (255 / timeAll) * (timeAll - time)
    },${(255 / timeAll) * time},100,1), rgba(${
      (200 / timeAll) * (timeAll - time)
    },${(200 / timeAll) * time},100,1))`;
  }

  clockStyleReset() {
    clockStrip.style.backgroundImage =
      "linear-gradient(rgba(0,255,100,1), rgba(0,200,100,1))";
    clockStrip.style.width = `60vw`;
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
  setWordsIndexes() {
    wordsIndexes = [];
    while (wordsIndexes.length < wordsQuantity) {
      let num = this.getRandomNumber(0, 599);
      if (!wordsIndexes.includes(num)) {
        wordsIndexes.push(num);
      }
    }
    console.log(wordsIndexes);
  }
  defineLeftWords() {
    let arr = [...wordsIndexes];
    for (let i = 0; i < wordsQuantity; i++) {
      let value = this.getRandomBoolean() ? arr.pop() : arr.shift();
      leftWords[`left${i}`] = value;
    }
  }
  defineRightWords() {
    let arr = [...wordsIndexes];
    for (let i = 0; i < wordsQuantity; i++) {
      let value = this.getRandomBoolean() ? arr.pop() : arr.shift();
      rightWords[`right${i}`] = value;
    }
  }
  firstTimeShowWords() {
    for (let i = 0; i < wordsQuantity; i++) {
      let rusEl = document.querySelector(`.left-button-${i}`);
      let enEl = document.querySelector(`.right-button-${i}`);
      enEl.textContent = wordsArray[rightWords[`right${i}`]].word;
      rusEl.textContent = wordsArray[leftWords[`left${i}`]].wordTranslate;
    }
  }

  getRandomNumber(from, to) {
    return from + Math.floor(Math.random() * (to - from));
  }
  getRandomBoolean() {
    return 0.5 - Math.random() > 0;
  }
  playWords() {
    gamepad.addEventListener("click", (e) => {
      let el = e.target;
      let index;
      if (el.className.includes("right-button")) {
        index = el.className.at(-1);
        let endpoint=wordsArray[rightWords[`right${index}`]].audio;
        playAudio(mainUrl+endpoint)
      }
    });
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
    type === "right" ? [50, 10, 50] : type === "wrong" ? [100, 50, 100] : [50];
  navigator.vibrate(pattern);
}
function playAudio(src) {
  audio.pause();
  audio.src = src;
  audio.play().catch(console.log);
}
document.addEventListener("DOMContentLoaded", init);

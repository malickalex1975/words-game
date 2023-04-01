const mainUrl = "https://learnlangapp1.herokuapp.com/";
const url = "./assets/json/";
const failedSound = "./assets/mp3/failed.mp3";
const successSound = "./assets/mp3/success.mp3";
let currentLevel, maxLevel, lastLevel;
let activeLeftButton = undefined;
let activeRightButton = undefined;
let emptyLeftButtons = [];
let emptyRightButtons = [];
let wordsInColumn=6;
const initialMaxLevel = 1;
const initialLevel = 1;
const timeAll = 120000;
const maxLife = 5;
let scoreToNextLevel = 50;
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
let threeWordsIndexes = [];
const mainContainer = document.querySelector(".main-container");
const levelContainer = document.querySelector(".level-container");
const buttonStart = document.querySelector(".button-start");
const buttonStop = document.querySelector(".button-stop");
const wordButtons = document.querySelectorAll(".button");
const loadingElement = document.querySelector(".loading");
const clockContainer = document.querySelector(".clock-container");
const clockStrip = document.querySelector(".clock-strip");
const clock = document.querySelector(".clock");
const gamepad = document.querySelector(".gamepad-container");
const scorePlace = document.querySelector(".score-place");
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
    el.style.backgroundImage = "url(./assets/images/lock.png)";
    el.style.color = "#999";
    el.style.cursor = "auto";
  }
  showCurrentLevel(el) {
    el.style.backgroundImage = "radial-gradient(#0f0, #0a0)";
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

  showScore(value) {
    let visibility = value ? "visible" : "hidden";
    let opacity = value ? "1" : "0";
    scorePlace.style.visibility = visibility;
    scorePlace.style.opacity = opacity;
  }
  showInfo(html) {
    info.style.transform = "translateY(0%)";
    info.innerHTML = html;
    setTimeout(() => {
      info.style.transform = "translateY(-200%)";
    }, 4000);
  }
  hideInfo() {
    info.style.transform = "translateY(-200%)";
  }

  showGamepad() {
    gamepad.style.display = "visible";
    gamepad.style.opacity = "1";
    wordButtons.forEach((wordButton) => {
      wordButton.style.visibility = "visible";
      wordButton.style.opacity = "1";
    });
  }
  hideGamePad() {
    gamepad.style.visibility = "hidden";
    gamepad.style.opacity = "0";
    wordButtons.forEach((wordButton) => {
      wordButton.style.visibility = "hidden";
      wordButton.style.opacity = "0";
    });
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
    levelContainer.style.opacity = "1";
  }
  hideLevelsContainer() {
    levelContainer.style.visibility = "hidden";
    levelContainer.style.opacity = "0";
  }
  handleButtonStart() {
    buttonStart.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      vibrate("ordinary");
      this.startGame();
    });
  }
  handleButtonStop() {
    buttonStop.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      vibrate("ordinary");
      this.stopGame();
    });
  }
  setScore() {
    scorePlace.textContent = score.toString();
    scorePlace.style.transform = "scale(1.2)";
    setTimeout(() => (scorePlace.style.transform = "scale(1)"), 500);
    if (score >= scoreToNextLevel && currentLevel === maxLevel) {
      this.increaseLevel();
    }
  }
  resetBeforeStart() {
    score = 0;
    this.setScore();
    this.showScore(true);
    activeLeftButton = undefined;
    activeRightButton = undefined;
    currentLife = maxLife;
    this.setLife();
    if (lastLevel !== currentLevel) {
      wordsArray = [];
    }
  }

  startGame() {
    this.resetBeforeStart();
    this.hideButtonStart();
    this.hideInfo();
    this.hideLevelsContainer();
    this.loadWords();
    this.playWords();
    this.showActiveButtons();
    this.listenButtons();
  }
  stopGame() {
    gamepad.removeEventListener("pointerdown", this.listenHandler);
    lastLevel = currentLevel;
    this.hideClock();
    this.showScore(false);
    this.clockStyleReset();
    this.hideGamePad();
    this.hideButtonStop();
    this.showButtonStart();
    this.showLevelsContainer();
    let lastRecord = this.getLastRecord();
    let addition = "";
    if (score < scoreToNextLevel && currentLevel === maxLevel) {
      addition = `<p>Для открытия нового уровня наберите <span> ${scoreToNextLevel}.</span></p>`;
    }
    this.showInfo(
      `<p>Вы набрали <span> ${score}</span> . Предыдущий рекорд на уровне <span> ${currentLevel} </span> был <span> ${lastRecord} </span> .</p>` +
        addition
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
  }
  setThreeWordsIndexes() {
    threeWordsIndexes = [];
    while (threeWordsIndexes.length < 3) {
      let num = this.getRandomNumber(0, 599);
      if (!wordsIndexes.includes(num) && !threeWordsIndexes.includes(num)) {
        threeWordsIndexes.push(num);
      }
    }
  }
  defineLeftWords() {
    let arr = [...wordsIndexes];
    for (let i = 0; i < wordsQuantity; i++) {
      let value = this.getRandomBoolean() ? arr.pop() : arr.shift();
      leftWords[`left${i}`] = value;
    }
  }
  defineThreeLeftWords() {
    let arr = [...threeWordsIndexes];
    for (let i of emptyLeftButtons) {
      let value = this.getRandomBoolean() ? arr.pop() : arr.shift();
      leftWords[`left${i}`] = value;
    }
    emptyLeftButtons = [];
  }
  defineRightWords() {
    let arr = [...wordsIndexes];
    for (let i = 0; i < wordsQuantity; i++) {
      let value = this.getRandomBoolean() ? arr.pop() : arr.shift();
      rightWords[`right${i}`] = value;
    }
  }
  defineThreeRightWords() {
    let arr = [...threeWordsIndexes];
    for (let i of emptyRightButtons) {
      let value = this.getRandomBoolean() ? arr.pop() : arr.shift();
      rightWords[`right${i}`] = value;
    }
    emptyRightButtons = [];
  }
  firstTimeShowWords() {
    for (let i = 0; i < wordsQuantity; i++) {
      let rusEl = document.querySelector(`.left-button-${i}`);
      let enEl = document.querySelector(`.right-button-${i}`);
      setTimeout(() => {
        rusEl.style.opacity = 1;
        enEl.style.opacity = 1;
        rusEl.style.visibility = "visible";
        enEl.style.visibility = "visible";
        enEl.textContent = wordsArray[rightWords[`right${i}`]].word;
        rusEl.textContent = wordsArray[leftWords[`left${i}`]].wordTranslate;
      }, 200 * i);
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
        let endpoint = wordsArray?.[rightWords?.[`right${index}`]]?.audio;
        if (endpoint) {
          playAudio(mainUrl + endpoint);
        }
      }
    });
  }

  listenButtons() {
    gamepad.addEventListener("pointerdown", this.listenHandler);
  }
  listenHandler(e) {
    let el = e.target;
    console.log(el);
    let index;
    if (el.className.includes("right-button")) {
      index = Number(el.className.at(-1));
      if (activeRightButton === index) {
        activeRightButton = undefined;
      } else {
        activeRightButton = index;
      }
    } else if (el.className.includes("left-button")) {
      index = Number(el.className.at(-1));
      if (activeLeftButton === index) {
        activeLeftButton = undefined;
      } else {
        activeLeftButton = index;
      }
    }
    game.showActiveButtons();

    if (activeRightButton !== undefined && activeLeftButton !== undefined) {
      game.proccessResult();
    }
  }
  showActiveButtons() {
    for (let i = 0; i < wordsInColumn; i++) {
      let buttonRight = gamepad.querySelector(`.right-button-${i}`);
      let buttonLeft = gamepad.querySelector(`.left-button-${i}`);
      if (i === activeRightButton && buttonRight.textContent !== "") {
        buttonRight.style.backgroundImage = "linear-gradient(#ddf, #cce)";
      } else {
        buttonRight.style.backgroundImage = "linear-gradient(#fff, #eee)";
      }
      if (i === activeLeftButton && buttonLeft.textContent !== "") {
        buttonLeft.style.backgroundImage = "linear-gradient(#ddf, #cce)";
      } else {
        buttonLeft.style.backgroundImage = "linear-gradient(#fff, #eee)";
      }
    }
  }
  proccessResult() {
    let rightIndex = activeRightButton;
    let leftIndex = activeLeftButton;
    let buttonRight = gamepad.querySelector(`.right-button-${rightIndex}`);
    let buttonLeft = gamepad.querySelector(`.left-button-${leftIndex}`);
    if (buttonLeft.textContent !== "" && buttonRight.textContent !== "") {
      if (rightWords[`right${rightIndex}`] === leftWords[`left${leftIndex}`]) {
        vibrate("right");
        buttonLeft.classList.add("green");
        buttonRight.classList.add("green");
        emptyLeftButtons.push(activeLeftButton);
        emptyRightButtons.push(activeRightButton);
        activeLeftButton = undefined;
        activeRightButton = undefined;

        score++;
        this.setScore();
        setTimeout(() => {
          buttonLeft.classList.remove("green");
          buttonRight.classList.remove("green");
          buttonLeft.textContent = "";
          buttonRight.textContent = "";
          buttonLeft.style.opacity = 0;
          buttonRight.style.opacity = 0;
          buttonLeft.style.visibility = "hidden";
          buttonRight.style.visibility = "hidden";
          if (emptyLeftButtons.length === 3) {
            this.addNewWords();
          }
          this.showActiveButtons();
        }, 300);
      } else {
        vibrate("wrong");
        buttonLeft.classList.add("red");
        buttonRight.classList.add("red");
        activeLeftButton = undefined;
        activeRightButton = undefined;
        currentLife--;
        this.setLife();
        if (currentLife === 0) {
          this.stopGame();
        }
        setTimeout(() => {
          buttonLeft.classList.remove("red");
          buttonRight.classList.remove("red");
          this.showActiveButtons();
        }, 300);
      }
    }
  }
  addNewWords() {
    this.setThreeWordsIndexes();
    this.defineThreeLeftWords();
    this.defineThreeRightWords();
    this.firstTimeShowWords();
  }
  increaseLevel() {
    if (maxLevel < 6) {
      this.setMaxLevel(maxLevel + 1);
      this.showLevels();
    }
  }
}
const game = new WordGame();
//mainContainer.addEventListener("click", game.hideInfo);
info.addEventListener("click", game.hideInfo);

function levelChooseHandler() {
  levelContainer.addEventListener("pointerdown", (e) => {
    let el = e.target;
    if (el.className.includes("level-element")) {
      let level = game.getElementLevel(el);
      if (level <= maxLevel) {
        vibrate("ordinary");
        game.hideInfo();
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
  // if(!audio.paused){audio.pause();}
  audio.src = src;
  audio.play().catch(console.log);
}
document.addEventListener("DOMContentLoaded", init);

const mainUrl = "https://learnlangapp1.herokuapp.com/";
const ageByPhotoUrl = "https://malickalex1975.github.io/age-by-photo/";
const url = "./assets/json/";
const failedSound = "./assets/mp3/failed.mp3";
const successSound = "./assets/mp3/success.mp3";
import Speech from "./speech.js";
let mySpeech = new Speech("en");
let stream;
let audioPromise, request, transcriptForPronouncing;
let isMicrophoneAvailable = true;
let wordForPronouncing = "";
let usedWordsForPronouncing = [];
let usedPhrasesForPronouncing = [];
let indexOfWords = 0;
let indexOfPhrases = 0;
let mistakes = [];
let allUsedWords = [];
let isMoving = false;
let isLoading = false;
let currentLevel, maxLevel, lastLevel, interval, timeouts, timeoutForStart;
let downX, downY;
let stripsArray = [];
let rightMovingElement, leftMovingElement;
let activeLeftButton = undefined;
let activeRightButton = undefined;
let emptyLeftButtons = [];
let emptyRightButtons = [];
let wordsInColumn = 6;
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
let isMenu = false;
let visualisationStrips, audioCtx, analizer;
const stripNumber = 32;
let freqArray = new Uint8Array(stripNumber * 2);
const visualisation = document.querySelector(".visualisation");
const rightArrow = document.querySelector(".right-arrow");
const leftArrow = document.querySelector(".left-arrow");
const pronouncingTranscript = document.querySelector(".pronouncing-transcript");
const orientationWarning = document.querySelector(".warning-container");
const mainContainer = document.querySelector(".main-container");
const exampleContainer = document.querySelector(".example-container");
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
const mistakesPad = document.querySelector(".mistakes-pad");
const mistakesContainer = document.querySelector(".mistakes-container");
const pronouncingContainer = document.querySelector(".pronouncing-container");
const pronouncingWord = document.querySelector(".pronouncing-word");
const pronouncingResult = document.querySelector(".pronouncing-result");
const microphone = document.querySelector(".microphone");
const life = document.querySelector(".life");
const heart = document.querySelector(".heart");
const menuButton = document.querySelector(".menu-button");
const menuPanel = document.querySelector(".menu-panel");
const line1 = document.querySelector(".line-1");
const line2 = document.querySelector(".line-2");
const line3 = document.querySelector(".line-3");
const menuItem1 = document.querySelector(".menu-item-1");
const menuItem2 = document.querySelector(".menu-item-2");
const menuItem3 = document.querySelector(".menu-item-3");
const option1 = document.querySelector(".option-1");
const option2 = document.querySelector(".option-2");
const toggle = document.querySelector(".toggle");
const toggleContainer = document.querySelector(".toggle-container");
const toggleElement = document.querySelector(".toggle-element");
const digit1 = document.querySelector(".digit-1");
const digit2 = document.querySelector(".digit-2");
let isPhrasePronouncing = false;
let wordsArray = [];
const audio = new Audio();
const vibrate = {
  right: function () {
    navigator.vibrate([50, 10, 50]);
  },
  wrong: function () {
    navigator.vibrate([100, 50, 100, 50, 100]);
  },
  ordinary: function () {
    navigator.vibrate(50);
  },
  timeIsOver: function () {
    navigator.vibrate([100, 20, 100]);
  },
};
let menu = {
  matching: true,
  pronouncing: false,
};
class WordGame {
  constructor() {}
  processMenu() {
    this.setMenuStyle();
    this.hideMenu();
    if (menu.matching) {
      initMatching();
    } else {
      if (menu.pronouncing) {
        initPronouncing();
      }
    }
  }
  setMenuStyle() {
    if (menu.matching) {
      menuItem1.style.color = "#009900";
      menuItem2.style.color = "#000066";
    } else {
      if (menu.pronouncing) {
        menuItem2.style.color = "#009900";
        menuItem1.style.color = "#000066";
      }
    }
  }
  getLevel() {
    if (localStorage.getItem("currentLevel")) {
      currentLevel = +localStorage.getItem("currentLevel");
    } else {
      this.setLevel(initialLevel);
    }
  }
  async setLevel(level) {
    if (!isLoading) {
      currentLevel = level;
      localStorage.setItem("currentLevel", level.toString());
      let arr = await game.loadData();
      wordsArray = [...arr];
      if (menu.matching) {
        game.hideExamples();
        game.showExamples();
      }
      if (menu.pronouncing) {
        if (lastLevel !== level) {
          usedWordsForPronouncing = [];
        }
        this.defineWordForPronouncing();
      }
    }
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
        game.showInactiveLevel(el, elementLevel);
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
    el.style.opacity = 0.3;
  }
  showCurrentLevel(el) {
    el.style.backgroundImage = "radial-gradient(#0f0, #0a0)";
    el.style.color = "white";
    el.style.opacity = 1;
    el.style.animation = "";
  }
  showInactiveLevel(el, elementLevel) {
    el.style.backgroundImage = "radial-gradient(#eee, #aaa)";
    el.style.color = "#999";
    el.style.opacity = 1;
    if (elementLevel === maxLevel) {
      el.style.animation = "button-flow infinite";
      el.style.animationDuration = "2.2s";
      el.style.animationDelay = ".5s";
    } else {
      el.style.animation = "";
    }
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
    this.showLoading(false);
    info.style.transform = "translateY(0%)";
    info.innerHTML = html;
    setTimeout(() => {
      this.hideInfo();
    }, 4000);
  }
  hideInfo() {
    info.style.transform = "translateY(-200%)";
  }
  showMistakesPad() {
    mistakesPad.style.transform = "translateY(0%)";
  }
  hideMistakesPad() {
    mistakesPad.style.transform = "translateY(200%)";
  }
  showMenu() {
    menuPanel.style.transform = "translateX(0px)";
    line2.style.opacity = 0;
    line1.style.transform = "rotate(45deg) translate(0px,13.5px)";
    line3.style.transform = "rotate(-45deg) translate(0px,-13.5px)";
  }
  hideMenu() {
    menuPanel.style.transform = "translateX(300px)";
    isMenu = false;
    line2.style.opacity = 1;
    line1.style.transform = "rotate(0deg)";
    line3.style.transform = "rotate(0deg)";
  }

  showGamepad() {
    gamepad.style.visibility = "visible";
    gamepad.style.opacity = "1";
  }
  hideGamePad() {
    gamepad.style.visibility = "hidden";
    gamepad.style.opacity = "0";
    wordButtons.forEach((wordButton) => {
      wordButton.style.visibility = "hidden";
      wordButton.style.opacity = "0";
    });
  }
  showPronouncing() {
    pronouncingContainer.style.visibility = "visible";
    pronouncingContainer.style.opacity = "1";
  }
  hidePronouncing() {
    pronouncingContainer.style.visibility = "hidden";
    pronouncingContainer.style.opacity = "0";
  }
  showLeftArrow() {
    leftArrow.style.visibility = "visible";
    leftArrow.style.opacity = ".7";
  }
  showRightArrow() {
    rightArrow.style.visibility = "visible";
    rightArrow.style.opacity = ".7";
  }
  hideLeftArrow() {
    leftArrow.style.visibility = "hidden";
    leftArrow.style.opacity = "0";
  }
  hideRightArrow() {
    rightArrow.style.visibility = "hidden";
    rightArrow.style.opacity = "0";
  }

  showClock() {
    clockContainer.style.visibility = "visible";
    clockContainer.style.opacity = "1";
  }
  hideClock() {
    clockContainer.style.visibility = "hidden";
    clockContainer.style.opacity = "0";
  }
  setToggleStyle() {
    if (isPhrasePronouncing) {
      option2.style.color = "#00aa00";
      option1.style.color = "#000066";
      toggleElement.style.transform = "translateX(15px)";
    } else {
      option1.style.color = "#00aa00";
      option2.style.color = "#000066";
      toggleElement.style.transform = "translateX(0px)";
    }
  }
  showExamples() {
    exampleContainer.style.visibility = "visible";
    exampleContainer.style.opacity = "1";
    let containerBottom = exampleContainer.getBoundingClientRect().bottom;
    timeouts = [];
    for (let i = 0; i < 600; i++) {
      let timeout = setTimeout(() => {
        let p = document.createElement("span");
        p.textContent = `${wordsArray[i].word} - ${wordsArray[i].wordTranslate}, `;
        let r = this.getRandomNumber(0, 220);
        let g = this.getRandomNumber(0, 220);
        let b = this.getRandomNumber(0, 220);
        p.style.color = `rgba(${r},${g},${b},1)`;
        let size = this.getRandomNumber(20, 32);
        p.style.fontSize = size + "px";
        p.className = `example-${i}`;
        exampleContainer.appendChild(p);
        let childBottom = p.getBoundingClientRect().bottom;
        if (childBottom - containerBottom > 200) {
          exampleContainer.scrollTo(0, exampleContainer.scrollHeight);
        }
      }, 300 * i);
      timeouts.push(timeout);
    }
  }
  hideExamples() {
    if (timeouts) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    }
    exampleContainer.style.visibility = "hidden";
    exampleContainer.style.opacity = "0";
    exampleContainer.innerHTML = "";
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
      vibrate.ordinary();
      this.startGame();
    });
  }
  handleButtonStop() {
    buttonStop.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      vibrate.ordinary();
      this.stopGame();
    });
  }
  setMicrophoneActive(value) {
    let opacity = value ? 0.7 : 0.1;
    let cursor = value ? "pointer" : "auto";
    microphone.style.opacity = opacity;
    microphone.style.cursor = cursor;
    toggleContainer.style.opacity = opacity;
    isMicrophoneAvailable = value;
  }
  setScore() {
    const digitElement1 = document.querySelectorAll(".digit-element-1")[0];
    const digitElement2 = document.querySelectorAll(".digit-element-2")[0];
    let dig2 = Math.floor(score / 10);
    let dig1 = score % 10;
    if (digitElement1.textContent !== dig1.toString()) {
      let el = document.createElement("div");
      el.textContent = dig1;
      el.className = "digit-element-1";
      digit1.appendChild(el);
      digit1.style.transition = "1s";
      digit1.style.transform = "translateY(-40px)";
      setTimeout(() => {
        let elToRemove = document.querySelectorAll(".digit-element-1")[0];
        elToRemove.remove();
        digit1.style.transition = "0ms";
        digit1.style.transform = "translateY(0px)";
      }, 1000);
    }
    if (digitElement2.textContent !== dig2.toString()) {
      let el = document.createElement("div");
      el.textContent = dig2;
      el.className = "digit-element-2";
      digit2.appendChild(el);
      digit2.style.transition = "1s";
      digit2.style.transform = "translateY(-40px)";
      setTimeout(() => {
        let elToRemove = document.querySelectorAll(".digit-element-2")[0];
        elToRemove.remove();
        digit2.style.transition = "0ms";
        digit2.style.transform = "translateY(0px)";
      }, 1000);
    }

    if (score >= scoreToNextLevel && currentLevel === maxLevel) {
      this.increaseLevel();
    }
  }
  resetBeforeStart() {
    clearTimeout(timeoutForStart);
    mistakes = [];
    allUsedWords = [];
    score = 0;
    this.setScore();
    this.showScore(true);
    activeLeftButton = undefined;
    activeRightButton = undefined;
    emptyLeftButtons = [];
    emptyRightButtons = [];
    currentLife = maxLife;
    this.setLife();
    if (lastLevel !== currentLevel) {
      wordsArray = [];
    }
    document.querySelectorAll(".mistake-card").forEach((el) => el.remove());
    document.body.style.touchAction = "none";
  }

  startGame() {
    this.resetBeforeStart();
    this.hideButtonStart();
    this.hideInfo();
    this.hideExamples();
    this.hideMistakesPad();
    this.hideLevelsContainer();
    this.loadWords();
    this.playWords();
    this.showActiveButtons();
    this.listenButtons();
  }
  stopGame() {
    this.stopClock();
    gamepad.removeEventListener("pointerdown", this.playHandler);
    gamepad.removeEventListener("pointerdown", this.listenHandler);
    document.querySelectorAll(".button").forEach((el) => {
      el.removeEventListener("pointermove", game.moveHandlerRight);
      el.removeEventListener("pointermove", game.moveHandlerLeft);
      this.moveToInitPosition(el);
      el.style.zIndex = 1;
    });
    lastLevel = currentLevel;
    this.hideClock();
    this.showScore(false);
    this.clockStyleReset();
    this.hideGamePad();
    this.hideButtonStop();
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
    if (mistakes.length > 0) {
      setTimeout(() => {
        this.processMistakes();
      }, 4000);
      setTimeout(() => {
        this.showButtonStart();
      }, 5000);
    } else {
      this.showButtonStart();
      timeoutForStart = setTimeout(() => {
        this.hideExamples();
        this.showExamples();
      }, 5000);
    }
  }
  processMistakes() {
    for (let item of mistakes) {
      let card = document.createElement("div");
      card.className = "mistake-card";
      let img = document.createElement("div");
      img.style.backgroundImage = `url(${mainUrl + wordsArray[item]?.image})`;
      img.className = "mistake-image";
      card.appendChild(img);
      let speaker = document.createElement("div");
      speaker.className = "speaker";
      speaker.addEventListener("pointerdown", () => {
        let endpoint = wordsArray?.[item]?.audio;
        if (endpoint) {
          playAudio(mainUrl + endpoint);
        }
      });
      card.appendChild(speaker);
      let transcript = document.createElement("p");
      transcript.textContent = `${wordsArray[item]?.transcription}`;
      transcript.classList.add(["transcript"]);
      card.appendChild(transcript);
      let p = document.createElement("p");
      p.textContent = `${wordsArray[item]?.word} - ${wordsArray[item]?.wordTranslate}`;
      card.appendChild(p);
      mistakesContainer.appendChild(card);
    }
    this.showMistakesPad();
    document.body.style.touchAction = "auto";
  }

  setLife() {
    life.textContent = currentLife;
    heart.style.opacity = `${1 * (currentLife / maxLife)}`;
  }
  async loadData() {
    let URL = url + `level-${currentLevel}.json`;
    const response = await fetch(URL);
    const item = await response.json();
    return item.data;
  }
  loadWords() {
    this.showLoading(true);
    if (lastLevel !== currentLevel) {
      this.loadData()
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
    setTimeout(() => this.showLoading(false), 1000);
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
    isLoading = visibility;
    let v = visibility ? "visible" : "hidden";
    loadingElement.style.visibility = v;
  }
  operateClock() {
    timeStart = Date.now();
    this.operateEverySecond();
    interval = setInterval(() => {
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

    if (timeRemained < 15000) {
      vibrate.timeIsOver();
    }
    if (timeRemained <= 1000) {
      playAudio(failedSound);
    }
    clock.textContent = this.convertTime(timeRemained);
    this.clockStyle(timeRemained);
  }
  clockStyle(time) {
    clockStrip.style.width = `${(50 / timeAll) * time}vw`;

    clockStrip.style.backgroundImage = `linear-gradient(rgba(${
      (255 / timeAll) * (timeAll - time / 6)
    },${(255 / timeAll) * time * 2},0,1), rgba(${
      (200 / timeAll) * (timeAll - time / 6)
    },${(200 / timeAll) * time * 2},0,1))`;
  }

  clockStyleReset() {
    setTimeout(() => {
      clockStrip.style.backgroundImage =
        "linear-gradient(rgba(0,255,0,1), rgba(0,200,0,1))";
      clockStrip.style.width = `50vw`;
    }, 200);
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
  stopClock() {
    clearInterval(interval);
  }
  setWordsIndexes() {
    wordsIndexes = [];
    while (wordsIndexes.length < wordsQuantity) {
      let num = this.getRandomNumber(0, 599);
      if (!wordsIndexes.includes(num)) {
        wordsIndexes.push(num);
      }
    }
    allUsedWords = [...wordsIndexes];
  }
  setThreeWordsIndexes() {
    threeWordsIndexes = [];
    while (threeWordsIndexes.length < 3) {
      let num = this.getRandomNumber(0, 599);
      if (
        !wordsIndexes.includes(num) &&
        !threeWordsIndexes.includes(num) &&
        !allUsedWords.includes(num)
      ) {
        threeWordsIndexes.push(num);
        allUsedWords.push(num);
      }
    }
    wordsIndexes = [...wordsIndexes, ...threeWordsIndexes];
    if (allUsedWords.length >= 600) {
      allUsedWords = [];
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
    this.showLoading(true);
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
        if (i === wordsQuantity - 1) {
          this.showLoading(false);
        }
      }, i * 200);
    }
  }

  getRandomNumber(from, to) {
    return from + Math.floor(Math.random() * (to - from));
  }
  getRandomBoolean() {
    return 0.5 - Math.random() > 0;
  }
  playWords() {
    gamepad.addEventListener("pointerdown", this.playHandler);
  }
  playHandler(e) {
    let el = e.target;
    let index;
    if (el.className.includes("right-button")) {
      index = el.className.at(-1);
      let endpoint = wordsArray?.[rightWords?.[`right${index}`]]?.audio;
      if (endpoint) {
        playAudio(mainUrl + endpoint);
      }
    }
  }
  listenButtons() {
    gamepad.addEventListener("pointerdown", this.listenHandler);
  }
  listenHandler(e) {
    let el = e.target;
    let index;
    if (
      !el?.className.includes("right-button") &&
      !el?.className.includes("left-button")
    ) {
      activeRightButton = undefined;
      activeLeftButton = undefined;
      game.showActiveButtons();
      return;
    }
    if (el?.className.includes("right-button")) {
      index = Number(el.className.at(-1));
      if (activeRightButton === index) {
        activeRightButton = undefined;
        el.removeEventListener("pointermove", game.moveHandlerRight);
        game.moveToInitPosition(el);
      } else {
        activeRightButton = index;
        downX = e.clientX;
        downY = e.clientY;
        el.addEventListener("pointermove", game.moveHandlerRight);

        el.addEventListener(
          "pointerup",
          (e) => {
            el.style.zIndex = "2";
            el.removeEventListener("pointermove", game.moveHandlerRight);
            if (game.getCrossElement(el, "left") !== null) {
              game.proccessResult();
            } else {
              game.moveToInitPosition(el);
              activeLeftButton = undefined;
              game.showActiveButtons();
            }
          },
          { once: true }
        );
      }
    } else if (el.className.includes("left-button")) {
      index = Number(el.className.at(-1));
      if (activeLeftButton === index) {
        activeLeftButton = undefined;
        el.removeEventListener("pointermove", game.moveHandlerLeft);
        game.moveToInitPosition(el);
      } else {
        activeLeftButton = index;
        downX = e.clientX;
        downY = e.clientY;
        el.addEventListener("pointermove", game.moveHandlerLeft);

        el.addEventListener(
          "pointerup",
          (e) => {
            el.style.zIndex = "2";
            el.removeEventListener("pointermove", game.moveHandlerLeft);
            if (game.getCrossElement(el, "right") !== null) {
              game.proccessResult();
            } else {
              game.moveToInitPosition(el);
              activeRightButton = undefined;
              game.showActiveButtons();
            }
          },
          { once: true }
        );
      }
    }
    game.showActiveButtons();

    if (activeRightButton !== undefined && activeLeftButton !== undefined) {
      game.proccessResult();
    }
  }

  moveHandlerRight(e) {
    isMoving = true;
    let el = e.target;
    if (el?.className.includes("right-button")) {
      rightMovingElement = el;
      leftMovingElement = undefined;
      let x = e.clientX;
      let y = e.clientY;
      el.style.zIndex = "10";
      el.style.transform = `translate(${x - downX}px,${y - downY}px)`;
      let crossLeftElement = game.getCrossElement(el, "left");
      if (crossLeftElement !== null) {
        let index = Number(crossLeftElement.className.at(-1));
        activeLeftButton = index;
        el.style.zIndex = 10;
      }
      game.showActiveButtons();
    }
  }
  moveHandlerLeft(e) {
    let el = e.target;

    if (el?.className.includes("left-button")) {
      leftMovingElement = el;
      rightMovingElement = undefined;
    }
    let x = e.clientX;
    let y = e.clientY;
    el.style.zIndex = "10";
    el.style.transform = `translate(${x - downX}px,${y - downY}px)`;
    let crossRightElement = game.getCrossElement(el, "right");
    if (crossRightElement !== null) {
      let index = Number(crossRightElement.className.at(-1));
      el.style.zIndex = 10;
      activeRightButton = index;
    }
    game.showActiveButtons();
  }

  moveToInitPosition(el) {
    el.style.transform = `translate(0px,0px)`;
  }
  getCrossElement(el, side) {
    let name = side === "left" ? "left-button" : "right-button";
    let crossElements = [];
    let left = el.getBoundingClientRect().left;
    let top = el.getBoundingClientRect().top;
    let right = el.getBoundingClientRect().right;
    let bottom = el.getBoundingClientRect().bottom;
    let vertexes = [
      [left, top],
      [left, bottom],
      [right, top],
      [right, bottom],
    ];
    crossElements = vertexes
      .map((i) => document.elementFromPoint(i[0], i[1]))
      .filter((el) => el?.className.includes(name));
    if (crossElements.length === 1) {
      return crossElements[0];
    }
    if (side === "left") {
      activeLeftButton = undefined;
    } else if (side === "right") {
      activeRightButton = undefined;
    }
    return null;
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
    let wordIndex;
    if (buttonLeft.textContent !== "" && buttonRight.textContent !== "") {
      wordIndex = rightWords[`right${rightIndex}`];
      if (rightWords[`right${rightIndex}`] === leftWords[`left${leftIndex}`]) {
        vibrate.right();
        wordsIndexes = [...wordsIndexes.filter((i) => i !== wordIndex)];
        buttonLeft.classList.add("green");
        buttonRight.classList.add("green");
        emptyLeftButtons.push(activeLeftButton);
        emptyRightButtons.push(activeRightButton);
        score++;
        this.setScore();
        if (leftMovingElement) {
          let endpoint = wordsArray?.[rightWords[`right${rightIndex}`]]?.audio;
          if (endpoint) {
            playAudio(mainUrl + endpoint);
          }
        }
        setTimeout(() => {
          buttonLeft.classList.remove("green");
          buttonRight.classList.remove("green");
          buttonLeft.textContent = "";
          buttonRight.textContent = "";
          buttonLeft.style.opacity = 0;
          buttonRight.style.opacity = 0;
          buttonLeft.style.visibility = "hidden";
          buttonRight.style.visibility = "hidden";
          activeLeftButton = undefined;
          activeRightButton = undefined;
          if (rightMovingElement) {
            this.moveToInitPosition(rightMovingElement);
          }
          if (leftMovingElement) {
            this.moveToInitPosition(leftMovingElement);
          }
          if (emptyLeftButtons.length === 3) {
            this.addNewWords();
          }
          this.showActiveButtons();
        }, 100);
      } else {
        vibrate.wrong();
        let mistake1 = rightWords[`right${rightIndex}`];
        let mistake2 = leftWords[`left${leftIndex}`];
        [mistake1, mistake2].forEach((item) => {
          if (!mistakes.includes(item)) {
            mistakes.push(item);
          }
        });
        buttonLeft.classList.add("red");
        buttonRight.classList.add("red");
        currentLife--;
        this.setLife();
        if (currentLife === 0) {
          this.stopGame();
        }
        setTimeout(() => {
          activeLeftButton = undefined;
          activeRightButton = undefined;
          buttonLeft.classList.remove("red");
          buttonRight.classList.remove("red");
          if (rightMovingElement) {
            this.moveToInitPosition(rightMovingElement);
          }
          if (leftMovingElement) {
            this.moveToInitPosition(leftMovingElement);
          }
          this.showActiveButtons();
        }, 100);
      }
    }
    setTimeout(() => {
      document.querySelectorAll(".button").forEach((el) => {
        el.style.zIndex = 1;
      });
    }, 300);
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
  getWordForPronouncing(value, ignore) {
    let index = !!value ? value : this.getRandomNumber(0, 599);
    let word;
    if (!usedWordsForPronouncing.includes(index) || ignore) {
      if (!isPhrasePronouncing) {
        if (!ignore) {
          usedWordsForPronouncing.push(index);
        }
        word = wordsArray[index].word;

        transcriptForPronouncing = wordsArray[index].transcription;
      } else {
        if (!ignore) {
          usedPhrasesForPronouncing.push(index);
        }
        word = wordsArray[index].textExample;
        // .replace("<b>", "")
        // .replace("</b>", "");
        transcriptForPronouncing = "";
      }
      return { word, index };
    } else return this.getWordForPronouncing();
  }
  defineWordForPronouncing(ind = undefined) {
    console.log("word index:", indexOfWords);
    console.log("phrase index:", indexOfPhrases);

    let ignore = !!ind ? true : false;
    let item = this.getWordForPronouncing(ind, ignore);
    wordForPronouncing = item.word;
    let index = item.index;
    this.writeWord(wordForPronouncing, index);
  }
  writeWord(word, index) {
    let symbolNumber = word.length;
    let timeInterval = 500 / symbolNumber;
    let n = 0;
    let interval;

    interval = setInterval(() => {
      n++;
      pronouncingWord.innerHTML = `<p>${
        word.slice(0, n) + " ".repeat(symbolNumber - n)
      }</p><span class='transcript'></span><div class="speaker-next" style="opacity:0"></div>`;
      if (n >= symbolNumber) {
        clearInterval(interval);
        pronouncingWord.innerHTML = `<p>${word}</p><span class='transcript'>${transcriptForPronouncing}</span><div class="speaker-next" style="opacity:1"></div>`;
        this.speakerHandler(index);
      }
    }, timeInterval);
  }
  speakerHandler(index) {
    let speakerNext = document.querySelector(".speaker-next");
    speakerNext.removeEventListener("pointerdown", () =>
      game.speakerListener(index)
    );
    speakerNext.addEventListener("pointerdown", () =>
      game.speakerListener(index)
    );
  }
  speakerListener(index) {
    let endpoint = isPhrasePronouncing
      ? wordsArray?.[index]?.audioExample
      : wordsArray?.[index]?.audio;
    if (endpoint) {
      playAudio(mainUrl + endpoint);
    }
  }

  microphoneHandler() {
    if (!isMicrophoneAvailable) {
      return;
    } else {
      game.setMicrophoneActive(false);
      game.showLoading(true);
      mySpeech
        .speechRecognition()
        .then((result) => {
          alert(result.phrase, result.confidence)
          console.log(result.phrase, result.confidence);
          game.processPronouncingResult(result);
        })
        .catch((error) => {
          if (menu.pronouncing) {
            game.showInfo(`<p>Error happened: \r\n<span>${error}</span><p>`);
          }
        })
        .finally(() => {
          game.setMicrophoneActive(true);
          game.showLoading(false);
        });
    }
  }
  processPronouncingResult(result) {
    if (true) {
      if (
        wordForPronouncing === result.phrase.toLowerCase() &&
        result.confidence >= 0.7
      ) {
        pronouncingWord.style.color = "green";
        pronouncingResult.textContent = `${(result.confidence * 100).toFixed(
          1
        )}%`;
      }
      setTimeout(() => {
        pronouncingWord.style.transform = "translate(-100vw)";
        pronouncingWord.style.color = "";
      }, 500);

      setTimeout(() => this.defineWordForPronouncing(), 500);
      setTimeout(
        () => (pronouncingWord.style.transform = "translate(0vw)"),
        800
      );
    }
  }
  createVisualisation() {
    for (let i = 0; i < stripNumber; i++) {
      let strip = document.createElement("div");
      strip.className = "strip";
      visualisation.appendChild(strip);
    }
    stripsArray = document.querySelectorAll(".strip");
  }

  resetVisualisation() {
    document.querySelectorAll(".strip").forEach((el) => el.remove());
  }

  listenMicrophone() {
    if (audioCtx) {
      return;
    }
    let src;
    audioCtx = new AudioContext();
    analizer = audioCtx.createAnalyser();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((strm) => {
        stream = strm;
        src = audioCtx.createMediaStreamSource(stream);
        src.connect(analizer);
        game.loop();
      })
      .catch((err) => {
        alert(err + "\r\n The page will be reloaded!");
        location.reload();
      });
  }
  loop() {
    if (menu.pronouncing) {
      request = window.requestAnimationFrame(game.loop);
      if (!isMicrophoneAvailable) {
        analizer.getByteFrequencyData(freqArray);
        for (let i = 0; i < stripNumber; i++) {
          let height = freqArray[stripNumber + i];
          if (height < 5) {
            height = 5;
          }
          let el = stripsArray[i];
          el.style.height = (100 / 256) * height + "px";
          el.style.opacity = 0.01 * height;
        }
      } else {
        document.querySelectorAll(".strip").forEach((el) => {
          el.style.height = 10 + "px";
          el.style.opacity = 0.1;
        });
      }
    }
  }
  rightArrowHandler() {
    if (isMicrophoneAvailable) {
      pronouncingWord.style.animationName = "go-forward";
      setTimeout(() => {
        if (isPhrasePronouncing) {
          if (indexOfPhrases === undefined) {
            indexOfPhrases = 0;
          } else {
            indexOfPhrases += 1;
            game.showLeftArrow();
          }

          if (indexOfPhrases <= usedPhrasesForPronouncing.length - 1) {
            game.defineWordForPronouncing(
              usedWordsForPronouncing[indexOfPhrases]
            );
          } else {
            game.defineWordForPronouncing();
          }
        } else if (!isPhrasePronouncing) {
          if (indexOfWords === undefined) {
            indexOfWords = 0;
          } else {
            indexOfWords += 1;
            game.showLeftArrow();
          }
          if (indexOfWords <= usedWordsForPronouncing.length - 1) {
            game.defineWordForPronouncing(
              usedWordsForPronouncing[indexOfWords]
            );
          } else {
            game.defineWordForPronouncing();
          }
        }

        game.defineWordForPronouncing();
      }, 100);
      setTimeout(() => (pronouncingWord.style.animationName = ""), 600);
    }
  }
  leftArrowHandler() {
    if (isMicrophoneAvailable) {
      pronouncingWord.style.animationName = "go-back";
      setTimeout(() => {
        if (isPhrasePronouncing) {
          if (indexOfPhrases <= 1) {
            indexOfPhrases = 0;
            game.hideLeftArrow();
          } else {
            indexOfPhrases -= 1;
          }
          game.defineWordForPronouncing(
            usedPhrasesForPronouncing[indexOfPhrases]
          );
        } else if (!isPhrasePronouncing) {
          if (indexOfWords <= 1) {
            indexOfWords = 0;
            game.hideLeftArrow();
          } else {
            indexOfWords -= 1;
          }
          game.defineWordForPronouncing(usedWordsForPronouncing[indexOfWords]);
        }
      }, 100);
      setTimeout(() => (pronouncingWord.style.animationName = ""), 600);
    }
  }

  cancelMediaStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
}
const game = new WordGame();
info.addEventListener("click", () => {
  game.hideInfo();
  if (mistakes.length > 0) {
    game.processMistakes();
  }
});

function levelChooseHandler() {
  levelContainer.addEventListener("pointerdown", (e) => {
    let el = e.target;
    if (el.className.includes("level-element")) {
      let level = game.getElementLevel(el);
      if (level <= maxLevel) {
        vibrate.ordinary();
        game.hideInfo();
        game.hideMistakesPad();
        game.chooseLevel(level);
      }
    }
  });
}
function init() {
  wakeLock();
  menuButton.addEventListener("pointerdown", handleMenu);
  toggle.addEventListener("pointerdown", handleToggle);
  menuPanel.addEventListener("pointerdown", () => game.hideMenu());
  mainContainer.addEventListener("pointerdown", () => game.hideMenu());
  menuItem1.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    if (!menu.matching) {
      menu.matching = true;
      menu.pronouncing = false;
      game.processMenu();
    } else {
      game.hideMenu();
    }
  });
  menuItem2.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    if (!menu.pronouncing) {
      menu.matching = false;
      menu.pronouncing = true;
      game.processMenu();
    } else {
      game.hideMenu();
    }
  });
  menuItem3.addEventListener("pointerdown", (e) => {
    window.location.assign(ageByPhotoUrl);
  });
  game.getLevel();
  game.getMaxLevel();
  game.showLevelsContainer();
  game.showLevels();
  levelChooseHandler();
  window.addEventListener("orientationchange", checkOrientation);
  game.handleButtonStart();
  game.handleButtonStop();
  game.processMenu();
}

async function initMatching() {
  if (request) {
    cancelAnimationFrame(request);
  }
  mySpeech.stopRecognition()
  game.showLoading(false);
  game.cancelMediaStream();
  game.resetVisualisation();
  game.showButtonStart();
  let arr = await game.loadData();
  wordsArray = [...arr];
  game.hideExamples();
  game.showExamples();
  game.hidePronouncing();
  exampleContainer.addEventListener("pointerdown", listenExamples);
  microphone.removeEventListener("pointerdown", game.microphoneHandler);
  rightArrow.removeEventListener("pointerdown", game.rightArrowHandler);
  leftArrow.removeEventListener("pointerdown", game.leftArrowHandler);
}
function initPronouncing() {
  mySpeech.stopRecognition()
  audioCtx = undefined;
  mistakes = [];
  game.showLoading(false);
  game.hideClock();
  game.stopClock();
  game.hideExamples();
  game.hideMistakesPad();
  game.hideButtonStart();
  game.hideButtonStop();
  game.hideGamePad();
  game.showScore(false);
  game.showPronouncing();
  game.showLevelsContainer();
  game.setToggleStyle();
  exampleContainer.removeEventListener("pointerdown", listenExamples);
  microphone.addEventListener("pointerdown", game.microphoneHandler);
  rightArrow.addEventListener("pointerdown", game.rightArrowHandler);
  leftArrow.addEventListener("pointerdown", game.leftArrowHandler);
  usedWordsForPronouncing = [];
  usedPhrasesForPronouncing = [];
  indexOfWords = 0;
  indexOfPhrases = 0;
  game.leftArrowHandler();
  game.setMicrophoneActive(true);
  game.createVisualisation();
  //game.listenMicrophone();
}
function wakeLock() {
  navigator.wakeLock.request("screen").catch(console.log);
}

function playAudio(src) {
  if (audioPromise !== undefined) {
    audio.pause();
  }
  audio.src = src;
  audioPromise = audio.play().catch(console.log);
}
function checkOrientation() {
  let orientation = screen.orientation.type;
  if (orientation.includes("portrait")) {
    orientationWarning.style.visibility = "hidden";
  }
  if (orientation.includes("landscape")) {
    orientationWarning.style.visibility = "visible";
  }
}

function listenExamples(e) {
  let el = e.target;
  let index;
  if (el.className.includes("example")) {
    index = +el.className.slice(8);
    el.style.color = "red";
    el.style.transition = "300ms";
    setTimeout(() => {
      el.style.animation = "disappear";
      el.style.animationDuration = "1s";
    }, 100);

    let endpoint = wordsArray?.[index]?.audio;
    if (endpoint) {
      playAudio(mainUrl + endpoint);
    }
  }
}
function handleMenu() {
  isMenu = !isMenu;
  if (isMenu) {
    game.showMenu();
  } else {
    game.hideMenu();
  }
}
function handleToggle() {
  if (isMicrophoneAvailable) {
    isPhrasePronouncing = !isPhrasePronouncing;
    game.setToggleStyle();
    game.leftArrowHandler();
  }
}

document.addEventListener("DOMContentLoaded", init);

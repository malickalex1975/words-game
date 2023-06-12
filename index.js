const mainUrl = "https://learnlangapp1.herokuapp.com/";
const AIUrl = "https://stablediffusionapi.com/api/v3/text2img";
const APIKey = "xRkNj473iRYE0qsHCvFbwfl35sUb7oxpnoMobo4KgJzMIPpHHEHXqFFDtxE2";
const ageByPhotoUrl = "https://malickalex1975.github.io/age-by-photo/";
const url = "./assets/json/";
const failedSound = "./assets/mp3/failed.mp3";
const successSound = "./assets/mp3/success.mp3";

import Speech from "./speech.js";
let maxAccelerationX = 0,
  maxAccelerationY = 0,
  maxAccelerationZ = 0;
let isRecognizeFail = false;
let showErrorInformationTimeout = undefined;
let lastAudioUrl;
let audioErrors = 0;
let swypeStartX = 0;
let swypeFinishX = 0;
let swypeStartY = 0;
let swypeFinishY = 0;
let averagePronouncingResult = 0;
let pronouncingAttempts = 0;
let sumPronouncingResult = 0;
let isTranslateShown = false;
let isLeftArrowHidden = true;
let isMyVoicePlaying = false;
let globalWordIndex;
let isMoving;
let loadingInterval;
let loadingStartTime;
let mediaRecorder;
let voice = [];
let stream;
let isPrinting = false;
let currentIndexOfWord = undefined,
  lastIndexOfWord = undefined;
let audioPromise, request, transcriptForPronouncing;
let isMicrophoneAvailable = true;
let wordForPronouncing = "";
let usedWordsForPronouncing = [];
let usedPhrasesForPronouncing = [];
let indexOfWords = 0;
let indexOfPhrases = 0;
let mistakes = [];
let allUsedWords = [];
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
let isTranslated = false;
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
let lastConvertedTime;
let timeStart = 0;
let timeCurrent = 0;
let score = 0;
let lastResult = 0;
let currentLife = maxLife;
let wordsIndexes = [];
let threeWordsIndexes = [];
let wordYouSaid = "";
let isMenu = false;
let audioCtx, analizer;
let wasHiddenByHandler = false;
const stripNumber = 32;
let freqArray = new Uint8Array(stripNumber * 2);
const exampleButton = document.querySelector(".example-button");
const exampleCardImage = document.querySelector(".example-card-image");
const examplePhrase = document.querySelector(".example-phrase");
const examplePhraseTranslate = document.querySelector(
  ".example-phrase-translate"
);
const phraseSpeaker = document.querySelector(".phrase-speaker");
const errorInformation = document.querySelector(".error-information");
const resultDigit1 = document.querySelector(".result-digit-1");
const resultDigit2 = document.querySelector(".result-digit-2");
const wordExampleCard = document.querySelector(".word-example-card");
const audioPlace = document.querySelector(".audio-place");
const audioInfo = document.querySelector(".audio-info");
const theWord = document.querySelector(".the-word");
const transcript = document.querySelector(".transcript");
const visualisation = document.querySelector(".visualisation");
const youSay = document.querySelector(".you-say");
const rightArrow = document.querySelector(".right-arrow");
const leftArrow = document.querySelector(".left-arrow");
const orientationWarning = document.querySelector(".warning-container");
const mainContainer = document.querySelector(".main-container");
const exampleContainer = document.querySelector(".example-container");
const levelContainer = document.querySelector(".level-container");
const buttonStart = document.querySelector(".button-start");
const buttonStop = document.querySelector(".button-stop");
const wordButtons = document.querySelectorAll(".button");
const loadingElement = document.querySelector(".loading");
const innerCircle1 = document.querySelector(".inner-circle-1");
const innerCircle2 = document.querySelector(".inner-circle-2");
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
const speakerNext = document.querySelector(".speaker-next");
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
const ear = document.querySelector(".ear");
const translatePanel = document.querySelector(".translate-panel");
const percentSign = document.querySelector(".percent-sign");
const averageResultPlace = document.querySelector(".average-result");
const progressLine = document.querySelector(".progress-line");
const progressContainer = document.querySelector(".progress-container");
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
const mySpeech = new Speech("en");
const myWorker = new Worker("./worker.js");
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
          this.hideExampleCard();
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
    if (!isPrinting && isMicrophoneAvailable) {
      this.setLevel(level);
      this.showLevels();
    }
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
    this.showLoading(false, "showInfo");
    info.style.transform = "translateY(0%)";
    info.innerHTML = html;
    setTimeout(() => {
      this.hideInfo();
    }, 4000);
  }
  hideInfo() {
    info.style.transform = "translateY(-200%) scale(.3)";
  }
  showErrorInformation(error = "Error!") {
    errorInformation.style.visibility = "visible";
    errorInformation.textContent = error + ". Tap to hide this!";
    if (!showErrorInformationTimeout) {
      showErrorInformationTimeout = setTimeout(() => {
        this.hideErrorInformation();
        showErrorInformationTimeout = undefined;
      }, 30000);
    } else {
      clearTimeout(showErrorInformationTimeout);
      showErrorInformationTimeout = undefined;
      this.showErrorInformation(error);
    }
  }

  hideErrorInformation() {
    errorInformation.style.visibility = "hidden";
    errorInformation.textContent = "";
  }

  showMistakesPad() {
    mistakesPad.style.transform = "translateY(0%)";
    document.body.style.touchAction = "auto";
  }
  hideMistakesPad() {
    mistakesPad.style.transform = "translateY(200%)";
    document.body.style.touchAction = "";
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
  showTranslatePanel(left = 0, top = 0) {
    translatePanel.style.visibility = "visible";
    translatePanel.style.opacity = "1";
    if (document.documentElement.clientWidth - left < 200) {
      left = document.documentElement.clientWidth - 200;
    }

    translatePanel.style.top = (top - 100).toString() + "px";
    translatePanel.style.left = left.toString() + "px";
  }
  hideTranslatePanel() {
    isTranslateShown = false;
    translatePanel.style.visibility = "hidden";
    translatePanel.style.opacity = "0";
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
    leftArrow.style.cursor = "pointer";
  }
  showRightArrow() {
    rightArrow.style.visibility = "visible";
    rightArrow.style.opacity = ".7";
    rightArrow.style.cursor = "pointer";
  }
  hideLeftArrow() {
    leftArrow.style.visibility = "visible";
    leftArrow.style.opacity = "0.2";
    leftArrow.style.cursor = "auto";
  }
  hideRightArrow() {
    rightArrow.style.visibility = "visible";
    rightArrow.style.opacity = "0.2";
    rightArrow.style.cursor = "auto";
  }

  showClock() {
    clockContainer.style.visibility = "visible";
    clockContainer.style.opacity = "1";
    heart.style.animation = "1s heart-animation infinite";
  }
  hideClock() {
    clockContainer.style.visibility = "hidden";
    clockContainer.style.opacity = "0";
    heart.style.animation = "";
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
  showExamples(index = 0) {
    if (menu.matching) {
      exampleContainer.style.visibility = "visible";
      exampleContainer.style.opacity = "1";
      let containerBottom = exampleContainer.getBoundingClientRect().bottom;
      timeouts = [];
      let i = index;
      if (i <= 598) {
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
          i++;
          this.showExamples(i);
        }, 300);
        timeouts.push(timeout);
      } else this.showExamples();
    }
  }
  hideExamples() {
    if (timeouts) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    }
    timeouts = [];
    exampleContainer.style.visibility = "hidden";
    exampleContainer.style.opacity = "0";
    exampleContainer.innerHTML = "";
  }
  showButtonStart() {
    if (menu.matching) {
      buttonStart.style.visibility = "visible";
    }
  }
  hideButtonStart() {
    buttonStart.style.visibility = "hidden";
  }
  showButtonStop() {
    if (menu.matching) {
      buttonStop.style.visibility = "visible";
    }
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
    let opacity = value ? 0.7 : 0;
    let earOpacity = !value ? 0.7 : 0;
    let earVisibility = !value ? "visible" : "hidden";
    let cursor = value ? "pointer" : "auto";
    levelContainer.style.opacity = opacity;
    let timeout = value ? 600 : 0;
    setTimeout(() => {
      microphone.style.opacity = opacity;
      microphone.style.cursor = cursor;
    }, timeout);

    if (speakerNext) {
      speakerNext.style.opacity = opacity;
      speakerNext.style.cursor = cursor;
    }
    rightArrow.style.opacity = opacity;
    rightArrow.style.cursor = cursor;
    if (!isLeftArrowHidden) {
      leftArrow.style.opacity = opacity;
      leftArrow.style.cursor = cursor;
    }
    toggleContainer.style.opacity = opacity;
    isMicrophoneAvailable = value;
    setTimeout(() => {
      ear.style.opacity = earOpacity;
      ear.style.visibility = earVisibility;
      let earTop = microphone.getBoundingClientRect().top;
      let earLeft = microphone.getBoundingClientRect().left;
      ear.style.top = earTop + "px";
      ear.style.left = earLeft + "px";
    }, 500);
  }
  showInstruments(value) {
    let opacity = value ? 0.7 : 0.1;
    let cursor = value ? "pointer" : "auto";
    levelContainer.style.opacity = opacity;
    microphone.style.opacity = opacity;
    microphone.style.cursor = cursor;
    if (speakerNext) {
      speakerNext.style.opacity = opacity;
      speakerNext.style.cursor = cursor;
    }
    rightArrow.style.opacity = opacity;
    rightArrow.style.cursor = cursor;
    if (!isLeftArrowHidden) {
      leftArrow.style.opacity = opacity;
      leftArrow.style.cursor = cursor;
    }
    toggleContainer.style.opacity = opacity;
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
      digit1.style.transition = "500ms";
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
      digit2.style.transition = "500ms";
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
    this.removeButtonListeners();
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
    if (mistakes.length > 0 && menu.matching) {
      setTimeout(() => {
        this.processMistakes();
      }, 4000);
      setTimeout(() => {
        this.showButtonStart();
      }, 5000);
    } else if (mistakes.length === 0 && menu.matching) {
      this.showButtonStart();
      timeoutForStart = setTimeout(() => {
        this.hideExamples();
        this.showExamples();
      }, 5000);
    }
  }

  removeButtonListeners() {
    document.querySelectorAll(".button").forEach((el) => {
      el.removeEventListener("pointermove", game.moveHandlerRight);
      el.removeEventListener("pointermove", game.moveHandlerLeft);
      this.moveToInitPosition(el);
      el.style.zIndex = 1;
    });
  }
  processMistakes() {
    if (menu.matching) {
      mistakesContainer.innerHTML = "";
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
    }
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
    this.showLoading(true, "loadWords");
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
    setTimeout(() => this.showLoading(false, "afterLoading"), 1000);
    this.showButtonStop();
    this.showGamepad();
    this.showClock();
    this.operateClock();
    this.setWordsIndexes();
    this.defineLeftWords();
    this.defineRightWords();
    this.firstTimeShowWords();
  }
  showLoading(visibility, from = "unknown") {
    if (visibility === isLoading) {
      return;
    }

    console.log(from, "-", visibility);

    isLoading = visibility;
    let v = visibility ? "visible" : "hidden";
    let anim1 = visibility ? " 1s linear rotate2 infinite" : "";
    let anim2 = visibility ? " 4.4s linear rotate2 infinite" : "";
    let anim3 = visibility ? " 8.1s linear rotate2 infinite" : "";
    let opacity = visibility ? 0.6 : 1;
    loadingElement.style.visibility = v;
    loadingElement.style.animation = anim1;
    innerCircle1.style.animation = anim2;
    innerCircle2.style.animation = anim3;
    pronouncingContainer.style.opacity = opacity;

    if (isLoading) {
      loadingStartTime = Date.now();
      loadingInterval = setInterval(() => {
        if (Date.now() - loadingStartTime > 10000) {
          clearInterval(loadingInterval);
          if (
            confirm(
              "Loading is taking too long time! Do you want to reload page?"
            )
          ) {
            location.reload();
          } else {
            this.showLoading(false);
            this.showErrorInformation("Reload the page manually!");
          }
        }
      }, 500);
    } else {
      loadingStartTime = undefined;
      clearInterval(loadingInterval);
    }
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
    }, 200);
  }
  operateEverySecond() {
    timeCurrent = Date.now();
    timeRemained = timeAll - (timeCurrent - timeStart);
    if (timeRemained < 0) {
      timeRemained = 0;
    }

    if (timeRemained < 15000) {
      vibrate.timeIsOver();
    }
    if (timeRemained <= 1000) {
      playAudio(failedSound);
    }

    let convertedTime = this.convertTime(timeRemained);

    clock.textContent = convertedTime;

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
    let rest = time - (min * 60000 + sec * 1000);
    if (min < 10) {
      min = "0" + min.toString();
    }
    if (sec < 10) {
      sec = "0" + sec.toString();
    }
    let result = rest > 500 ? `${min}:${sec}` : `${min} ${sec}`;
    return result;
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
    this.showLoading(true, "firstTimeShowWords");
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
          this.showLoading(false, "firstTimeShowWords");
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
    game.removeButtonListeners();
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
    this.removeButtonListeners();
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
    currentIndexOfWord = index;
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
        word = wordsArray[index].textExample
          .replace("<b>", "")
          .replace("</b>", "");
        transcriptForPronouncing = "";
      }
      return { word, index };
    } else return this.getWordForPronouncing(undefined, false);
  }
  defineWordForPronouncing(ind = undefined) {
    let ignore = !!ind ? true : false;
    let item = this.getWordForPronouncing(ind, ignore);
    wordForPronouncing = item.word;
    let index = item.index;
    this.writeWord(wordForPronouncing, index);
  }

  writeWord(word, index) {
    globalWordIndex = index;
    let symbolNumber = word.length;
    let timeInterval = 75;
    let n = 0;
    let interval;
    this.showLoading(true, "writeWord");
    this.showInstruments(false);
    transcript.textContent = "";
    speakerNext.style.opacity = 0;
    theWord.style.textAlign = isPhrasePronouncing ? "left" : "center";
    isPrinting = true;
    this.speakerListener().then(() => {
      this.showLoading(false, "writeWord");
      interval = setInterval(() => {
        n++;
        theWord.innerHTML = `<span>${word.slice(
          0,
          n
        )}<span><span class='cursor-line'>|<span>`;

        if (n >= symbolNumber) {
          this.showInstruments(true);
          clearInterval(interval);
          setExampleButtonVisibility();
          isPrinting = false;
          theWord.innerHTML = `<span>${word}<span><span class='cursor-line'>|<span>`;
          transcript.textContent = transcriptForPronouncing;
          theWord.addEventListener("pointerdown", translateButtonListener);
        }
      }, timeInterval);
    });
  }
  eraseWord(word) {
    console.log(word);
    return new Promise((resolve, reject) => {
      if (word === "") {
        return resolve();
      }
      let symbolNumber = word.length;
      let timeInterval = 10;
      let n = symbolNumber;
      let interval;
      this.showInstruments(false);
      theWord.removeEventListener("pointerdown", translateButtonListener);
      transcript.textContent = "";
      speakerNext.style.opacity = 0;
      isPrinting = true;

      interval = setInterval(() => {
        n--;
        theWord.innerHTML = `<span>${word.slice(
          0,
          n
        )}<span><span class='cursor-line'>|<span>`;

        if (n === 0) {
          this.showInstruments(true);
          clearInterval(interval);
          isPrinting = false;
          return resolve();
        }
      }, timeInterval);
    });
  }

  rewriteWord() {
    let index = globalWordIndex;
    if (isPhrasePronouncing) {
      game.showInstruments(false);
      let word = wordsArray[index].textExample
        .replace("<b>", "")
        .replace("</b>", "");
      let symbolNumber = word.length;
      let timeInterval = 75;
      let n = 0;
      let interval;
      game.showLoading(true, "rewriteWord");
      transcript.textContent = "";

      isPrinting = true;
      game.speakerListener().then(() => {
        game.showLoading(false, "rewriteWord");
        interval = setInterval(() => {
          n++;
          theWord.innerHTML = `<span>${word.slice(
            0,
            n
          )}</span><span class='cursor-line'>|</span><span>${word.slice(
            n
          )}</span>`;

          if (n >= symbolNumber) {
            game.showInstruments(true);
            clearInterval(interval);
            isPrinting = false;
            theWord.innerHTML = `<span>${word}<span><span class='cursor-line'>|<span>`;
          }
        }, timeInterval);
      });
    } else {
      game.speakerListener();
    }
  }

  speakerListener() {
    return new Promise((resolve, reject) => {
      let timeStart = Date.now();
      let interval;
      interval = setInterval(() => {
        if (Date.now() - timeStart >= 2000) {
          clearInterval(interval);
          return resolve();
        }
      }, 200);
      if (isMicrophoneAvailable) {
        let index = globalWordIndex;
        let endpoint = isPhrasePronouncing
          ? wordsArray?.[index]?.audioExample
          : wordsArray?.[index]?.audio;
        if (endpoint) {
          playAudio(mainUrl + endpoint)
            .then(() => {
              console.log("audio played");
              clearInterval(interval);
              return resolve();
            })
            .catch((err) => {
              console.log("error occured:", err);
              this.showErrorInformation(err);
              clearInterval(interval);
              return resolve();
            });
        }
      }
    });
  }

  microphoneHandler() {
    if (!isMicrophoneAvailable || isPrinting) {
      return;
    } else {
      game.hideInfo();
      if (youSay.textContent !== "") {
        setTimeout(() => {
          youSay.style.opacity = "0";
          youSay.style.color = "";
          youSay.style.transform = "translateX(-100px)";
        }, 1000);
      }
      game.setPronouncingResult(0);
      if (!isRecognizeFail) {
        setTimeout(() => game.listenMicrophone(), 100);
      }
      mySpeech
        .speechRecognition()
        .then((result) => {
          wordYouSaid = wordForPronouncing;
          setTimeout(() => {
            if (mediaRecorder) {
              mediaRecorder.stop();
            }
          }, 300);

          console.log(result.phrase, result.confidence);
          game.processPronouncingResult(result);
        })
        .catch((err) => {
          if (menu.pronouncing) {
            wordYouSaid = "";
            if (game.checkError(err)) {
              game.showInfo(`<p>Error happened: \r\n<span>${err}</span><p>`);
            }
            game.showErrorInformation("Error happened: " + err);
          }
        })
        .finally(() => {
          game.setMicrophoneActive(true);
          game.showLoading(false, "microphoneHandler");
          game.cancelMediaStream();
        });
      mySpeech
        .lookForSoundStart()
        .then((message) => {
          console.log(message);
          game.showLoading(true, "microphoneHandler");
        })
        .catch((err) => {
          if (menu.pronouncing) {
            if (game.checkError(err)) {
              game.showInfo(`<p>Error happened: \r\n<span>${err}</span><p>`);
            }
            this.showErrorInformation(err);
          }
          if (mediaRecorder) {
            mediaRecorder.stop();
          }
        });
      mySpeech
        .lookForAudioStart()
        .then((message) => {
          console.log(message);
          game.setMicrophoneActive(false);
        })
        .catch((err) => {
          if (menu.pronouncing) {
            if (game.checkError(err)) {
              game.showInfo(`<p>Error happened: \r\n<span>${err}</span><p>`);
            }
            this.showErrorInformation(err);
          }
        });
    }
  }
  checkError(err) {
    console.log("in checkError:", err);
    if (err === "aborted") {
      this.abortHandler();
      return false;
    }
    if (err === "speech not recognized! Try again!") {
      this.notRecognizeHandler();
      return false;
    }

    return true;
  }
  notRecognizeHandler() {
    console.log("notRecognizedHandler");
    game.showInfo(`<p>Not recognize! \r\n<span>Try again!</span><p>`);
    game.showErrorInformation("Not recognize!Try again!");
    game.cancelMediaStream();
    isRecognizeFail = true;
    setTimeout(() => {
      //game.microphoneHandler();
      game.hideErrorInformation();
    }, 1500);
  }

  abortHandler() {
    console.log("abortHandler");
    game.showInfo(`<p>Your action: \r\n<span>STOP!</span><p>`);
    game.showErrorInformation("Your action: STOP!");
    game.cancelMediaStream();
  }
  processPronouncingResult(result) {
    let res = (result.confidence * 100).toFixed(0);
    ear.style.opacity = 0.8;
    if (!isPhrasePronouncing) {
      youSay.textContent = result.phrase.toLowerCase();
      if (
        wordForPronouncing.toLowerCase() === result.phrase.toLowerCase() &&
        res > 0
      ) {
        pronouncingWord.style.color = "green";
        this.setPronouncingResult(res);
        youSay.style.opacity = "1";
        youSay.style.color = "green";
        youSay.style.transform = "translateX(0px)";
      } else {
        this.setPronouncingResult(0);
        youSay.style.opacity = "1";
        youSay.style.color = "red";
        youSay.style.transform = "translateX(0px)";
      }
      setTimeout(() => {
        pronouncingWord.style.color = "";
        this.rightArrowHandler();
      }, 500);
    } else if (isPhrasePronouncing) {
      let phraseArray = wordForPronouncing
        .toLowerCase()
        .replace(".", "")
        .replace(";", "")
        .replace(",", "")
        .replace("?", "")
        .replace("!", "")
        .split(" ");
      let pronouncingPhraseArray = result.phrase.toLowerCase().split(" ");
      let innerhtml = "";
      pronouncingPhraseArray.forEach((item) => {
        if (phraseArray.includes(item)) {
          innerhtml += `<span class='phrase-span' style='color:green'>${item} </span>`;
        } else {
          innerhtml += `<span class='phrase-span' style='color:red'>${item} </span>`;
        }
      });

      this.setPronouncingResult(res);
      youSay.innerHTML = innerhtml;
      youSay.style.opacity = "1";
      youSay.style.transform = "translateX(0px)";

      setTimeout(() => {
        this.rightArrowHandler();
      }, 3000);
    }
    this.operatePronouncingResult(res);
  }

  operatePronouncingResult(result) {
    pronouncingAttempts++;
    sumPronouncingResult += +result;
    averagePronouncingResult = (
      sumPronouncingResult / pronouncingAttempts
    ).toFixed(1);
    localStorage.setItem("pronouncingAttempts", pronouncingAttempts);
    localStorage.setItem("sumPronouncingResult", sumPronouncingResult);
    localStorage.setItem("averagePronouncingResult", averagePronouncingResult);
    this.showAverageResult(averagePronouncingResult);
  }
  showAverageResult(result = "") {
    averageResultPlace.style.opacity = 0;
    setTimeout(() => {
      averageResultPlace.textContent = result;
      averageResultPlace.style.opacity = 1;
    }, 500);
  }

  setPronouncingResult(result = 0) {
    if (lastResult > result) {
      this.decreaseResult(result);
    } else if (lastResult < result) {
      this.increaseResult(result);
    }
    lastResult = result;
  }
  decreaseResult(result) {
    let num = lastResult;
    let interval = setInterval(() => {
      this.showResult(num);
      if (num <= result) {
        clearInterval(interval);
      } else {
        num--;
      }
    }, 10);
  }
  increaseResult(result) {
    let num = lastResult;
    let interval = setInterval(() => {
      this.showResult(num);
      if (num >= result) {
        clearInterval(interval);
      } else {
        num++;
      }
    }, 10);
  }
  showResult(num = 0) {
    let color = this.getResultColor(num);
    let dig1 = Math.floor(num / 10);
    let dig2 = num % 10;
    resultDigit1.style.transform = `translateY(${-dig1 * 34.5}px)`;
    resultDigit2.style.transform = `translateY(${-dig2 * 34.5}px)`;
    resultDigit1.style.color = color;
    resultDigit2.style.color = color;
    percentSign.style.color = color;
  }
  getResultColor(result) {
    return `rgba(${255 - result * 2.55},${result * 2.55},100,1)`;
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
    game.deleteAudio();
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
        mediaRecorder = new MediaRecorder(stream, { audiBitsPerSecond: 44000 });
        voice = [];
        mediaRecorder.start();

        mediaRecorder.addEventListener("dataavailable", function (event) {
          voice.push(event.data);
        });

        mediaRecorder.addEventListener("stop", game.saveAudio);
      })
      .catch((err) => {
        game.showErrorInformation(err);
        alert(err + "\r\n The page will be reloaded!");
        location.reload();
      });
  }

  saveAudio() {
    game.deleteAudio();
    if (wordYouSaid !== "") {
      const audio = document.createElement("audio");
      audio.setAttribute("controls", "");
      audio.title = "Your voice";
      audio.addEventListener("play", () => {
        stopAudio();
        isMyVoicePlaying = true;
      });
      audio.addEventListener("ended", () => {
        isMyVoicePlaying = false;
      });
      audio.addEventListener("pause", () => {
        isMyVoicePlaying = false;
      });
      audioPlace.appendChild(audio);
      const blob = new Blob(voice, { type: "audio/wav" });
      voice = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
    } else {
      setTimeout(() => (audioInfo.textContent = ""), 2500);
    }
    audioInfo.textContent =
      wordYouSaid !== ""
        ? `Listen how you said: "${wordYouSaid}"`
        : "We heard nothing!";
  }

  deleteAudio() {
    audioInfo.textContent = "";
    document.querySelectorAll("audio").forEach((el) => el.remove());
  }
  loop() {
    if (menu.pronouncing) {
      request = window.requestAnimationFrame(game.loop);
      if (!isMicrophoneAvailable) {
        analizer.getByteFrequencyData(freqArray);
        for (let i = 0; i < stripNumber; i++) {
          let height = freqArray[stripNumber + i];
          if (height < 10) {
            height = 10;
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
    if (isMicrophoneAvailable && !isPrinting) {
      clearInterval(interval);
      if (youSay.textContent !== "") {
        setTimeout(() => {
          youSay.style.opacity = "0";
          youSay.style.color = "";
          youSay.style.transform = "translateX(-100px)";
        }, 1000);
      }
      stopAudio();
      game.hideInfo();
      game.eraseWord(wordForPronouncing).then(() => {
        //pronouncingWord.style.animationName = "go-forward";
        game.hideExampleButton();
        setTimeout(() => {
          if (isPhrasePronouncing) {
            if (indexOfPhrases === undefined) {
              indexOfPhrases = 0;
              game.hideLeftArrow();
              isLeftArrowHidden = true;
            } else {
              indexOfPhrases += 1;
              game.showLeftArrow();
              isLeftArrowHidden = false;
            }

            if (indexOfPhrases <= usedPhrasesForPronouncing.length - 1) {
              game.defineWordForPronouncing(
                usedPhrasesForPronouncing[indexOfPhrases]
              );
            } else {
              game.defineWordForPronouncing();
            }
          } else if (!isPhrasePronouncing) {
            if (indexOfWords === undefined) {
              indexOfWords = 0;
              game.hideLeftArrow();
              isLeftArrowHidden = true;
            } else {
              indexOfWords += 1;
              game.showLeftArrow();
              isLeftArrowHidden = false;
            }
            if (indexOfWords <= usedWordsForPronouncing.length - 1) {
              game.defineWordForPronouncing(
                usedWordsForPronouncing[indexOfWords]
              );
            } else {
              game.defineWordForPronouncing();
            }
          }
          if (isTranslateShown) {
            fillTranslatePanel();
          }
        });
        //setTimeout(() => (pronouncingWord.style.animationName = ""), 600);
      });
    }
  }
  leftArrowHandler() {
    if (isMicrophoneAvailable && !isPrinting && !isLeftArrowHidden) {
      clearInterval(interval);
      if (youSay.textContent !== "") {
        setTimeout(() => {
          youSay.style.opacity = "0";
          youSay.style.color = "";
          youSay.style.transform = "translateX(-100px)";
        }, 1000);
      }
      stopAudio();
      game.hideInfo();
      game.eraseWord(wordForPronouncing).then(() => {
        game.hideExampleButton();
        setTimeout(() => {
          if (isPhrasePronouncing) {
            if (indexOfPhrases === 0) {
              game.hideLeftArrow();
              isLeftArrowHidden = true;
              return;
            }
            if (indexOfPhrases <= 1) {
              indexOfPhrases = 0;
              game.hideLeftArrow();
              isLeftArrowHidden = true;
            } else {
              indexOfPhrases -= 1;
              isLeftArrowHidden = false;
            }
            game.defineWordForPronouncing(
              usedPhrasesForPronouncing[indexOfPhrases]
            );
          } else if (!isPhrasePronouncing) {
            if (indexOfWords === 0) {
              game.hideLeftArrow();
              isLeftArrowHidden = true;
              return;
            }
            if (indexOfWords <= 1) {
              indexOfWords = 0;
              game.hideLeftArrow();
              isLeftArrowHidden = true;
            } else {
              indexOfWords -= 1;
              isLeftArrowHidden = false;
            }
            game.defineWordForPronouncing(
              usedWordsForPronouncing[indexOfWords]
            );
          }
          // pronouncingWord.style.animationName = "go-back";

          // setTimeout(() => (pronouncingWord.style.animationName = ""), 600);
        });
      });
    }
  }
  cancelMediaStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = undefined;
      audioCtx = undefined;
      mediaRecorder = undefined;
    }
  }
  loadUserData() {
    pronouncingAttempts = localStorage.getItem("pronouncingAttempts")
      ? +localStorage.getItem("pronouncingAttempts")
      : 0;
    sumPronouncingResult = localStorage.getItem("sumPronouncingResult")
      ? +localStorage.getItem("sumPronouncingResult")
      : 0;
    averagePronouncingResult = localStorage.getItem("averagePronouncingResult")
      ? +localStorage.getItem("averagePronouncingResult")
      : 0;
  }
  getTheWordCoordinates() {
    let left = theWord.getBoundingClientRect().left - 50;
    let top = theWord.getBoundingClientRect().top - 50;
    return { left, top };
  }
  showExampleButton() {
    let left = this.getTheWordCoordinates().left;
    let top = this.getTheWordCoordinates().top;
    exampleButton.style.left = left + "px";
    exampleButton.style.top = top + "px";
    exampleButton.style.visibility = "visible";
    exampleButton.style.opacity = 1;
    exampleButton.style.animation = "button-flow infinite";
    exampleButton.style.animationDuration = "2s";
    exampleButton.addEventListener("pointerdown", this.exampleButtonHandler);
  }
  hideExampleButton() {
    exampleButton.style.left = -100;
    exampleButton.style.top = -100;
    exampleButton.style.visibility = "hidden";
    exampleButton.style.opacity = 0;
    exampleButton.style.animation = "";
    exampleButton.removeEventListener("pointerdown", this.exampleButtonHandler);
  }

  async exampleButtonHandler() {
    game.removeSpeakerListener(lastAudioUrl);
    game.showExampleCard();
    game.hideExampleButton();
    wasHiddenByHandler = true;
    if (lastIndexOfWord === currentIndexOfWord) {
      return;
    } else {
      lastIndexOfWord = currentIndexOfWord;
      let imageEndpoint = wordsArray?.[currentIndexOfWord].image;
      let audioEndpoint = wordsArray?.[currentIndexOfWord].audioExample;
      let imageUrl = mainUrl + imageEndpoint;
      myWorker.postMessage({ url: imageUrl });
      game.showLoading(true);
      game.drawProgress(0);
      exampleCardImage.src = "";
      let audioUrl = mainUrl + audioEndpoint;
      examplePhrase.style.opacity = 0;
      examplePhraseTranslate.style.opacity = 0;
      exampleCardImage.style.opacity = 0;
      phraseSpeaker.style.opacity = 0;
      let textExample = wordsArray?.[currentIndexOfWord].textExample;
      getAIImageUrl(textExample)
        .then((AIImageUrl) => console.log("AI image URL:", AIImageUrl))
        .catch((err) => {
          console.log(err);
          game.showErrorInformation(err);
        });

      examplePhrase.innerHTML = textExample;
      examplePhraseTranslate.innerHTML =
        wordsArray?.[currentIndexOfWord].textExampleTranslate;
      myWorker.onmessage = (e) => {
        if (!(e.data instanceof Array)) {
          exampleCardImage.src = URL.createObjectURL(e.data);
          game.showLoading(false);
          let progress = 100;
          game.drawProgress(progress);
        } else {
          let loaded = e.data[0];
          let total = e.data[1];
          let progress = +((loaded / total) * 100).toFixed(1);
          game.drawProgress(progress);
        }
      };

      setTimeout(() => {
        examplePhrase.style.opacity = 1;
      }, 1200);
      setTimeout(() => {
        exampleCardImage.style.opacity = 1;
      }, 800);
      setTimeout(() => {
        phraseSpeaker.style.opacity = 1;
      }, 1600);
      setTimeout(() => {
        examplePhraseTranslate.style.opacity = 1;
      }, 2000);

      game.addSpeakerListener(audioUrl);
      lastAudioUrl = audioUrl;
    }
  }

  drawProgress(progress) {
    console.log("draw progress:", progress);
    if (progress === 0) {
      progressContainer.style.visibility = "visible";
    }
    setTimeout(() => {
      progressLine.style.width = `${(200 * progress) / 100}px`;
    }, progress * 10);
    if (progress > 99) {
      setTimeout(() => (progressContainer.style.visibility = "hidden"), 1200);
    }
  }
  showExampleCard() {
    wordExampleCard.style.transform = "translateY(0%) scale(1)";
    wordExampleCard.addEventListener("pointerdown", this.hideExampleCard);
    wordExampleCard.style.opacity = 1;
    this.hideMenu();
    this.hideInfo();
  }
  hideExampleCard() {
    wordExampleCard.style.transform = "translateY(-200%) scale(0.1)";
    wordExampleCard.style.opacity = 0;
    wordExampleCard.removeEventListener("pointerdown", this.hideExampleCard);
    if (wasHiddenByHandler) {
      game.showExampleButton();
      wasHiddenByHandler = false;
    }
  }
  addSpeakerListener(src) {
    phraseSpeaker.addEventListener("pointerdown", (e) => {
      playAudio(src);
      e.stopPropagation();
    });
  }
  removeSpeakerListener(src) {
    phraseSpeaker.removeEventListener("pointerdown", (e) => {
      playAudio(src);
      e.stopPropagation();
    });
  }
}
const game = new WordGame();
info.addEventListener("pointerdown", () => {
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
        if (isMicrophoneAvailable && !isPrinting) {
          vibrate.ordinary();
          game.hideInfo();
          game.hideMistakesPad();
          game.chooseLevel(level);
          game.hideTranslatePanel();
        }
      }
    }
  });
}
function init() {
  audioErrors = 0;
  wakeLock();
  game.loadUserData();
  menuButton.addEventListener("pointerdown", handleMenu);
  toggle.addEventListener("pointerdown", handleToggle);
  menuPanel.addEventListener("pointerdown", () => game.hideMenu());
  errorInformation.addEventListener("pointerdown", game.hideErrorInformation);
  mainContainer.addEventListener("pointerdown", () => {
    game.hideMenu();
    game.hideTranslatePanel();
    game.hideExampleCard();
  });
  menuItem1.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    menu.matching = true;
    menu.pronouncing = false;
    game.processMenu();
  });
  menuItem2.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    menu.matching = false;
    menu.pronouncing = true;
    game.processMenu();
  });
  menuItem3.addEventListener("pointerdown", (e) => {
    window.open(ageByPhotoUrl, "_blank");
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
  deviceOrientationListener();
  deviceMotionListener()
}

async function initMatching() {
  if (request) {
    cancelAnimationFrame(request);
    request = undefined;
  }
  cancelListenSwype();
  game.hideInfo();
  if (mySpeech) {
    mySpeech.stopRecognition();
  }
  game.showAverageResult("");
  game.showLoading(false, "initMatching");
  game.cancelMediaStream();
  game.resetVisualisation();
  game.showButtonStart();
  let arr = await game.loadData();
  wordsArray = [...arr];
  game.hideExamples();
  game.showExamples();
  game.hideExampleCard();
  game.hideExampleButton();
  game.hidePronouncing();
  game.hideLeftArrow();
  game.hideRightArrow();
  game.hideTranslatePanel();

  stopAudio();

  exampleContainer.addEventListener("pointerdown", listenExamples);
  removeListeners();

  if (theWord) {
    theWord.removeEventListener("pointerdown", translateButtonListener);
  }
  leftArrow.style.visibility = "hidden";
  rightArrow.style.visibility = "hidden";
}
function removeListeners() {
  ear.removeEventListener("pointerdown", abortMicrophoneListener);
  microphone.removeEventListener("pointerdown", game.microphoneHandler);
  rightArrow.removeEventListener("pointerdown", game.rightArrowHandler);
  leftArrow.removeEventListener("pointerdown", game.leftArrowHandler);
  translatePanel.removeEventListener("pointerdown", game.hideTranslatePanel);
  speakerNext.removeEventListener("pointerdown", game.rewriteWord);
  // window.removeEventListener("deviceorientation", handleOrientationEvent, true);
}

function initPronouncing() {
  if (mySpeech) {
    mySpeech.stopRecognition();
  }
  audioCtx = undefined;
  mistakes = [];
  stripsArray = [];
  listenSwype();
  isRecognizeFail = false;
  removeListeners();
  game.resetVisualisation();
  game.hideExampleCard();
  game.hideExampleButton();
  game.showAverageResult(averagePronouncingResult);
  game.showLoading(false, "initPronouncing");
  game.hideInfo();
  game.hideClock();
  game.stopClock();
  game.hideExamples();
  game.hideMistakesPad();
  game.hideButtonStart();
  game.hideButtonStop();
  game.hideGamePad();
  game.showScore(false);
  game.showPronouncing();
  game.showLeftArrow();
  game.showRightArrow();
  game.showLevelsContainer();
  game.setToggleStyle();
  game.showResult();
  ear.addEventListener("pointerdown", abortMicrophoneListener);
  exampleContainer.removeEventListener("pointerdown", listenExamples);
  microphone.addEventListener("pointerdown", game.microphoneHandler);
  rightArrow.addEventListener("pointerdown", game.rightArrowHandler);
  leftArrow.addEventListener("pointerdown", game.leftArrowHandler);
  translatePanel.addEventListener("pointerdown", game.hideTranslatePanel);
  speakerNext.addEventListener("pointerdown", game.rewriteWord);
  usedWordsForPronouncing = [];
  usedPhrasesForPronouncing = [];
  indexOfWords = undefined;
  indexOfPhrases = undefined;
  game.rightArrowHandler();
  game.setMicrophoneActive(true);
  game.createVisualisation();
  // game.listenMicrophone();
}

function translateButtonListener(event) {
  event.stopPropagation();
  let left = event.clientX;
  let top = event.clientY;
  if (!isMenu) {
    isTranslateShown = !isTranslateShown;
    if (isTranslateShown) {
      fillTranslatePanel(left, top);
    } else game.hideTranslatePanel();
  }
}
function fillTranslatePanel(left, top) {
  let translation = isPhrasePronouncing
    ? wordsArray[currentIndexOfWord].textExampleTranslate
    : wordsArray[currentIndexOfWord].wordTranslate;
  translatePanel.innerHTML = translation;
  game.showTranslatePanel(left, top);
}

function wakeLock() {
  navigator.wakeLock.request("screen").catch(console.log);
}

function playAudio(src) {
  if (isMyVoicePlaying) {
    audioPromise = undefined;
    return Promise.resolve();
  }
  stopAudio();
  audio.src = src;
  audioPromise = audio.play();
  audioPromise.catch((err) => {
    console.log(err);
    game.showErrorInformation(err);
    speakerNext.style.opacity = 0.1;
    audioErrors++;
    if (audioErrors < 2) {
      game.showInfo(
        `<p style="color:red">You got some problem with audio!</p><p>Maybe you won't hear anything!</p>`
      );
    }
    if (menu.pronouncing) {
      setTimeout(() => (speakerNext.style.opacity = 0.7), 5000);
    }
  });
  return audioPromise;
}

function stopAudio() {
  if (audioPromise !== undefined) {
    audio.pause();
  }
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
function abortMicrophoneListener() {
  if (!isMicrophoneAvailable) {
    mySpeech.abortRecognition();
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
  game.hideTranslatePanel();
  if (isMenu) {
    game.showMenu();
  } else {
    game.hideMenu();
  }
}
function listenSwype() {
  pronouncingContainer.addEventListener("pointerdown", swypeStartListener);
  pronouncingContainer.addEventListener("pointerup", swypeFinishListener);
}

function cancelListenSwype() {
  pronouncingContainer.removeEventListener("pointerdown", swypeStartListener);
  pronouncingContainer.removeEventListener("pointerup", swypeFinishListener);
  swypeStartX = 0;
  swypeFinishX = 0;
  swypeStartY = 0;
  swypeFinishY = 0;
}
function swypeStartListener(e) {
  swypeStartX = e.clientX;
  swypeStartY = e.clientY;
  pronouncingContainer.addEventListener("pointermove", swypeMovingListener);
}

function swypeMovingListener(e) {
  e.preventDefault();
  let currentX = e.clientX;
  let width = pronouncingContainer.clientWidth;
  let deltaX = swypeStartX - currentX;
  console.log(swypeStartX, currentX, deltaX, width);
  if (!isPrinting && isMicrophoneAvailable) {
    if (deltaX > 0) {
      pronouncingContainer.style.backgroundImage = `linear-gradient(260deg, rgba(0, 255, 0, ${
        deltaX / (width * 2)
      }), rgba(255, 0, 0, 0) ${
        (deltaX / (width * 3)) * 100
      }%), linear-gradient(280deg, rgba(0, 255, 0, ${
        deltaX / (width * 2)
      }), rgba(255, 0, 0, 0) ${
        (deltaX / (width * 3)) * 100
      }%), linear-gradient(230deg, rgba(140, 255, 255, ${
        deltaX / width
      }), rgba(140, 255, 255, 0)  ${
        (deltaX / (width * 3)) * 100
      }%),  linear-gradient(320deg, rgba(140, 255, 255, ${
        deltaX / width
      }), rgba(140, 255, 255, 0)  ${(deltaX / (width * 3)) * 100}%)`;
    }
    if (deltaX < 0) {
      pronouncingContainer.style.backgroundImage = `linear-gradient(80deg, rgba(0, 255, 0, ${
        -deltaX / (width * 2)
      }), rgba(255, 0, 0, 0) ${
        (-deltaX / (width * 3)) * 100
      }%), linear-gradient(100deg, rgba(0, 255, 0, ${
        -deltaX / (width * 2)
      }), rgba(255, 0, 0, 0) ${
        (-deltaX / (width * 3)) * 100
      }%), linear-gradient(50deg, rgba(140, 255, 255, ${
        -deltaX / width
      }), rgba(140, 255, 255, 0)  ${
        (-deltaX / (width * 3)) * 100
      }%),  linear-gradient(130deg, rgba(140, 255, 255, ${
        -deltaX / width
      }), rgba(140, 255, 255, 0)  ${(-deltaX / (width * 3)) * 100}%)`;
    }
  } else {
    vibrate.wrong();
    if (deltaX > 0) {
      pronouncingContainer.style.backgroundImage = `linear-gradient(260deg, rgba(255, 0, 0, ${
        deltaX / (width * 2)
      }), rgba(0, 0, 0, 0) ${
        (deltaX / (width * 3)) * 100
      }%), linear-gradient(280deg, rgba(255, 0, 0, ${
        deltaX / (width * 2)
      }), rgba(0, 0, 0, 0) ${
        (deltaX / (width * 3)) * 100
      }%), linear-gradient(230deg, rgba(140, 255, 255, ${
        deltaX / width
      }), rgba(140, 255, 255, 0)  ${
        (deltaX / (width * 3)) * 100
      }%),  linear-gradient(320deg, rgba(140, 255, 255, ${
        deltaX / width
      }), rgba(140, 255, 255, 0)  ${(deltaX / (width * 3)) * 100}%)`;
    }
    if (deltaX < 0) {
      pronouncingContainer.style.backgroundImage = `linear-gradient(80deg, rgba(255, 0, 0, ${
        -deltaX / (width * 2)
      }), rgba(255, 0, 0, 0) ${
        (-deltaX / (width * 3)) * 100
      }%), linear-gradient(100deg, rgba(255, 0, 0, ${
        -deltaX / (width * 2)
      }), rgba(255, 0, 0, 0) ${
        (-deltaX / (width * 3)) * 100
      }%), linear-gradient(50deg, rgba(140, 255, 255, ${
        -deltaX / width
      }), rgba(140, 255, 255, 0)  ${
        (-deltaX / (width * 3)) * 100
      }%),  linear-gradient(130deg, rgba(140, 255, 255, ${
        -deltaX / width
      }), rgba(140, 255, 255, 0)  ${(-deltaX / (width * 3)) * 100}%)`;
    }
  }
}

function swypeFinishListener(e) {
  pronouncingContainer.removeEventListener("pointermove", swypeMovingListener);
  pronouncingContainer.style.backgroundImage = "";
  swypeFinishX = e.clientX;
  swypeFinishY = e.clientY;
  let deltaX = swypeFinishX - swypeStartX;
  let deltaY = Math.abs(swypeFinishY - swypeStartY);
  if (deltaX < -100 && deltaY < 50) {
    game.rightArrowHandler();
  }
  if (deltaX > 100 && deltaY < 50) {
    game.leftArrowHandler();
  }
  swypeStartX = 0;
  swypeFinishX = 0;
  swypeStartY = 0;
  swypeFinishY = 0;
}

function handleToggle() {
  if (isMicrophoneAvailable && !isPrinting) {
    isPhrasePronouncing = !isPhrasePronouncing;
    game.setToggleStyle();
    indexOfPhrases = undefined;
    indexOfWords = undefined;
    game.rightArrowHandler();
  }
}
function setExampleButtonVisibility() {
  if (!isPhrasePronouncing && menu.pronouncing) {
    game.showExampleButton();
  } else {
    game.hideExampleButton();
  }
}

function getAIImageUrl(text) {
  //location.href=AIUrl
  return new Promise((resolve, reject) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", `*`);

    var raw = JSON.stringify({
      key: APIKey,
      prompt: text,
      negative_prompt: null,
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "20",
      safety_checker: "no",
      enhance_prompt: "yes",
      seed: null,
      guidance_scale: 7.5,
      multi_lingual: "no",
      panorama: "no",
      self_attention: "no",
      upscale: "no",
      embeddings_model: "embeddings_model_id",
      webhook: null,
      track_id: null,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      // mode:'no-cors'
    };

    fetch(AIUrl, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        return resolve(result);
      })
      .catch((error) => {
        game.showErrorInformation(error);
        return reject(error);
      });
  });
}

function beforeUnloadListener(event) {
  // event.preventDefault();
  console.log("see you later!");
}

function deviceOrientationListener() {
  if (window.DeviceOrientationEvent) {
    console.log("DeviceOrientation present!");
    window.addEventListener("deviceorientation", handleOrientationEvent, true);
  } else {
    console.log("DeviceOrientation is absent!");
  }
}
function deviceMotionListener() {
  window.addEventListener("devicemotion", handleMotionEvent, true);
}

function handleMotionEvent(event) {
  const x = event.accelerationIncludingGravity.x;
  const y = event.accelerationIncludingGravity.y;
  const z = event.accelerationIncludingGravity.z;
  maxAccelerationX=maxAccelerationX<x?x:maxAccelerationX
  maxAccelerationY=maxAccelerationY<y?y:maxAccelerationY
  maxAccelerationZ=maxAccelerationZ<z?z:maxAccelerationZ
  if(maxAccelerationX!==undefined){
    game.showErrorInformation(`x: ${maxAccelerationX}y: ${maxAccelerationY} z: ${maxAccelerationZ}`)
  }
}
function handleOrientationEvent(event) {
  const rotateDegrees = event.alpha; // alpha: rotation around z-axis
  const leftToRight = event.gamma; // gamma: left to right
  const frontToBack = event.beta; // beta: front back motion
  if (rotateDegrees != undefined && false) {
    game.showErrorInformation(
      `f/b: ${frontToBack?.toFixed(1)}, l/r: ${leftToRight?.toFixed(
        1
      )},rotate: ${rotateDegrees?.toFixed(1)}`
    );
    if (menu.matching) {
      gamepad.style.transform = `translateX(${-leftToRight / 2}px)`;
    }
    if (menu.pronouncing) {
      pronouncingContainer.style.transform = `translateX(${
        -leftToRight / 2
      }px)`;
    }
  }
}
document.addEventListener("DOMContentLoaded", init);
addEventListener("beforeunload", beforeUnloadListener, { capture: true });

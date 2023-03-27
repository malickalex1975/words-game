const url = "https://learnlangapp1.herokuapp.com/";
let currentLevel, maxLevel;
const levelContainer = document.querySelector(".level-container");
const buttonStart = document.querySelector(".button-start");
const loadingElement = document.querySelector(".loading");
const gamepad = document.querySelector(".gamepad-container");
let wordsArray = [];

class WordGame {
  constructor() {}
  getLevel() {
    if (localStorage.getItem("currentLevel")) {
      currentLevel = +localStorage.getItem("currentLevel");
    } else {
      this.setLevel(1);
    }
  }
  setLevel(level) {
    currentLevel = level;
    localStorage.setItem("currentLevel", level.toString());
  }
  getMaxLevel() {
    if (
      localStorage.getItem("maxLevel") &&
      localStorage.getItem("maxLevel") === "0"
    ) {
      maxLevel = +localStorage.getItem("maxLevel");
    } else {
      this.setMaxLevel(2);
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
    buttonStart.style.visibility = "hidden";
    gamepad.style.opacity = "0";
  }
  showButtonStart() {
    buttonStart.style.visibility = "visible";
  }
  hideButtonStart() {
    buttonStart.style.visibility = "hidden";
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
      this.hideButtonStart();
      this.startGame();
      this.hideLevelsContainer();
    });
  }
  startGame() {
    this.loadWords();
  }
  loadWords(page = 0) {
    this.showLoading(true);
    let URL = url + `words/?group=${currentLevel-1}&page=${page}`;
    fetch(URL)
      .then((response) => response.json())
      .then((arr) => (wordsArray = [...wordsArray, ...arr]))
      .then(() => {
        if (page < 29) {
          page++;
          setTimeout(() => this.loadWords(page));
        } else {
          this.showLoading(false);
          this.showGamepad()
          console.log(wordsArray);
        }
      });
  }
  showLoading(visibility){
    let v=visibility?'visible':'hidden';
    loadingElement.style.visibility=v
  }
}

const game = new WordGame();

function levelChooseHandler() {
  levelContainer.addEventListener("click", (e) => {
    let el = e.target;
    if (el.className.includes("level-element")) {
      let level = game.getElementLevel(el);
      if (level <= maxLevel) {
        vibrate('ordinary');
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
}
function wakeLock() {
  navigator.wakeLock.request("screen").catch(console.log);
  
 
}
function vibrate(type){
let pattern= type==='right'?[50,10,50]:type==='wrong'?[100,10,100]:[50];
navigator.vibrate(pattern)
}

document.addEventListener("DOMContentLoaded", init);

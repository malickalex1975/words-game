const url='https://learnlangapp1.herokuapp.com/'
let currentLevel, maxLevel;
const levelContainer = document.querySelector(".level-container");
const buttonStart = document.querySelector(".button-start");

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
    if (localStorage.getItem("maxLevel")) {
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
    buttonStart.addEventListener("click", () => {
      this.hideButtonStart();
      this.startGame();
      this.hideLevelsContainer();
    });
  }
  startGame() {}
}
const game = new WordGame();

function levelChooseHandler() {
  levelContainer.addEventListener("click", (e) => {
    let el = e.target;
    if (el.className.includes("level-element")) {
      let level = game.getElementLevel(el);
      if (level <= maxLevel) {
        game.chooseLevel(level);
      }
    }
  });
}

function init() {
  game.getLevel();
  game.getMaxLevel();
  game.showLevelsContainer();
  game.showLevels();
  levelChooseHandler();
  game.showButtonStart();
  game.handleButtonStart();
}
document.addEventListener("DOMContentLoaded", init);

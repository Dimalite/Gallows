

import puzzleList from "./modules/base.js";

const hangmanImages = [
  "../img/hangman/img_08.png",
  "../img/hangman/img_07.png",
  "../img/hangman/img_06.png",
  "../img/hangman/img_05.png",
  "../img/hangman/img_04.png",
  "../img/hangman/img_03.png",
  "../img/hangman/img_02.png",
  "../img/hangman/img_01.png",
];

let searchId = 1;
let searchObject, word, desc;
let numLevel = document.querySelector("#numLevel");
const allKeyboardLetters = document.querySelectorAll(".base .key");
const textInside = document.querySelector("#guess");
const cartoonImage = document.querySelector(".cartoonImg");

let btnPause = document.querySelector(".btn-pause");
btnPause.addEventListener("click", PAUSE);

const btnReset = document.querySelector(".btnReset");
btnReset.addEventListener("click", clearKeyboardAndPuzzle);

const btnRepeat = document.querySelector(".repeat");
btnRepeat.addEventListener("click", clearKeyboardAndPuzzle);

let star = document.querySelector(".stars");
let starPoint = 2;

function start(searchId, starPoint) {
  searchObject = puzzleList.find((puzzle) => puzzle.id == searchId);
  word = searchObject.word;
  desc = searchObject.desc;

  star.innerHTML = starPoint;
  console.log(word);
  // make a Description
  function makeDescription() {
    document.querySelector(".title").innerHTML = desc;
    numLevel.innerHTML = searchId;
  }
  // make  a word puzzle
  function makeWord() {
    for (let i = 0; i < word.length; i++) {
      const newDiv = document.createElement("p");
      newDiv.classList.add("hidden");
      newDiv.classList.add("hi");
      const newContent = document.createTextNode(word[i]);
      newDiv.appendChild(newContent);
      document.getElementById("guess").appendChild(newDiv);
    }
  }
  makeDescription();
  makeWord();
}
start(searchId, starPoint);

// keyboard events
let selectedLetter;
document.addEventListener("click", function handleClick(event) {
  const hasClass = event.target.classList.contains("key");
  let element = event.target;
  if (hasClass === true) {
    selectedLetter = event.target.innerHTML;

    if (word.indexOf(selectedLetter) === -1) {
      console.log("element doesn't exist");

      element.classList.add("wrong");
      changeImage();
    } else {
      console.log("element found");
      element.classList.add("right");
      checkAndAdd();
    }
  }
});


const children = textInside.childNodes;

function checkAndAdd() {
  children.forEach((li) => {
    if (li.innerText == selectedLetter) {
      li.classList.remove("hidden");
      li.classList.remove("hi");
      li.classList.add("sign");
    }
  });
  let underline = document.querySelector(".hi");
  if (!underline) {
    console.log("Well done"); ///        well done !!!       ///
    showNotification();
    cartoonImage.src = "../img/hangman/img_08.png";
    countPicture = 0;
    clearWordPuzzle();
    clearKeyboard();
    searchId++;
    starPoint = starPoint + 2;


    numLevel.innerHTML = searchId;
    start(searchId, starPoint);
  }
}

function clearWordPuzzle() {
  let element = document.getElementById("guess");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}


function showMe() {
  children.forEach((li) => {
    li.classList.remove("hidden");
    li.classList.remove("hi");
    li.classList.add("sign");
  });
}

btnRepeat.addEventListener("click", () => {
  document.querySelector(".keyboard").classList.toggle("not_display");
  document.querySelector("#gameStop").classList.toggle("not_display");
});

function clearKeyboard() {
  for (let i = 0; i < allKeyboardLetters.length; i++) {
    if (allKeyboardLetters[i].classList.contains("wrong")) {
      allKeyboardLetters[i].classList.remove("wrong");
    } else if (allKeyboardLetters[i].classList.contains("right")) {
      allKeyboardLetters[i].classList.remove("right");
    }
  }
}
// ====================== maybe go to another file ? +++++++++++++++++++++++
// Pause Block
const pauseBlock = document.querySelector(".pause");
document.querySelector(".btn-pause").addEventListener("click", PAUSE);

function PAUSE() {
  pauseBlock.classList.toggle("not_display");
  document.querySelector(".keyboard").classList.toggle("not_display");
}
// Pause Block

// Changing images of the gallows
let countPicture = -1;
function changeImage() {
  if (countPicture == 6) {
    document.querySelector(".keyboard").classList.toggle("not_display");
    document.querySelector("#gameStop").classList.toggle("not_display");
    btnPause.removeEventListener("click", PAUSE, false);
    showMe();
  }
  countPicture++;
  cartoonImage.src = hangmanImages[countPicture];
  cartoonImage.alt = "hangman";
}
changeImage();

let overGameBlock = document.querySelector("#gameStop");


function clearKeyboardAndPuzzle() {
  children.forEach((li) => {
    if (li.innerText) {
      li.classList.add("hidden");
      li.classList.add("hi");
      li.classList.remove("sign");
    }
  });

  clearKeyboard();
  cartoonImage.src = "../img/img_08.png";
  countPicture = 0;
  // if (isHidden(overGameBlock)) {
  //   document.querySelector(".keyboard").classList.toggle("not_display");
  //   document.querySelector("#gameStop").classList.toggle("not_display");
  // }
}

// next level processing
let clockTimeout = null;
function showNotification() {
  document.getElementById("nextLevel").style.display = "block";
  clearTimeout(clockTimeout);
  clockTimeout = setTimeout(() => {
    document.getElementById("nextLevel").style.display = "none";
  }, 1500);

  // setInterval(function () {
  //   document.querySelector(".keyboard").classList.toggle("not_display");
  //   document.querySelector("#nextLevel").classList.toggle("not_display");
  // }, 3000);
}

// hint
let run = children.length; // longitude of the guess word
function hint(starPoint) {
  starPoint = starPoint - 1;
  star.innerHTML = starPoint;
  if (starPoint >= 0) {
    let getNotRepeatRandomNumber = (min, max) => {
      let lastNumber;
      const getRandomNumber = () =>
        Math.floor(min + Math.random() * (max - min));
      const result = () => {
        const number = getRandomNumber();
        if (number === lastNumber) {
          return result();
        }
        lastNumber = number;
        return number;
      };
      return result;
    };

    const getRandomNumber = getNotRepeatRandomNumber(0, run);
    let numberLetter = getRandomNumber();

    if (!children[numberLetter].classList.contains("sign")) {
      children[numberLetter].classList.remove("hidden");
      children[numberLetter].classList.remove("hi");
      children[numberLetter].classList.add("sign");
    }
  } else {
    btnHint.classList.remove("hint");
    console.log(btnHint);
  }
}

const isHidden = (elem) => {
  const styles = window.getComputedStyle(elem);
  return styles.display === "block";
};
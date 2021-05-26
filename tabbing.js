"use strict";

export function checkForTab(event) {
  if (event.key == "Tab") {
    setTimeout(tabKeyPressed, 1);
  }
}

function tabKeyPressed() {
  const focusedElement = document.querySelector(":focus");

  if (focusedElement.classList.contains("next")) {
    document.addEventListener("keydown", preventTabbing);
  } else {
    document.removeEventListener("keydown", preventTabbing);
  }
}

function preventTabbing(event) {
  const focusedElement = document.querySelector(":focus");
  if (focusedElement !== null && focusedElement.classList.contains("next")) {
    event.preventDefault();
    console.log("hehehe");
  }
}

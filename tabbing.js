"use strict";

//This module checks wether the currently focused element, contains the class .next.
//If it is, we preventDefault on tab-navigation, to prevent the form breaks. - and this is a bit cryptic

export function checkForTab(event) {
  if (event.key == "Tab") {
    //Targetting the :focus element in this function, actually returns the previously :focused element.
    //Therefore we need the event to fire, before targetting :focus elm.
    //We choosed setTimeout for this.
    setTimeout(tabKeyPressed, 1);
  }
}

function tabKeyPressed() {
  const focusedElement = document.querySelector(":focus");

  //Because this function is started after the event is fired, we cant preventDefault.
  //Therefore we set up a new event.
  if (focusedElement.classList.contains("next")) {
    document.addEventListener("keydown", reFocusTabbing);
  } else {
    document.removeEventListener("keydown", reFocusTabbing);
  }
}

//sets focus on the first input elm in current fieldset.
function reFocusTabbing(event) {
  event.preventDefault();
  event.target.parentElement.parentElement.querySelector("input").focus();
}

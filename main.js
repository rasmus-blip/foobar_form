"use strict";

import "./sass/style.scss";
import { setUpOrderForm } from "./order_form.js";
import { setUpAccountCreation } from "./create_account.js";
import Inputmask from "inputmask";
import { checkForTab } from "./tabbing.js";

window.addEventListener("DOMContentLoaded", init);

function init() {
  //Interface height for mobile devices - 100vh in css causes scroll
  setHeight();
  window.addEventListener("resize", setHeight);

  setTheming();
  setInterval(setTheming, 5000);

  // Building a tab-navgation logic.
  document.addEventListener("keydown", checkForTab);

  // Damage control - so pressign enter doesnt break the form. TO FIX..
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  // Input masking on credit card inputs
  const cardNrMask = new Inputmask(`9999 9999 9999 9999`);
  const exprDateMask = new Inputmask(`99/99`);
  const cvvMask = new Inputmask(`999`);

  const allCardNrInputs = document.querySelectorAll(`[name="card_number"]`);
  allCardNrInputs.forEach((input) => {
    cardNrMask.mask(input);
  });

  const allExprDateInputs = document.querySelectorAll(`[name="exp_date"]`);
  allExprDateInputs.forEach((input) => {
    exprDateMask.mask(input);
  });

  const allCvvInputs = document.querySelectorAll(`[name="cvv"]`);
  allCvvInputs.forEach((input) => {
    cvvMask.mask(input);
  });

  // Setup on forms
  setUpOrderForm();
  setUpAccountCreation();
}

function setTheming() {
  const hours = new Date().getHours();
  if (hours >= 18 || hours <= 6) {
    document.querySelector("body").classList.add("darkmode");
  } else {
    document.querySelector("body").classList.remove("darkmode");
  }
}

function setHeight() {
  //calculates the size of one vh-unit
  const newVh = window.innerHeight * 0.01;
  document.querySelector("body").style.setProperty("--custom-vh", `${newVh * 100}px`);
}

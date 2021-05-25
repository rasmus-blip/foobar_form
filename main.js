"use strict";

import "./sass/style.scss";
import { initialSlideCalc } from "./fieldset_change.js";
import { slideFieldset } from "./fieldset_change.js";

import { getBeersOnTap } from "./order_form";
import { appendOrderList } from "./order_form";

import { buildOrderList } from "./order_submition.js";
import { submitOrder } from "./order_submition.js";

import { setUpAccountCreation } from "./create_account.js";

import { prepareSignInRequest } from "./sign_in.js";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  //Calc length of the form-sliders initally
  initialSlideCalc("order_form");
  initialSlideCalc("account_form");

  //Prevent btn-clicks from validation the form
  preventBtnValidation();

  //Set up back-btn functionality
  setUpBackBtns("order_form");
  setUpBackBtns("account_form");

  setUpSignInField();

  function setUpSignInField() {
    //SIGN IN
    const signInBtn = document.querySelector("#sign_in .submit");
    signInBtn.addEventListener("click", prepareSignInRequest);

    //CREATE ACCOUNT
    const createAccBtn = document.querySelector(".create_acc");
    createAccBtn.addEventListener("click", () => {
      setUpAccountCreation();
      document.querySelector("body").style.transform = "translateY(-100%)";
      document.querySelector("#account_form").hidden = false;
    });

    //ORDER WITHOUT ACCOUNT
    const noAccountBtn = document.querySelector(".no_sign_in");
    noAccountBtn.addEventListener("click", (e) => {
      getBeersOnTap();
      slideFieldset(e.target, "order_form");
    });
  }

  //NEXT BTN in order-field
  const orderNextBtn = document.querySelector("#order .next");
  orderNextBtn.addEventListener("click", (e) => {
    const orderList = buildOrderList();
    appendOrderList(orderList);
    if (orderList.length > 0) {
      slideFieldset(e.target, "order_form");
    } else {
      triggerOrderError();
    }
  });

  //NEXT BTN in your-order-field
  const yourOrderNextBtn = document.querySelector("#your_order .next");
  yourOrderNextBtn.addEventListener("click", (e) => {
    slideFieldset(e.target, "order_form");
  });

  //SUBMIT ORDER BTNS
  document.querySelector("#your_order .submit").addEventListener("click", submitOrder);
  document.querySelector("#checkout button").addEventListener("click", submitOrder);
}

function triggerOrderError() {
  document.querySelector("#order p").classList.remove("error");
  document.querySelector("#order p").offsetHeight;
  document.querySelector("#order p").classList.add("error");
}

function preventBtnValidation() {
  //prevent buttons from form-validation on click
  const allBtns = document.querySelectorAll("button");
  allBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
}

function setUpBackBtns(form) {
  const allBackBtns = document.querySelectorAll(`#${form} .back`);
  allBackBtns.forEach((bckBtn) => {
    bckBtn.addEventListener("click", () => {
      slideFieldset(bckBtn, form);
    });
  });
}

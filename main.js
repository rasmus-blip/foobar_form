"use strict";

import "./sass/style.scss";
import { initialSlideCalc } from "./fieldset_change.js";
import { slideFieldset } from "./fieldset_change.js";

import { appendOrderList } from "./order_form";
import { setUpSignInField } from "./order_form";

import { buildOrderList } from "./order_submition.js";
import { submitOrder } from "./order_submition.js";

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

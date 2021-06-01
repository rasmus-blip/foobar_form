"use strict";

import "./sass/style.scss";
import { initialSlideCalc, slideFieldset } from "./fieldset_slide.js";
import { buildOrderList, submitOrder } from "./order_submition.js";
import { prepareSignInRequest, getAccInfo } from "./sign_in.js";
import { getJSON } from "./rest_actions.js";
import { creditCardValidation } from "./card_validation.js";

export function setUpOrderForm() {
  initialSlideCalc("order_form");
  preventBtnValidation();
  setUpBackBtns("order_form");
  setUpSignInField();
  setUpOrderNextBtn();

  //NEXT BTN in your-order-field
  const yourOrderNextBtn = document.querySelector("#your_order .next");
  yourOrderNextBtn.addEventListener("click", (e) => {
    slideFieldset(e.target, "order_form");
  });

  //SUBMIT ORDER BTNS
  document.querySelector("#your_order .submit").addEventListener("click", submitReqFromYourOrder);
  document.querySelector("#checkout button").addEventListener("click", submitReqFromCheckout);
}

//
//
//
//
// SIGN-IN - FIELDSET
function setUpSignInField() {
  //SIGN IN
  const signInBtn = document.querySelector("#sign_in .submit");
  signInBtn.addEventListener("click", prepareSignInRequest);

  //CREATE ACCOUNT
  const createAccBtn = document.querySelector(".create_acc");
  createAccBtn.addEventListener("click", () => {
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

//
//
//
//
// ORDER - FIELDSET
// Gets array of the beers on tap from the backend
export async function getBeersOnTap() {
  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  const jsonData = await getJSON(url, "headersHeroku");
  const taps = jsonData.taps;

  appendBeers(taps);
}

// Append each beers on tap to the fieldset
function appendBeers(taps) {
  const container = document.querySelector("#beer_container");
  container.innerHTML = "";
  const temp = document.querySelector("#beer_temp");

  taps.forEach((tap) => {
    const convertedBeerName = convertBeerString(tap.beer);

    //Only appen if beer doesnt already exist
    if (document.querySelector(`#${convertedBeerName}`) === null) {
      const klon = temp.cloneNode(true).content;

      klon.querySelector("img").src = `./images/${convertedBeerName}.png`;
      klon.querySelector("img").setAttribute("alt", tap.beer);
      klon.querySelector("label").textContent = tap.beer;
      klon.querySelector("label").setAttribute("for", convertedBeerName);
      klon.querySelector("input").setAttribute("id", convertedBeerName);
      klon.querySelector("input").setAttribute("name", tap.beer);
      klon.querySelector(".minus").addEventListener("click", setAmountClicked);
      klon.querySelector(".plus").addEventListener("click", setAmountClicked);

      container.appendChild(klon);
    }
  });
}

// Returns the name of beer without space " ". (for attributes)
function convertBeerString(beerName) {
  const noSpace = beerName.replaceAll(" ", "");
  const result = noSpace.toLowerCase();
  return result;
}

//Sets up functionality for adding / removing amount of beers you want to order
function setAmountClicked() {
  const theInput = this.parentElement.querySelector("input");
  if (this.classList.contains("minus") && theInput.value >= 1) {
    theInput.value--;
  } else if (this.classList.contains("plus")) {
    theInput.value++;
    document.querySelector("#order p").classList.remove("error");
  }
}

// Validates if amount of beers selected > 0, berfore sliding to next fieldset
function setUpOrderNextBtn() {
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
}

//Triggers error (when amount of beers selected == 0)
function triggerOrderError() {
  document.querySelector("#order p").classList.remove("error");
  document.querySelector("#order p").offsetHeight;
  document.querySelector("#order p").classList.add("error");
}

//
//
//
//
// YOUR ORDER - FIELDSET
function appendOrderList(orderList) {
  const container = document.querySelector("#order_container");
  container.innerHTML = "";
  const temp = document.querySelector("#order_temp");

  let toPay = 0;

  orderList.forEach((order) => {
    const klon = temp.cloneNode(true).content;
    const convertedBeerName = convertBeerString(order.name);

    klon.querySelector("img").src = `./images/${convertedBeerName}.png`;
    klon.querySelector("img").setAttribute("alt", order.name);
    klon.querySelector("h2").textContent = order.name;
    klon.querySelector("p").textContent = order.amount;

    container.appendChild(klon);

    toPay += order.amount * 40;
  });

  document.querySelector("#your_order p span").textContent = toPay + "DKK";

  if (document.querySelector("#checkout")) {
    document.querySelector("#checkout p span").textContent = toPay + "DKK";
  }
}

// Gets the user data from the variable in sign_in.js, and validates the credit card info.
// Then submits the order
function submitReqFromYourOrder() {
  this.removeEventListener("click", submitReqFromYourOrder);
  const accInfo = getAccInfo();
  const cardInfo = {
    number: accInfo.card_number,
    expDate: accInfo.expiration_date,
    cvv: accInfo.cvv,
  };
  console.log(cardInfo);

  const isValid = creditCardValidation(cardInfo);

  if (isValid) {
    submitOrder();
  } else {
    this.addEventListener("click", submitReqFromYourOrder);
    alert("Ouch.... are you trying to hack the system??");
  }
}

//
//
//
// CHECKOUT - FIELDSET
function submitReqFromCheckout() {
  this.removeEventListener("click", submitReqFromCheckout);

  const cardInfo = {
    number: document.querySelector(`#checkout [name="card_number"]`).value,
    expDate: document.querySelector(`#checkout [name="exp_date" ]`).value,
    cvv: document.querySelector(`#checkout [name="cvv" ]`).value,
  };

  const isValid = creditCardValidation(cardInfo);

  if (isValid) {
    submitOrder();
  } else {
    //apply error
    document.querySelector("#checkout .top p").classList.remove("error");
    document.querySelector("#checkout .top p").offsetHeight;
    document.querySelector("#checkout .top p").classList.add("error");

    //Eventlisteners on all inputs to for removing error again when clicking
    const allInPuts = document.querySelectorAll("#checkout input");
    allInPuts.forEach((input) => {
      input.addEventListener("click", () => document.querySelector("#checkout .top p").classList.remove("error"));
    });

    this.addEventListener("click", submitReqFromCheckout);
  }
}

//
//
// General
// prevent buttons from form-validation on click
function preventBtnValidation() {
  const allBtns = document.querySelectorAll("button");
  allBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
}

//Set up backBtns, so form shows previous fieldset.
export function setUpBackBtns(form) {
  const allBackBtns = document.querySelectorAll(`#${form} .back`);
  allBackBtns.forEach((bckBtn) => {
    bckBtn.addEventListener("click", () => {
      slideFieldset(bckBtn, form);
    });
  });
}

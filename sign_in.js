"use strict";
import { getBeersOnTap } from "./order_form.js";
import { getJSON } from "./rest_actions";
import { initialSlideCalc } from "./fieldset_change";

let signedIn = false;
const accInfo = {};

// Gets data for the sign in request, and detemerines what to do depending on sign in result
export async function prepareSignInRequest() {
  this.removeEventListener("click", prepareSignInRequest);
  document.querySelector("#order_form .loading").classList.add("load");
  document.querySelector("#order_form .loading p").textContent = "Requesting sign in...";
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const signInResult = await requestSignIn(username, password);
  document.querySelector("#order_form .loading").classList.remove("load");

  if (signInResult === false) {
    this.addEventListener("click", prepareSignInRequest);
    console.log("bad sign in request");
  } else {
    signInComplete(signInResult);
  }
}

// if succes, returns userdata, else return false
async function requestSignIn(username, password) {
  const url = `https://frontendspring2021-a6f0.restdb.io/rest/foobar-user-database?q={"user_name": "${username}", "password": "${password}"}`;
  const jsonData = await getJSON(url, "headersRestDB");
  if (jsonData.length === 0) {
    return false;
  } else {
    return jsonData;
  }
}

// Removes the sign in & card info fieldsets and reCalcs the order-forms slide-width
export function signInComplete(userData) {
  signedIn = true;
  accInfo.user = userData.user_name;
  document.querySelector("#sign_in").remove();
  document.querySelector("#checkout").remove();
  document.querySelector("#your_order .submit").style.display = "block";
  document.querySelector("#your_order .next").style.display = "none";
  document.querySelector("#order .back").style.display = "none";
  initialSlideCalc("order_form");
  getBeersOnTap();
}

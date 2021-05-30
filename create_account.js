"use strict";
import { post, getJSON } from "./rest_actions.js";
import { signInComplete } from "./sign_in.js";
import { slideFieldset, initialSlideCalc } from "./fieldset_slide.js";
import { setUpBackBtns } from "./order_form.js";
import { creditCardValidation } from "./card_validation.js";

export function setUpAccountCreation() {
  initialSlideCalc("account_form");
  setUpBackBtns("account_form");
  document.querySelector("#account_details .next").addEventListener("click", validateAccDetails);
  document.querySelector("#card_details .submit").addEventListener("click", prepareSubmitRequest);
}

//
//
//
//
// Account details validation
async function validateAccDetails(e) {
  const syntaxReqMet = checkSyntaxRequirements();

  if (syntaxReqMet) {
    document.querySelector("#account_form .loading").classList.add("load");
    document.querySelector("#account_form .loading p").textContent = "Validating email and username...";
    const isUnique = await doesAccountExist();
    document.querySelector("#account_form .loading").classList.remove("load");

    if (isUnique) {
      slideFieldset(e.target, "account_form");
    }
  }
}

// Returns true or false, wheter account details requirements are met. if a field fails, it displays an error.
function checkSyntaxRequirements() {
  //USERNAME
  const usernameIsValid = document.querySelector("#username_create").checkValidity();
  if (usernameIsValid === false) {
    document.querySelector(".error_span.username").textContent = "Username must be at least 4 characters";
    document.querySelector(".error_span.username").classList.add("error");
    document.querySelector("#username_create").addEventListener("click", rmError);
  }

  //Email
  const emailIsValid = document.querySelector("#email").checkValidity();
  if (emailIsValid === false) {
    document.querySelector(".error_span.email").textContent = "Please enter a valid email";
    document.querySelector(".error_span.email").classList.add("error");
    document.querySelector("#email").addEventListener("click", rmError);
  }

  //PASSWORD
  const passwordIsValid = document.querySelector("#password_create").checkValidity();
  if (passwordIsValid === false) {
    document.querySelector(".error_span.password_create").textContent = "Password must be at least 4 characters";
    document.querySelector(".error_span.password_create").classList.add("error");
    document.querySelector("#password_create").addEventListener("click", rmError);
  }

  //ARE PASSWORDS IDENTICAL
  const firstPassword = document.querySelector("#password_create").value;
  const secondPassword = document.querySelector("#repeat_password").value;
  const identicalPasswords = firstPassword === secondPassword;
  if (identicalPasswords === false) {
    document.querySelector(".error_span.password").textContent = "Passwords are not identical";
    document.querySelector(".error_span.password").classList.add("error");
    document.querySelector("#repeat_password").addEventListener("click", rmError);
  }

  if (usernameIsValid && emailIsValid && passwordIsValid && identicalPasswords) {
    return true;
  } else {
    return false;
  }
}

// Returns true or false, wheter if username or emeail already is registered.
async function doesAccountExist() {
  //Check if email // username are already registered
  //USERNAME
  const username = document.querySelector("#username_create").value;
  const userNameExists = await checkForAccount("user_name", username);
  if (userNameExists === true) {
    document.querySelector(".error_span.username").textContent = "Username is already taken";
    document.querySelector(".error_span.username").classList.add("error");
    document.querySelector("#username_create").addEventListener("click", rmError);
  }

  //EMAIL
  const email = document.querySelector("#email").value;
  const emailExists = await checkForAccount("email", email);
  //if the email is not unique an error message will appear
  if (emailExists === true) {
    document.querySelector(".error_span.email").textContent = "Email is not valid";
    document.querySelector(".error_span.email").classList.add("error");
    document.querySelector("#email").addEventListener("click", rmError);
  }

  //if the username and email is unique to the database the two passwords are identical, procede your quest
  if (userNameExists === false && emailExists === false) {
    return true;
  } else {
    return false;
  }
}

// Displays succes screen when account is created
function displaySuccesScreen(response) {
  document.querySelector("#succes_screen span").textContent = response.user_name;
  document.querySelector("#succes_screen").classList.add("show");
}

// Clicking on input-fields, removes its error-message.
function rmError() {
  this.removeEventListener("click", rmError);
  const errorSpan = this.parentElement.parentElement.querySelector(".error");
  errorSpan.textContent = "";
  errorSpan.classList.remove("error");
}

// Returns true / false whether property and value is already registered in RestDb.
async function checkForAccount(property, value) {
  const url = `https://frontendspring2021-a6f0.restdb.io/rest/foobar-user-database?q={"${property}": "${value}"}`;
  const jsonData = await getJSON(url, "headersRestDB");
  if (jsonData.length === 1) {
    return true;
  } else {
    return false;
  }
}

//
//
//
// Submit account
// Controller for submitting an account.
async function prepareSubmitRequest() {
  // validates credit card info
  this.removeEventListener("click", prepareSubmitRequest);

  const cardInfo = {
    number: document.querySelector(`#card_details [name="card_number"]`).value,
    expDate: document.querySelector(`#card_details [name="exp_date" ]`).value,
    cvv: document.querySelector(`#card_details [name="cvv" ]`).value,
  };

  const isValid = creditCardValidation(cardInfo);

  // Not valid -> show error
  if (isValid === false) {
    document.querySelector("#card_details .top p").classList.remove("error");
    document.querySelector("#card_details .top p").offsetHeight;
    document.querySelector("#card_details .top p").classList.add("error");

    const allInputs = document.querySelectorAll("#card_details input");
    allInputs.forEach((input) => {
      input.addEventListener("click", () => document.querySelector("#card_details .top p").classList.remove("error"));
    });
    this.addEventListener("click", prepareSubmitRequest);

    // Valid -> Post account to RestDb
  } else {
    document.querySelector("#account_form .loading").classList.add("load");
    document.querySelector("#account_form .loading p").textContent = "Creating account...";
    const response = await submitAccount();
    document.querySelector("#account_form .loading").classList.remove("load");

    // Just to be sure we dont have a server error in the backend
    if (response.status) {
      this.addEventListener("click", prepareSubmitRequest);
      alert("Oups... something is not completely right... pls reload");
    } else {
      displaySuccesScreen(response);
      signInComplete(response);
      setTimeout(() => {
        document.querySelector("body").style.transform = "translateY(0)";
      }, 3000);
    }
  }
}

// Post request for account details. Returns the result of the request.
async function submitAccount() {
  const dataToPost = {
    user_name: document.querySelector("#username_create").value,
    email: document.querySelector("#email").value,
    password: document.querySelector("#password_create").value,
    card_number: document.querySelector("#account_card_number").value,
    expiration_date: document.querySelector("#account_exp_date").value,
    cvv: document.querySelector("#account_cvv").value,
  };
  const url = "https://frontendspring2021-a6f0.restdb.io/rest/foobar-user-database";

  const result = await post(dataToPost, url, "headersRestDB");
  return result;
}

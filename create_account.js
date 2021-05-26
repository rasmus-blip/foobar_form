"use strict";
import { post, getJSON } from "./rest_actions.js";
import { signInComplete } from "./sign_in.js";
import { slideFieldset } from "./fieldset_change.js";

export function setUpAccountCreation() {
  document.querySelector("#account_details .next").addEventListener("click", validateAccDetails);
  document.querySelector("#card_details .submit").addEventListener("click", prepareSubmitRequest);
}

//
//
// Account details validation
async function validateAccDetails() {
  const syntaxReqMet = checkSyntaxRequirements();

  if (syntaxReqMet) {
    const isUnique = doesAccountExist();

    if (isUnique) {
      slideFieldset(e.target, "account_form");
    }
  }
}

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

function displaySuccesScreen(response) {
  document.querySelector("#succes_screen span").textContent = response.user_name;
  document.querySelector("#succes_screen").classList.add("show");
}

function rmError() {
  this.removeEventListener("click", rmError);
  const errorSpan = this.parentElement.parentElement.querySelector(".error");
  errorSpan.textContent = "";
  errorSpan.classList.remove("error");
}

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
// Submit account

async function prepareSubmitRequest() {
  //TODO: validate credit card
  const response = await submitAccount();
  if (response.status) {
    alert("Oups... something is not completely right... pls reload");
  } else {
    displaySuccesScreen(response);
    signInComplete(response);
    setTimeout(() => {
      document.querySelector("body").style.transform = "translateY(0)";
    }, 3000);
  }
}

async function submitAccount() {
  const dataToPost = {
    user_name: document.querySelector("#username_create").value,
    email: document.querySelector("#email").value,
    password: document.querySelector("#password_create").value,
    card_number: document.querySelector("#account_card_number").value,
    expiration_date: document.querySelector("#account_exp_date").value,
    cvv: document.querySelector("#account_cvv"),
  };
  const url = "https://frontendspring2021-a6f0.restdb.io/rest/foobar-user-database";

  const result = await post(dataToPost, url, "headersRestDB");
  return result;
}

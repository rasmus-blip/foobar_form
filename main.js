import "./sass/style.scss";
import { post } from "./rest_actions.js";
import { getJSON } from "./rest_actions.js";
import { initialSlideCalc } from "./fieldset_change.js";
import { slideFieldset } from "./fieldset_change.js";

let signedIn = false;
const accInfo = {};

let orderList = [];

window.addEventListener("DOMContentLoaded", init);

async function init() {
  initialSlideCalc("order_form");
  initialSlideCalc("account_form");

  //prevent buttons from form-validation on click
  const allBtns = document.querySelectorAll("button");
  allBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  const backButtonsOrder = document.querySelectorAll("#order_form .back");
  backButtonsOrder.forEach((bckBtn) => {
    bckBtn.addEventListener("click", () => {
      slideFieldset(bckBtn, "order_form");
    });
  });

  const backButtonsAccount = document.querySelectorAll("#account_form .back");
  backButtonsAccount.forEach((bckBtn) => {
    bckBtn.addEventListener("click", () => {
      slideFieldset(bckBtn, "account_form");
    });
  });

  //for order form

  document.querySelector("#sign_in .submit").addEventListener("click", async (e) => {
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const signInResult = await requestSignIn(username, password);
    if (signInResult === false) {
      console.log("bad sign in request");
    } else {
      signInComplete(signInResult);
    }
  });

  document.querySelector(".create_acc").addEventListener("click", (e) => {
    document.querySelector("#account_form").hidden = false;
    document.querySelector("body").style.transform = "translateY(-100%)";
  });

  document.querySelector(".no_sign_in").addEventListener("click", (e) => {
    getBeersOnTap();
    slideFieldset(e.target, "order_form");
  });

  document.querySelector("#order .next").addEventListener("click", (e) => {
    buildOrderList();
    if (orderList.length > 0) {
      slideFieldset(e.target, "order_form");
    } else {
      triggerOrderError();
    }
  });

  document.querySelector("#your_order .next").addEventListener("click", (e) => {
    slideFieldset(e.target, "order_form");
  });

  document.querySelector("#your_order .submit").addEventListener("click", async () => {
    const result = await submitOrders();
    if (result.status === 200) {
      orderSubmitted(result.id);
    } else {
      alert("Oupss, this i not how its supposed to work...");
    }
  });

  document.querySelector("#checkout button").addEventListener("click", async () => {
    const result = await submitOrders();
  });

  //for account form
  document.querySelector("#account_details .next").addEventListener("click", async (e) => {
    //Check syntax requirements
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

    //If the basic requirements are met, check if account exist
    if (identicalPasswords && usernameIsValid && emailIsValid && passwordIsValid) {
      //Check if email // username are already registered
      //USERNAME
      const username = document.querySelector("#username_create").value;
      const userNameExists = await checkAccount("user_name", username);
      if (userNameExists === true) {
        document.querySelector(".error_span.username").textContent = "Username is already taken";
        document.querySelector(".error_span.username").classList.add("error");
        document.querySelector("#username_create").addEventListener("click", rmError);
      }

      //EMAIL
      const email = document.querySelector("#email").value;
      const emailExists = await checkAccount("email", email);
      //if the email is not unique an error message will appear
      if (emailExists === true) {
        document.querySelector(".error_span.email").textContent = "Email is not valid";
        document.querySelector(".error_span.email").classList.add("error");
        document.querySelector("#email").addEventListener("click", rmError);
      }

      //if the username and email is unique to the database the two passwords are identical, procede your quest
      if (userNameExists === false && emailExists === false) {
        slideFieldset(e.target, "account_form");
      }
    }
  });

  document.querySelector("#card_details .submit").addEventListener("click", async (e) => {
    //validate credit card

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
  });
}

function signInComplete(userData) {
  signedIn = true;
  accInfo.user = userData.user_name;
  document.querySelector("#sign_in").remove();
  document.querySelector("#checkout").remove();
  document.querySelector("#your_order .submit").hidden = false;
  document.querySelector("#your_order .next").style.display = "none";
  document.querySelector("#order .back").style.display = "none";
  initialSlideCalc("order_form");
  getBeersOnTap();
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

async function checkAccount(property, value) {
  const url = `https://frontendspring2021-a6f0.restdb.io/rest/foobar-user-database?q={"${property}": "${value}"}`;
  const jsonData = await getJSON(url, "headersRestDB");
  if (jsonData.length === 1) {
    return true;
  } else {
    return false;
  }
}

async function requestSignIn(username, password) {
  const url = `https://frontendspring2021-a6f0.restdb.io/rest/foobar-user-database?q={"user_name": "${username}", "password": "${password}"}`;
  const jsonData = await getJSON(url, "headersRestDB");
  if (jsonData.length === 0) {
    return false;
  } else {
    return jsonData;
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

function triggerOrderError() {
  document.querySelector("#order p").classList.remove("error");
  document.querySelector("#order p").offsetHeight;
  document.querySelector("#order p").classList.add("error");
}

async function getBeersOnTap() {
  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  const jsonData = await getJSON(url, "headersHeroku");
  const taps = jsonData.taps;

  appendBeers(taps);
}

function appendBeers(taps) {
  const container = document.querySelector("#beer_container");
  container.innerHTML = "";
  const temp = document.querySelector("#beer_temp");

  taps.forEach((tap) => {
    const convertedBeerName = convertBeerString(tap.beer);

    //Only appen if beer doesnt already exist
    if (document.querySelector(`#${convertedBeerName}`) === null) {
      const klon = temp.cloneNode(true).content;

      //   klon.querySelector("img").src = `./images/${}`
      //   klon.querySelector("img").setAttribute("alt", beer.beer);
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

function convertBeerString(beerName) {
  const noSpace = beerName.replaceAll(" ", "");
  const result = noSpace.toLowerCase();
  return result;
}

function setAmountClicked() {
  const theInput = this.parentElement.querySelector("input");
  if (this.classList.contains("minus") && theInput.value >= 1) {
    theInput.value--;
  } else if (this.classList.contains("plus")) {
    theInput.value++;
    document.querySelector("#order p").classList.remove("error");
  }
}

function buildOrderList() {
  const allInputs = document.querySelectorAll("#order input");
  orderList = [];

  allInputs.forEach((elm) => {
    if (elm.value > 0) {
      const theObject = { name: elm.name, amount: elm.value };
      orderList.push(theObject);
    }
  });

  appendOrderList();
}

function appendOrderList() {
  const container = document.querySelector("#order_container");
  container.innerHTML = "";
  const temp = document.querySelector("#order_temp");

  let toPay = 0;

  orderList.forEach((order) => {
    const klon = temp.cloneNode(true).content;
    const convertedBeerName = convertBeerString(order.name);

    // klon.querySelector("img").src = convertedBeerName;
    // klon.querySelector("img").setAttribute("alt", order.beer);

    klon.querySelector("h2").textContent = order.name;
    klon.querySelector("p").textContent = order.amount;

    container.appendChild(klon);

    toPay += order.amount * 40;
  });

  document.querySelector("#your_order p span").textContent = toPay + "DKK";

  if (signedIn === false) {
    document.querySelector("#checkout p span").textContent = toPay + "DKK";
  }
}

async function submitOrders() {
  const url = "https://foobarfirefjerdedele.herokuapp.com/order";
  const submitResult = await post(orderList, url, "headersHeroku");
  return submitResult;
}

async function orderSubmitted(id) {
  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  const data = await getJSON(url, "headersHeroku");
  const queue = data.queue;
  const serving = data.serving.map((elm) => elm.id);

  const queueNr = getPlaceInQueue(queue, id);
  if (queueNr > 0) {
    document.querySelector("#order_submitted span").textContent = queueNr;
    document.querySelector("#order_submitted").classList.add("show");

    setTimeout(() => {
      orderSubmitted(id);
    }, 1000);
  } else if (serving.includes(id)) {
    document.querySelector("#order_submitted p").textContent = "Your order is getting prepared";
    document.querySelector("#order_submitted").classList.add("show");

    setTimeout(() => {
      orderSubmitted(id);
    }, 1000);
  } else {
    document.querySelector("#order_submitted p").textContent = "Your order is ready";
    document.querySelector("#order_submitted p").nextSibling.remove();
    document.querySelector("#order_submitted").classList.add("show");
  }
}

function getPlaceInQueue(queue, id) {
  let result = 0;

  queue.forEach((order) => {
    if (order.id <= id) {
      result++;
    }
  });

  return result;
}

import "./sass/style.scss";
import { post } from "./rest_actions.js";
import { getJSON } from "./rest_actions.js";
import { initialSlideCalc } from "./fieldset_change.js";
import { slideFieldset } from "./fieldset_change.js";

let orderList = [];

window.addEventListener("DOMContentLoaded", init);

async function init() {
  initialSlideCalc();
  //prevent buttons from form-validation on click
  const allBtns = document.querySelectorAll("button");
  allBtns.forEach((btn) => {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  //   const nextButtons = document.querySelectorAll(".next");
  //   nextButtons.forEach((nxtBtn) => {
  //     nxtBtn.addEventListener("click", () => {
  //       slideFieldset(nxtBtn);
  //     });
  //   });

  const backButtons = document.querySelectorAll(".back");
  backButtons.forEach((bckBtn) => {
    bckBtn.addEventListener("click", () => {
      slideFieldset(bckBtn);
    });
  });

  document.querySelector(".no_sign_in").addEventListener("click", (e) => {
    getBeersOnTap();
    slideFieldset(e.target);
  });

  document.querySelector("#order .next").addEventListener("click", (e) => {
    buildOrderList();
    if (orderList.length > 0) {
      slideFieldset(e.target);
    } else {
      triggerOrderError();
    }
  });

  document.querySelector("#your_order .next").addEventListener("click", (e) => {
    slideFieldset(e.target);
  });

  document.querySelector("#checkout button").addEventListener("click", submitOrders);
}

function triggerOrderError() {
  document.querySelector("#order p").classList.remove("error");
  document.querySelector("#order p").offsetHeight;
  document.querySelector("#order p").classList.add("error");
}

async function getBeersOnTap() {
  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  const jsonData = await getJSON(url);
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
      const theObject = { beer: elm.name, amount: elm.value };
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
    const convertedBeerName = convertBeerString(order.beer);

    // klon.querySelector("img").src = convertedBeerName;
    // klon.querySelector("img").setAttribute("alt", order.beer);

    klon.querySelector("h2").textContent = order.beer;
    klon.querySelector("p").textContent = order.amount;

    container.appendChild(klon);

    toPay += order.amount * 40;
  });

  document.querySelector("#your_order p span").textContent = toPay + "DKK";
  document.querySelector("#checkout p span").textContent = toPay + "DKK";
}

async function submitOrders() {
  console.log(orderList);
  const url = "https://foobarfirefjerdedele.herokuapp.com/order";
  const payLoad = [{ name: "GitHop", amount: 1 }];
  const submitResult = await post(payLoad, url);
  console.log(submitResult.id);
}

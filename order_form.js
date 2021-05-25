"use strict";
import { getJSON } from "./rest_actions.js";

export async function getBeersOnTap() {
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

function setAmountClicked() {
  const theInput = this.parentElement.querySelector("input");
  if (this.classList.contains("minus") && theInput.value >= 1) {
    theInput.value--;
  } else if (this.classList.contains("plus")) {
    theInput.value++;
    document.querySelector("#order p").classList.remove("error");
  }
}

export function appendOrderList(orderList) {
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
  document.querySelector("#checkout p span").textContent = toPay + "DKK";
}

function convertBeerString(beerName) {
  const noSpace = beerName.replaceAll(" ", "");
  const result = noSpace.toLowerCase();
  return result;
}

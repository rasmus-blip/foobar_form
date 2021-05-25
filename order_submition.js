"use strict";
import { post } from "./rest_actions.js";
import { getJSON } from "./rest_actions.js";

let orderList = [];

export async function submitOrder() {
  const url = "https://foobarfirefjerdedele.herokuapp.com/order";
  const result = await post(orderList, url, "headersHeroku");

  if (result.status === 200) {
    orderTracking(result.id);
  } else {
    alert("Oupss, this i not how its supposed to work...");
  }
}

async function orderTracking(id) {
  const url = "https://foobarfirefjerdedele.herokuapp.com/";
  const data = await getJSON(url, "headersHeroku");
  const queue = data.queue;
  const serving = data.serving.map((elm) => elm.id);

  const queueNr = getPlaceInQueue(queue, id);
  if (queueNr > 0) {
    document.querySelector("#order_submitted span").textContent = queueNr;
    document.querySelector("#order_submitted").classList.add("show");

    setTimeout(() => {
      orderTracking(id);
    }, 1000);
  } else if (serving.includes(id)) {
    document.querySelector("#order_submitted p").textContent = "Your order is getting prepared";
    document.querySelector("#order_submitted").classList.add("show");

    setTimeout(() => {
      orderTracking(id);
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

export function buildOrderList() {
  const allInputs = document.querySelectorAll("#order input");
  orderList = [];

  allInputs.forEach((elm) => {
    if (elm.value > 0) {
      const theObject = { name: elm.name, amount: elm.value };
      orderList.push(theObject);
    }
  });

  return orderList;
}

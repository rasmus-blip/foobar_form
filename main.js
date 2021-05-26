"use strict";

import "./sass/style.scss";
import { setUpOrderForm } from "./order_form.js";
import { setUpAccountCreation } from "./create_account.js";
import Inputmask from "inputmask";
// import restrictedInput from "restricted-input";

window.addEventListener("DOMContentLoaded", init);

function init() {
  const cardNrMask = new Inputmask(`9999 9999 9999 9999`);
  const exprDateMask = new Inputmask(`99/99`);
  const cvvMask = new Inputmask(`999`);

  const allCardNrInputs = document.querySelectorAll(`[name="card_number"]`);
  allCardNrInputs.forEach((input) => {
    cardNrMask.mask(input);
  });

  const allExprDateInputs = document.querySelectorAll(`[name="exp_date"]`);
  allExprDateInputs.forEach((input) => {
    exprDateMask.mask(input);
  });

  const allCvvInputs = document.querySelectorAll(`[name="cvv"]`);
  allCvvInputs.forEach((input) => {
    cvvMask.mask(input);
  });

  // const formattedCreditCardInput = new restrictedInput({
  //   element: document.querySelector(`#account_form [name="card_number"]`),
  //   pattern: "{{9999}} {{9999}} {{9999}} {{9999}}",
  // });

  setUpOrderForm();
  setUpAccountCreation();
}

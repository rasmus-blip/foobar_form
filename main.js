"use strict";

import "./sass/style.scss";
import { setUpOrderForm } from "./order_form.js";
import { setUpAccountCreation } from "./create_account.js";

window.addEventListener("DOMContentLoaded", init);

function init() {
  setUpOrderForm();
  setUpAccountCreation();
}

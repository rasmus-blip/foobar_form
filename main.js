import "./sass/style.scss";
import { post } from "./rest_actions.js";
import { getJSON } from "./rest_actions.js";

window.addEventListener("DOMContentLoaded", init); 


async function init() {
    const url = "https://foobarfirefjerdedele.herokuapp.com/"; 
    const jsonData = await getJSON(url); 
    console.log(jsonData); 
}


import { loadState } from "./state.js";
import { render } from "./ui.js";
import { initializeEventListeners } from "./events.js";

function init() {
  loadState();
  render();
  initializeEventListeners();
  console.log("Prompt Builder Initialized.");
}

document.addEventListener("DOMContentLoaded", init);
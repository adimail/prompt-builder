// js/main.js
import { loadState } from "./state.js";
import { render } from "./ui.js";
import { initializeEventListeners } from "./events.js";

/**
 * Initializes the application.
 */
function init() {
  loadState();
  render();
  initializeEventListeners();
  console.log("Prompt Builder Initialized.");
}

// Start the app once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);

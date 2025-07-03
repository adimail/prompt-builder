/**
 * Generates a unique ID string.
 * @returns {string} A unique identifier.
 */
export function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * A simple heuristic to estimate token count.
 * A more accurate version would use a proper tokenizer library.
 * @param {string} text The input text.
 * @returns {number} The estimated number of tokens.
 */
export function estimateTokens(text) {
  if (!text) return 0;
  // Average token length is ~4 chars
  return Math.ceil(text.length / 4);
}

/**
 * Debounces a function to limit how often it can be called.
 * @param {Function} func The function to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

/**
 * Triggers a browser download for the given JSON data.
 * @param {object} data The JSON object to download.
 * @param {string} filename The desired filename for the download.
 */
export function downloadJson(data, filename) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
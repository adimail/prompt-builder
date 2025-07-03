# Prompt Builder - A Client-Side LLM Prompt Engineering App

This is a single-page web application for building, testing, and managing prompts for Large Language Models (LLMs). It runs entirely in the browser, using `localStorage` for data persistence, and requires no backend.

## ✨ Features

- **Modular Block Editor:** Drag, drop, and reorder blocks (Instruction, Context, etc.) to compose prompts.
- **Template Management:** Save, load, and delete multiple prompts.
- **Import/Export:** Save your prompts to a JSON file or import them into another browser.
- **Live Monitoring:** Real-time character/token counting.
- **Responsive Layout:** Collapsible sidebar and adaptive panes for mobile and desktop.
- **Light/Dark Theme:** Switch between themes for user comfort.
- **Live Preview:** See the assembled plain-text prompt.
- **Client-Side Storage:** All your work is saved automatically in your browser's `localStorage`.
- **Zero Dependencies (Runtime):** Built with pure vanilla JavaScript.

## Data Model

The entire application state is stored in `localStorage` under the key `promptBuilderState`. It contains a `prompts` array, where each prompt is structured as follows:

```json
{
  "id": "prompt_123",
  "name": "My Awesome Prompt",
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-28T11:00:00.000Z",
  "blocks": [
    {
      "id": "block_abc",
      "type": "Instruction",
      "content": "Summarize the following text in three bullet points.",
      "isCollapsed": false
    }
  ]
}
```
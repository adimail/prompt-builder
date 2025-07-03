import { Prompt } from '../types';

const mockPrompts: Prompt[] = [
  {
    id: 'gallery_id_1',
    name: 'Full-Stack App Scaffolder',
    createdAt: '2025-07-03T20:57:27.680Z',
    updatedAt: '2025-07-03T20:59:29.525Z',
    blocks: [
      {
        id: 'id_1751576250424_6m74pqmzt',
        type: 'Role',
        content:
          'You are a seasoned full‑stack developer and UX designer. Your task is to architect and scaffold a single‑page Prompt Builder web application that runs entirely in the browser, storing all data in local storage or IndexedDB. The app should follow modern best practices for component‑based design, responsive layouts, and an intuitive user experience. Generate all necessary files and code snippets (HTML, CSS/Tailwind, JavaScript/React or vanilla JS, plus build tooling configuration) to realize the following detailed feature set and flow:',
        isCollapsed: false,
      },
      {
        id: 'id_1751576298990_2j2qslpwv',
        type: 'Instruction',
        content:
          'I want to add a new page in my application (gallery page) /gallery.html. This will have a prompt gallery. A collection of prompts. Whenever I click on a gallery card, I should be able to see the preview of the prompt in the right hand sidebar.',
        isCollapsed: false,
      },
      {
        id: 'id_1751576285324_egr1m1i7o',
        type: 'Constraint',
        content:
          'For code files which needs changes, give me code for the entire file and do not write comments. Follow the same coding style that I have written.',
        isCollapsed: false,
      },
    ],
  },
  {
    id: 'gallery_id_2',
    name: 'Creative Story Writer',
    createdAt: '2025-07-02T18:30:00.123Z',
    updatedAt: '2025-07-02T19:00:00.456Z',
    blocks: [
      {
        id: 'block_role_story',
        type: 'Role',
        content:
          'You are a master storyteller, capable of weaving intricate plots and developing compelling characters. Your style is reminiscent of classic fantasy authors, but with a modern, fast-paced narrative.',
        isCollapsed: false,
      },
      {
        id: 'block_instr_story',
        type: 'Instruction',
        content:
          'Write a short story (around 500 words) about a young cartographer who discovers a map that leads to a city that moves. The story should start with the discovery of the map and end as they take their first step on the journey.',
        isCollapsed: false,
      },
      {
        id: 'block_context_story',
        type: 'Context',
        content:
          'The world is a vast, unexplored continent where magic is rare and often misunderstood. The main character, Elara, lives in a remote port town and has always dreamed of adventure beyond the horizon.',
        isCollapsed: false,
      },
    ],
  },
  {
    id: 'gallery_id_3',
    name: 'Technical Documentation Assistant',
    createdAt: '2025-07-01T11:00:00.000Z',
    updatedAt: '2025-07-01T11:25:10.987Z',
    blocks: [
      {
        id: 'block_role_tech',
        type: 'Role',
        content:
          'You are a technical writer specializing in creating clear, concise, and user-friendly documentation for software APIs.',
        isCollapsed: false,
      },
      {
        id: 'block_instr_tech',
        type: 'Instruction',
        content:
          'Generate API documentation for the following JavaScript function. Include a brief description, parameter details (name, type, description), and a return value description. Provide a clear code example.',
        isCollapsed: false,
      },
      {
        id: 'block_variable_tech',
        type: 'Variable',
        content:
          "Function to document:\n```javascript\nfunction calculateDiscount(price, percentage) {\n  if (percentage < 0 || percentage > 100) {\n    throw new Error('Percentage must be between 0 and 100.');\n  }\n  return price - (price * (percentage / 100));\n}\n```",
        isCollapsed: false,
      },
    ],
  },
];

export const fetchGalleryPrompts = (): Promise<Prompt[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPrompts);
    }, 500);
  });
};
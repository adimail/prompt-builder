export const NoPromptView = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <span className="material-icons text-8xl text-gray-300 dark:text-gray-600">inbox</span>
      <h2 className="mt-4 text-2xl font-bold">No Prompt Selected</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Select a prompt from "My Prompts" or create a new one to get started.
      </p>
    </div>
  );
};
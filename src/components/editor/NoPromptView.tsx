import { Inbox } from 'lucide-react';
import { QuickTips } from '../ui/QuickTips';

export const NoPromptView = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-16 overflow-y-auto p-8 text-center">
      <div>
        <Inbox className="mx-auto h-24 w-24 text-neutral-700" />
        <h2 className="mt-4 text-2xl font-bold tracking-wider">NO PROMPT SELECTED</h2>
        <p className="mt-2 font-sans text-neutral-400">
          Select a prompt from the sidebar or create a new one to get started.
        </p>
      </div>
      <QuickTips />
    </div>
  );
};

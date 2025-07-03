import { Inbox } from 'lucide-react';
import { QuickTips } from '../ui/QuickTips';

export const NoPromptView = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-16 overflow-y-auto">
      <div>
        <Inbox className="w-24 h-24 text-neutral-700 mx-auto" />
        <h2 className="mt-4 text-2xl font-bold tracking-wider">NO PROMPT SELECTED</h2>
        <p className="mt-2 text-neutral-400 font-sans">
          Select a prompt from the sidebar or create a new one to get started.
        </p>
      </div>
      <QuickTips />
    </div>
  );
};
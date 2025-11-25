import { ImageGrid } from './ImageGrid';
import { Rocket, FileJson } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <div className="w-full flex-shrink-0 text-center md:w-1/3 md:text-left">
          <h1 className="text-5xl font-extrabold leading-tight tracking-wider text-white md:text-7xl">
            Build.
            <br />
            Test.
            <br />
            Iterate.
          </h1>
          <p className="mx-auto mt-6 max-w-md font-sans text-lg text-neutral-400 md:mx-0">
            The ultimate client-side studio for prompt engineering. Visually construct, manage, and
            export your prompts with zero friction.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <a
              href="studio.html?view=editor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 py-4 text-lg font-bold text-white hover:bg-orange-600 sm:w-auto"
            >
              <Rocket className="h-5 w-5" />
              Launch Studio
            </a>
            <a
              href="studio.html?view=json-builder"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 px-8 py-4 text-lg font-bold text-white hover:bg-neutral-700 sm:w-auto"
            >
              <FileJson className="h-5 w-5" />
              JSON Builder
            </a>
          </div>
        </div>

        <div className="h-[60vh] w-full md:h-[70vh] md:w-2/3">
          <ImageGrid />
        </div>
      </div>
    </div>
  );
};

import { ImageGrid } from './ImageGrid';
import { Rocket, FileJson } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/3 flex-shrink-0 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-wider leading-tight">
            Build.
            <br />
            Test.
            <br />
            Iterate.
          </h1>
          <p className="mt-6 text-lg text-neutral-400 font-sans max-w-md mx-auto md:mx-0">
            The ultimate client-side studio for prompt engineering. Visually construct, manage, and
            export your prompts with zero friction.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a
              href="studio.html?view=editor"
              className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold text-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Rocket className="w-5 h-5" />
              Launch Studio
            </a>
            <a
              href="studio.html?view=json-builder"
              className="px-8 py-4 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 font-bold text-lg inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FileJson className="w-5 h-5" />
              JSON Builder
            </a>
          </div>
        </div>

        <div className="w-full md:w-2/3 h-[60vh] md:h-[70vh]">
          <ImageGrid />
        </div>
      </div>
    </div>
  );
};
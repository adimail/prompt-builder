import { QuickTips } from './ui/QuickTips';
import { HeroSection } from './ui/HeroSection';
import {
  Box,
  FileJson,
  FileText,
  LayoutGrid,
  Rocket,
  Server,
  Sparkles,
} from 'lucide-react';

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
    <div className="flex items-center gap-4 mb-3">
      <div className="text-orange-500">{icon}</div>
      <h3 className="text-xl font-bold tracking-wider text-white">{title}</h3>
    </div>
    <p className="text-neutral-400 font-sans">{children}</p>
  </div>
);

export const LandingPage = () => {
  return (
    <div className="bg-black text-white font-mono">
      <header className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-neutral-800 z-50">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Rocket className="text-orange-500 w-7 h-7" />
            <h1 className="md:text-xl text-sm font-bold tracking-wider">PROMPT BUILDER</h1>
          </div>
          <a
            href="studio.html"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-bold md:text-sm text-xs"
          >
            GO TO STUDIO
          </a>
        </nav>
      </header>

      <main>
        <HeroSection />
        <QuickTips />
      </main>

      <section id="features" className="bg-neutral-950 py-20 border-y border-neutral-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-wider">WHY USE PROMPT BUILDER?</h2>
            <p className="text-lg text-neutral-400 mt-2 font-sans">
              Everything you need for efficient prompt engineering.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<LayoutGrid />} title="MODULAR EDITOR">
              Drag, drop, and reorder blocks like Instructions, Context, and Variables to visually
              construct complex prompts.
            </FeatureCard>
            <FeatureCard icon={<FileText />} title="TEMPLATE MANAGEMENT">
              Save your prompts as templates. Load, edit, and delete them easily, streamlining your
              workflow.
            </FeatureCard>
            <FeatureCard icon={<Server />} title="100% CLIENT-SIDE">
              Your work is saved directly in your browser's localStorage. It's fast, private, and
              works offline.
            </FeatureCard>
            <FeatureCard icon={<Sparkles />} title="LIVE PREVIEW & STATS">
              Instantly see the assembled plain-text prompt and get real-time character and token
              counts.
            </FeatureCard>
            <FeatureCard icon={<FileJson />} title="IMPORT & EXPORT">
              Easily back up your prompts to a JSON file or share them with others.
            </FeatureCard>
            <FeatureCard icon={<Box />} title="ZERO DEPENDENCIES">
              Built with pure vanilla JavaScript and modern web APIs for maximum performance and
              portability.
            </FeatureCard>
          </div>
        </div>
      </section>

      <footer className="bg-black py-8">
        <div className="container mx-auto px-6 text-center text-neutral-500">
          <p>© {new Date().getFullYear()} PROMPT BUILDER. BUILT FOR THE COMMUNITY.</p>
          <p className="text-sm mt-2 font-sans">
            This is an open-source project. Feel free to contribute on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
};

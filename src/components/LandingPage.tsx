import {
  Box,
  FileJson,
  FileText,
  LayoutGrid,
  Rocket,
  Server,
  Sparkles,
  Github,
  BrainCircuit,
  Quote,
  Lightbulb,
  Code,
  Database,
} from 'lucide-react';
import { HeroSection } from './ui/HeroSection';

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 h-full">
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
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/adimail/prompt-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white"
              title="View on GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="studio.html?view=editor"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-bold md:text-sm text-xs"
            >
              LAUNCH APP
            </a>
          </div>
        </nav>
      </header>

      <main>
        <HeroSection />

        <section id="why-prompts" className="py-20 bg-black">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <BrainCircuit className="w-16 h-16 mx-auto text-orange-500 mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-wider">
              Better Prompts, Better Results
            </h2>
            <p className="text-lg text-neutral-400 mt-4 font-sans">
              The output from a Large Language Model is a direct reflection of the prompt it
              receives. Vague instructions lead to generic responses. A well-crafted, specific, and
              context-rich prompt unlocks precise, creative, and powerful results.
            </p>
            <p className="text-lg text-neutral-300 mt-4 font-sans font-semibold">
              Use Prompt Builder to craft those high-quality prompts and gain full control over the
              AI's output.
            </p>
          </div>
        </section>

        <section id="use-cases" className="py-20 bg-neutral-950 border-y border-neutral-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-wider">How You'll Use It</h2>
              <p className="text-lg text-neutral-400 mt-2 font-sans">
                From rapid prototyping to building production-ready AI interactions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoCard icon={<Lightbulb />} title="Iterative Development">
                When you're fine-tuning a prompt, our modular editor lets you easily tweak,
                reorder, and test different components to see what works best without losing your
                flow.
              </InfoCard>
              <InfoCard icon={<Code />} title="Structured Data Generation">
                When you need an LLM to return data in a specific, machine-readable format like
                JSON for your application, our AI-powered JSON Builder is the perfect tool.
              </InfoCard>
              <InfoCard icon={<Database />} title="Complex Task Automation">
                When a task requires multiple steps, constraints, or background context, build a
                detailed, multi-part prompt to guide the AI through the entire process reliably.
              </InfoCard>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <Quote className="w-12 h-12 mx-auto text-neutral-700 mb-4" />
            <blockquote className="text-2xl md:text-3xl italic text-neutral-300 font-sans leading-relaxed">
              "The difference between a good and a great AI response isn't the model—it's the
              prompt. Master the art of the prompt, and you master the AI."
            </blockquote>
          </div>
        </section>

        <section id="features" className="bg-neutral-950 py-20 border-y border-neutral-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-wider">CORE FEATURES</h2>
              <p className="text-lg text-neutral-400 mt-2 font-sans">
                Everything you need for efficient prompt engineering.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoCard icon={<LayoutGrid />} title="MODULAR EDITOR">
                Drag, drop, and reorder blocks like Instructions, Context, and Variables to
                visually construct complex prompts.
              </InfoCard>
              <InfoCard icon={<FileText />} title="TEMPLATE MANAGEMENT">
                Save your prompts as templates. Load, edit, and delete them easily, streamlining
                your workflow.
              </InfoCard>
              <InfoCard icon={<Server />} title="100% CLIENT-SIDE">
                Your work is saved directly in your browser's localStorage. It's fast, private, and
                works offline.
              </InfoCard>
              <InfoCard icon={<Sparkles />} title="LIVE PREVIEW & STATS">
                Instantly see the assembled plain-text prompt and get real-time character and token
                counts.
              </InfoCard>
              <InfoCard icon={<FileJson />} title="IMPORT & EXPORT">
                Easily back up your prompts to a JSON file or share them with others.
              </InfoCard>
              <InfoCard icon={<Box />} title="ZERO DEPENDENCIES">
                Built with pure vanilla JavaScript and modern web APIs for maximum performance and
                portability.
              </InfoCard>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black py-8">
        <div className="container mx-auto px-6 text-center text-neutral-500">
          <p className="font-sans">
            Created by{' '}
            <a
              href="https://adimail.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Aditya Godse
            </a>
            . Source code available on{' '}
            <a
              href="https://github.com/adimail/prompt-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
          <p className="text-sm mt-4">
            © {new Date().getFullYear()} PROMPT BUILDER. BUILT FOR THE COMMUNITY.
          </p>
        </div>
      </footer>
    </div>
  );
};
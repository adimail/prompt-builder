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
  <div className="h-full rounded-lg border border-neutral-800 bg-neutral-900 p-6">
    <div className="mb-3 flex items-center gap-4">
      <div className="text-orange-500">{icon}</div>
      <h3 className="text-xl font-bold tracking-wider text-white">{title}</h3>
    </div>
    <p className="font-sans text-neutral-400">{children}</p>
  </div>
);

export const LandingPage = () => {
  return (
    <div className="bg-black font-mono text-white">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-sm">
        <nav className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Rocket className="h-7 w-7 text-orange-500" />
            <h1 className="text-sm font-bold tracking-wider md:text-xl">PROMPT BUILDER</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/adimail/prompt-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white"
              title="View on GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="studio.html?view=editor"
              className="rounded-md bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 md:text-sm"
            >
              LAUNCH APP
            </a>
          </div>
        </nav>
      </header>

      <main>
        <HeroSection />

        <section id="why-prompts" className="bg-black py-20">
          <div className="container mx-auto max-w-4xl px-6 text-center">
            <BrainCircuit className="mx-auto mb-4 h-16 w-16 text-orange-500" />
            <h2 className="text-3xl font-bold tracking-wider md:text-4xl">
              Better Prompts, Better Results
            </h2>
            <p className="mt-4 font-sans text-lg text-neutral-400">
              The output from a Large Language Model is a direct reflection of the prompt it
              receives. Vague instructions lead to generic responses. A well-crafted, specific, and
              context-rich prompt unlocks precise, creative, and powerful results.
            </p>
            <p className="mt-4 font-sans text-lg font-semibold text-neutral-300">
              Use Prompt Builder to craft those high-quality prompts and gain full control over the
              AI's output.
            </p>
          </div>
        </section>

        <section id="use-cases" className="border-y border-neutral-800 bg-neutral-950 py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-wider">How You'll Use It</h2>
              <p className="mt-2 font-sans text-lg text-neutral-400">
                From rapid prototyping to building production-ready AI interactions.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <InfoCard icon={<Lightbulb />} title="Iterative Development">
                When you're fine-tuning a prompt, our modular editor lets you easily tweak, reorder,
                and test different components to see what works best without losing your flow.
              </InfoCard>
              <InfoCard icon={<Code />} title="Structured Data Generation">
                When you need an LLM to return data in a specific, machine-readable format like JSON
                for your application, our AI-powered JSON Builder is the perfect tool.
              </InfoCard>
              <InfoCard icon={<Database />} title="Complex Task Automation">
                When a task requires multiple steps, constraints, or background context, build a
                detailed, multi-part prompt to guide the AI through the entire process reliably.
              </InfoCard>
            </div>
          </div>
        </section>

        <section className="bg-black py-20">
          <div className="container mx-auto max-w-3xl px-6 text-center">
            <Quote className="mx-auto mb-4 h-12 w-12 text-neutral-700" />
            <blockquote className="font-sans text-2xl italic leading-relaxed text-neutral-300 md:text-3xl">
              "The difference between a good and a great AI response isn't the model—it's the
              prompt. Master the art of the prompt, and you master the AI."
            </blockquote>
          </div>
        </section>

        <section id="features" className="border-y border-neutral-800 bg-neutral-950 py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-wider">CORE FEATURES</h2>
              <p className="mt-2 font-sans text-lg text-neutral-400">
                Everything you need for efficient prompt engineering.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <InfoCard icon={<LayoutGrid />} title="MODULAR EDITOR">
                Drag, drop, and reorder blocks like Instructions, Context, and Variables to visually
                construct complex prompts.
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
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} PROMPT BUILDER. BUILT FOR THE COMMUNITY.
          </p>
        </div>
      </footer>
    </div>
  );
};

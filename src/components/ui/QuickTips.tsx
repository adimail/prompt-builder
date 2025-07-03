const tips = [
  {
    title: 'MAKE IT SPECIFIC',
    description: 'Provide short details about what you want to do.',
    example: 'Summarize this email in two bulleted points.',
  },
  {
    title: 'GIVE SOME CONTEXT',
    description: 'Specify the tone you want.',
    example: 'Write a blog post that sounds professional and witty.',
  },
  {
    title: 'GUIDE THE RESPONSE',
    description: 'Use cue words at the end of your prompt to give better directions.',
    example: 'Write an article about elephants. Include: Habitat, Diet',
  },
  {
    title: 'REVIEW AND REVISE',
    description: "Check results to make sure they're correct and refine your prompts as you go.",
    example: 'Lions are native to ... the Arctic.',
  },
];

const TipCard = ({
  title,
  description,
  example,
}: {
  title: string;
  description: string;
  example: string;
}) => (
  <div className="bg-neutral-900 border cursor-pointer border-neutral-800 rounded-lg p-6 space-y-4 h-full flex flex-col hover:border-orange-500/50 transition-colors">
    <div>
      <h3 className="font-bold text-white tracking-wider">{title}</h3>
      <p className="text-sm text-neutral-400 font-sans mt-2">{description}</p>
    </div>
    <div className="flex-grow flex items-end">
      <p className="text-2xl text-orange-500 font-sans">{example}</p>
    </div>
  </div>
);

export const QuickTips = () => {
  return (
    <div className="w-full max-w-7xl mx-auto my-20 px-6">
      <h2 className="text-2xl font-bold text-white tracking-wider mb-6">
        QUICK TIPS FOR BETTER PROMPTS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tips.map((tip) => (
          <TipCard key={tip.title} {...tip} />
        ))}
      </div>
    </div>
  );
};
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
  <div className="flex h-full cursor-pointer flex-col space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-orange-500/50">
    <div>
      <h3 className="font-bold tracking-wider text-white">{title}</h3>
      <p className="mt-2 font-sans text-sm text-neutral-400">{description}</p>
    </div>
    <div className="flex flex-grow items-end">
      <p className="font-sans text-2xl text-orange-500">{example}</p>
    </div>
  </div>
);

export const QuickTips = () => {
  return (
    <div className="mx-auto my-20 w-full max-w-7xl px-6">
      <h2 className="mb-6 text-2xl font-bold tracking-wider text-white">
        QUICK TIPS FOR BETTER PROMPTS
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tips.map((tip) => (
          <TipCard key={tip.title} {...tip} />
        ))}
      </div>
    </div>
  );
};

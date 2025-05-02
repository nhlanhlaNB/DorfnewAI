
import { Bot, Image, Music, Video } from "lucide-react";

const features = [
  {
    title: "AI Video Creation",
    description:
      "Generate stunning videos from text prompts or image uploads.",
    icon: Video,
  },
  {
    title: "AI Image Generation",
    description:
      "Create beautiful artwork and graphics with our advanced image models.",
    icon: Image,
  },
  {
    title: "AI Music Production",
    description:
      "Compose original music tracks with our AI-powered music generator.",
    icon: Music,
  },
  {
    title: "Smart Content Prompting",
    description:
      "Get guidance on creating the perfect prompts for optimal results.",
    icon: Bot,
  },
];

export function Features() {
  return (
    <div className="py-16 md:py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
            Experience the Power of DorfNewAI
          </h2>
          <p className="text-lg text-muted-foreground">
            Our powerful AI tools help you create professional content in minutes, not hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-md bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

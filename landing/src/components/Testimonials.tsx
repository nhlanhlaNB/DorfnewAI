
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Digital Content Creator",
    quote:
      "DorfNewAI has completely transformed my workflow. I can create videos and images in minutes that used to take me hours.",
    avatar: "SJ",
  },
  {
    name: "Marcus Chen",
    title: "Indie Game Developer",
    quote:
      "The music generation capabilities are incredible. I've saved thousands on custom soundtracks for my games.",
    avatar: "MC",
  },
  {
    name: "Priya Patel",
    title: "Marketing Director",
    quote:
      "Our marketing team relies on DorfNewAI daily. The speed and quality of content generation gives us a competitive edge.",
    avatar: "PP",
  },
];

export function Testimonials() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ai-gradient-text">
            Loved by Creators Everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our users are saying about DorfNewAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card p-8 rounded-lg border border-border relative"
            >
              <div className="mb-6">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  <AvatarImage src="" />
                </Avatar>
              </div>
              <p className="italic mb-6 text-muted-foreground">"{testimonial.quote}"</p>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

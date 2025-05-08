"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const TryNow = () => {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("image");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast({
        title: "Please enter a prompt",
        description: "You need to provide a description of what you want to create.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      console.log("Generating content:", { prompt, contentType });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const mockResults: Record<string, string> = {
        image: "https://source.unsplash.com/random/600x400",
        video: "https://example.com/video.mp4",
        music: "https://example.com/music.mp3",
      };
      setResult(mockResults[contentType]);
      toast({
        title: "Content generated!",
        description: "Sign up to unlock unlimited generations.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold ai-gradient-text">
            DorfNewAI
          </Link>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Try DorfNewAI for Free</CardTitle>
              <CardDescription>
                Create one AI-generated piece of content without signing up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prompt">Describe what you want to create</Label>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., A futuristic cityscape at sunset with flying cars"
                    rows={5}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Now"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground text-center w-full">
                This is a one-time free trial.{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>{" "}
                for unlimited access.
              </p>
            </CardFooter>
          </Card>
          <div className="flex flex-col">
            <Card className="w-full flex-1">
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Generating your content...</p>
                  </div>
                ) : result ? (
                  <div className="flex flex-col items-center space-y-4">
                    {contentType === "image" ? (
                      <img
                        src={result}
                        alt="AI-generated content"
                        className="w-full h-auto max-h-[400px] object-contain rounded-md"
                      />
                    ) : (
                      <div className="bg-secondary/50 w-full h-48 flex items-center justify-center rounded-md">
                        <p>Content generated! (Preview not available in demo)</p>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="mb-4">Like what you see? Sign up for unlimited generations!</p>
                      <Button asChild>
                        <Link href="/signup">Create Account</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
                    <p className="text-muted-foreground">Fill out the form and click Generate to see your AI creation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryNow;
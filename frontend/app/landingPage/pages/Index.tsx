
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CreatorSection from "../components/CreatorSection";
import Pricing from "../components/Pricing";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-dorfnew-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CreatorSection />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

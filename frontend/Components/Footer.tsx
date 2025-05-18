
import { Button } from '@/components/ui/button';

const Footer = () => {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Testimonials", href: "#" },
        { label: "FAQ", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Tutorials", href: "#" },
        { label: "Support", href: "#" },
        { label: "Community", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
        { label: "Cookies", href: "#" },
        { label: "Licenses", href: "#" },
      ]
    },
  ];
  
  return (
    <footer className="bg-dorfnew-background border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Dorfnew
            </div>
            <p className="text-dorfnew-muted max-w-xs mb-6">
              Empowering creators with AI-powered tools to produce, distribute, and monetize exceptional content.
            </p>
            <div className="flex gap-4">
              {["twitter", "facebook", "instagram", "youtube"].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-dorfnew-primary rounded-full"></div>
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-dorfnew-muted hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-dorfnew-muted">
            © {new Date().getFullYear()} Dorfnew. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Button variant="ghost" className="text-dorfnew-muted hover:text-white h-auto p-0">
              Terms
            </Button>
            <span className="text-dorfnew-muted">•</span>
            <Button variant="ghost" className="text-dorfnew-muted hover:text-white h-auto p-0">
              Privacy
            </Button>
            <span className="text-dorfnew-muted">•</span>
            <Button variant="ghost" className="text-dorfnew-muted hover:text-white h-auto p-0">
              Cookies
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

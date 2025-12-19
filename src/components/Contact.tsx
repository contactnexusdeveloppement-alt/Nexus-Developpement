import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="py-12">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-110 blur-sm"
          }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(100,150,255,0.6)]">
            Contactez-nous
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Une question ? Un projet ? Notre équipe est à votre écoute
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className={`relative overflow-hidden border border-blue-500/30 transition-all duration-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] group bg-slate-900/40 backdrop-blur-xl ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <CardContent className="p-8 text-center relative z-10">
              <div className="mb-6 inline-flex p-5 rounded-2xl bg-blue-500/10 border border-blue-400/20 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                <Mail className="w-10 h-10 text-blue-300 group-hover:text-blue-200 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Email</h3>
              <a
                href="mailto:contact.nexus.developpement@gmail.com"
                className="text-blue-200 hover:text-white transition-colors font-medium text-sm md:text-base block hover:scale-105 transform duration-300"
                aria-label="Envoyer un email à contact.nexus.developpement@gmail.com"
              >
                contact.nexus.developpement@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className={`relative overflow-hidden border border-blue-500/30 transition-all duration-700 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] group bg-slate-900/40 backdrop-blur-xl ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <CardContent className="p-8 text-center relative z-10">
              <div className="mb-6 inline-flex p-5 rounded-2xl bg-blue-500/10 border border-blue-400/20 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                <Phone className="w-10 h-10 text-blue-300 group-hover:text-blue-200 transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Téléphone</h3>
              <a
                href="tel:+33761847580"
                className="text-blue-200 hover:text-white transition-colors font-medium text-lg block hover:scale-105 transform duration-300"
                aria-label="Appeler le +33 7 61 84 75 80"
              >
                +33 7 61 84 75 80
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;

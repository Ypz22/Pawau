import { ArrowRight, Sparkles, Scissors, Bath, Store } from 'lucide-react';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const services = [
    {
      title: "Grooming Completo",
      description: "Corte de pelo, baño spa, limpieza de oídos y corte de uñas con productos premium.",
      icon: <Scissors className="w-6 h-6" />,
      price: "Desde $45"
    },
    {
      title: "Baño Spa Relajante",
      description: "Masajes, aromaterapia y baño con shampoo especializado según el pelaje.",
      icon: <Bath className="w-6 h-6" />,
      price: "Desde $25"
    },
    {
      title: "Boutique Exclusiva",
      description: "Accesorios de diseñador, ropa, juguetes interactivos y snacks orgánicos.",
      icon: <Store className="w-6 h-6" />,
      price: "Ver Catálogo"
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fff3e6_0%,#fff8f2_58%,#ffffff_100%)] py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white px-4 py-2 text-sm font-bold text-brand-primary shadow-sm">
              <Sparkles className="w-4 h-4" />
              Boutique, spa y agenda digital en un solo sitio
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-brand-charcoal tracking-tight leading-tight mb-8">
              Cuidado premium para <span className="text-brand-primary inline-flex relative">tu mejor amigo <Sparkles className="absolute -top-6 -right-6 text-brand-blue w-8 h-8 animate-pulse" /></span>
            </h1>
            <p className="text-lg md:text-xl text-brand-charcoal/80 leading-relaxed mb-10">
              Pawau Boutique & Spa es el refugio donde el estilo y el bienestar se encuentran. Expertos en hacer que cada mascota se sienta y se vea espectacular.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button to="/agendar" className="text-lg px-8 py-4">
                Agendar Cita Ahora
              </Button>
              <Button to="/contacto" variant="secondary" className="text-lg px-8 py-4 group">
                Contáctanos <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 translate-y-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-blue font-bold tracking-wider uppercase text-sm mb-3">Nuestros Servicios</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-charcoal mb-6">
              Todo lo que necesitan en un solo lugar
            </h3>
            <p className="text-brand-charcoal/70 text-lg leading-relaxed">
              Tratamos a cada mascota con el mismo amor y respeto que tú. Conoce nuestros servicios diseñados para su confort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Mini CTA */}
      <section className="py-20 bg-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
            ¿Listo para consentir a tu mascota?
          </h2>
          <Button to="/agendar" className="bg-white text-brand-primary hover:bg-brand-cream hover:text-orange-600 shadow-xl px-10 py-4 text-lg">
            Quiero una cita
          </Button>
        </div>
      </section>
    </div>
  );
}

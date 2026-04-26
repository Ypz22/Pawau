import { Scissors, Bath, Sparkles, Cat, ShoppingBag } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';

export default function Services() {
  const dogServices = [
    { title: "Baño y secado", description: "Shampoo especial, secado y cepillado.", icon: <Bath className="w-6 h-6" /> },
    { title: "Corte de pelo", description: "Estilizado según la raza.", icon: <Scissors className="w-6 h-6" /> },
    { title: "Corte de uñas", description: "Cuidado profesional y seguro.", icon: <Sparkles className="w-6 h-6" /> },
    { title: "Limpieza de oídos", description: "Higiene segura y cuidadosa.", icon: <Sparkles className="w-6 h-6" /> },
    { title: "Grooming completo", description: "Baño + corte + uñas + oídos. El paquete definitivo.", icon: <Sparkles className="w-6 h-6" /> }
  ];

  const catServices = [
    { title: "Baño especial para gatos", description: "Productos suaves diseñados para felinos.", icon: <Bath className="w-6 h-6" /> },
    { title: "Corte higiénico", description: "Mantenimiento rápido y sin estrés.", icon: <Scissors className="w-6 h-6" /> },
    { title: "Corte de uñas felino", description: "Seguro para las garras de tu gato.", icon: <Sparkles className="w-6 h-6" /> },
    { title: "Spa relajante completo", description: "Experiencia calmante total.", icon: <Cat className="w-6 h-6" /> }
  ];

  const boutiqueItems = [
    { title: "Pecheras ajustables", description: "Comodidad y seguridad para los paseos.", icon: <ShoppingBag className="w-6 h-6" /> },
    { title: "Pecheras personalizadas", description: "Con el nombre y estilo único de tu mascota.", icon: <ShoppingBag className="w-6 h-6" /> },
    { title: "Placas de identificación", description: "Seguridad con los mejores diseños.", icon: <ShoppingBag className="w-6 h-6" /> },
    { title: "Collares", description: "De diferentes materiales y colores vibrantes.", icon: <ShoppingBag className="w-6 h-6" /> }
  ];

  return (
    <div className="pt-20 min-h-screen bg-[linear-gradient(180deg,#fff3e6_0%,#fff8f1_44%,#ffffff_100%)]">
      {/* Header */}
      <section className="py-16 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,rgba(75,200,232,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,91,26,0.1),transparent_28%)]" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal mb-4">Nuestros servicios</h1>
        <p className="text-brand-charcoal/70 text-lg max-w-2xl mx-auto">
          Todo lo que tu mascota necesita para verse y sentirse increíble.
        </p>
      </section>

      {/* Grooming Perros */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-brand-charcoal mb-8 text-center md:text-left">Grooming & Spa (Perros)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dogServices.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Spa Gatos */}
      <section className="py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-brand-charcoal mb-8 text-center md:text-left">Spa para Gatos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catServices.map((service, idx) => (
              <ServiceCard key={idx} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Boutique */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-brand-charcoal mb-8 text-center md:text-left">Boutique</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {boutiqueItems.map((item, idx) => (
              <ServiceCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-brand-primary text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">¿No sabes qué servicio necesita tu mascota?</h2>
          <p className="text-white/90 text-lg mb-8">
            Te asesoramos para elegir la mejor opción de grooming o spa para tu peludo amigo.
          </p>
          <Button to="/agendar" className="bg-white text-brand-primary hover:bg-brand-cream">
            Contactar Asesor
          </Button>
        </div>
      </section>
    </div>
  );
}

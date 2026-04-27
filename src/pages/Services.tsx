import Button from '../components/Button';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import ServiceCard from '../components/ServiceCard';
import {
  boutiqueItems,
  catServices,
  dogServices,
  serviceSectionAnchors,
  type MarketingServiceItem,
} from '../lib/services-content';
import { buildOrganizationSchema } from '../lib/seo';

function renderIcon(iconName: string) {
  return (
    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
      {iconName}
    </span>
  );
}

function toServiceCardProps(item: MarketingServiceItem) {
  return {
    ...item,
    icon: renderIcon(item.iconName),
  };
}

export default function Services() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 pb-16 pt-32">
      <Seo
        title="Servicios para Mascotas en Ibarra | Pawau Boutique & Spa"
        description="Conoce los servicios de Pawau: grooming para perros, spa para gatos, baño, corte de uñas y boutique de accesorios para mascotas en Ibarra."
        path="/servicios"
        schema={buildOrganizationSchema()}
      />
      <main className="mx-auto w-full max-w-[1280px]">
        <Reveal as="section" className="mb-16 rounded-[2rem] bg-surface-container-low p-10 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
          <p className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container">Nuestros Servicios</p>
          <h1 className="mt-3 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
            Todo lo que tu mascota necesita para verse y sentirse increíble.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-[1.6] text-on-surface-variant">
            Diseñamos cada servicio para que tu mascota viva una experiencia tranquila, segura y llena de detalles especiales.
          </p>
        </Reveal>

        <Reveal as="section" className="mb-16 scroll-mt-32" delay={0.04} id={serviceSectionAnchors.dogs}>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              pets
            </span>
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Grooming & Spa para Perros</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dogServices.map((service) => (
              <ServiceCard key={service.title} {...toServiceCardProps(service)} />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-16 scroll-mt-32" delay={0.06} id={serviceSectionAnchors.cats}>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              cruelty_free
            </span>
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Spa para Gatos</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {catServices.map((service) => (
              <ServiceCard key={service.title} {...toServiceCardProps(service)} />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-16 scroll-mt-32" delay={0.08} id={serviceSectionAnchors.boutique}>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              shopping_bag
            </span>
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Boutique</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {boutiqueItems.map((item) => (
              <ServiceCard key={item.title} {...toServiceCardProps(item)} />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="relative overflow-hidden rounded-[2rem] bg-primary-container p-10 text-center shadow-[0_15px_30px_rgba(255,91,26,0.15)] md:p-16" delay={0.1}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <div className="relative z-10">
            <h3 className="text-[32px] font-bold leading-[1.2] text-on-primary-container">
              ¿No sabes qué servicio necesita tu mascota?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-on-primary-container/85">
              Te ayudamos a elegir la mejor opción según su pelaje, temperamento y cuidados especiales.
            </p>
            <div className="mt-8">
              <Button to="/contacto" variant="secondary" className="border-white bg-white px-10 py-4 text-[#FF5B1A]">
                Contáctanos
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

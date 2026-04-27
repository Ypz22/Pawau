import { useState } from 'react';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { buildOrganizationSchema } from '../lib/seo';

export default function Contact() {
  const contactImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWAXtj1bcmL5JbtSfHK5x2SZQrnlmJNugK7g&s'; // PON_AQUI_LA_RUTA_DE_LA_IMAGEN_DEL_LOCAL_O_DEL_EQUIPO
  const businessName = 'Pawau Boutique & Spa';
  const address = '8VPJ+MW Ibarra'; // PON_AQUI_LA_DIRECCION_REAL
  const whatsappNumber = '+593999999999'; // PON_AQUI_EL_NUMERO_REAL_CON_CODIGO_DE_PAIS
  const instagramHandle = 'pawau_ec'; // PON_AQUI_TU_INSTAGRAM_SIN_ARROBA

  const mapsQuery = address;
  const encodedQuery = encodeURIComponent(mapsQuery);
  const embedUrl = `https://www.google.com/maps?q=${encodedQuery}&z=15&output=embed`;
  const directionsUrl = `https://maps.app.goo.gl/dS9ULpsFqdoPLL6D7`;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;
  const instagramUrl = `https://instagram.com/${instagramHandle}`;

  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 pb-16 pt-32">
      <Seo
        title="Contacto y Ubicación | Pawau Boutique & Spa"
        description="Encuentra la ubicación, horarios, WhatsApp e Instagram de Pawau Boutique & Spa en Ibarra. Contáctanos para resolver dudas o pedir información."
        path="/contacto"
        image={contactImage}
        schema={buildOrganizationSchema()}
      />
      <main className="mx-auto w-full max-w-[1280px]">
        <Reveal as="section" className="mb-16">
          <h1 className="flex flex-wrap items-center gap-4 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
            ¿Cómo llegar a Pawau?
            <span className="material-symbols-outlined text-[48px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              pets
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-[1.6] text-on-surface-variant">
            Estamos ubicados en el corazón de la ciudad, listos para recibir a tu mejor amigo con los brazos abiertos y muchos premios.
          </p>
        </Reveal>

        <Reveal as="section" className="mb-24 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16" delay={0.04}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  location_on
                </span>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Dirección</h3>
                <p className="text-on-surface-variant">{"Ricardo Sánchez, y Maldonado, Ibarra"}</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F7F3] text-[#25D366]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  forum
                </span>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">WhatsApp</h3>
                <a className="text-on-surface-variant hover:text-primary-container" href={whatsappUrl} rel="noreferrer" target="_blank">
                  {whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-[#E1306C]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  photo_camera
                </span>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Instagram</h3>
                <a className="text-on-surface-variant hover:text-primary-container" href={instagramUrl} rel="noreferrer" target="_blank">
                  @{instagramHandle}
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  schedule
                </span>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Horarios</h3>
                <p className="text-on-surface-variant">Lun - Sáb: 9am - 6pm</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-surface-container-high shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={embedUrl}
              title={`Mapa de ${businessName}`}
            />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 bg-gradient-to-t from-surface/90 to-transparent p-6">
              <div className="flex items-center gap-2 rounded-full bg-surface-container-lowest/90 px-6 py-3 shadow-sm backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pin_drop
                </span>
                <span className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface">¡Te esperamos aquí!</span>
              </div>
              <a
                className="rounded-full bg-[#FF5B1A] px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] text-white shadow-[0_4px_12px_rgba(255,91,26,0.3)] transition-all hover:-translate-y-0.5"
                href={directionsUrl}
                rel="noreferrer"
                target="_blank"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="relative mx-auto mb-24 max-w-3xl overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(255,91,26,0.08)] md:p-12" delay={0.08}>
          <span className="material-symbols-outlined absolute -bottom-8 -right-8 rotate-[-15deg] text-[120px] text-surface-container opacity-50" style={{ fontVariationSettings: "'FILL' 1" }}>
            pets
          </span>
          <div className="relative z-10">
            {contactImage && (
              <img
                src={contactImage}
                alt="Equipo de Pawau"
                className="mb-8 h-64 w-full rounded-[2rem] object-cover"
              />
            )}

            <h2 className="mb-2 text-[32px] font-bold leading-[1.2] text-on-surface">Escríbenos</h2>
            <p className="mb-8 text-on-surface-variant">
              ¿Tienes alguna duda o quieres cotizar un servicio especial? Llena el formulario y te responderemos en un ladrido.
            </p>

            {isSent ? (
              <div className="rounded-[2rem] bg-surface-container p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E5F7F3] text-[#25D366]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mark_email_read
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface">Mensaje enviado</h3>
                <p className="mt-3 text-on-surface-variant">Gracias por escribirnos. Te responderemos lo antes posible.</p>
                <button
                  className="mt-6 rounded-full border border-outline-variant bg-white px-6 py-3 font-bold text-[#FF5B1A] transition-all hover:-translate-y-0.5 hover:border-[#FF5B1A]"
                  onClick={() => setIsSent(false)}
                  type="button"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant" htmlFor="name">
                      Nombre
                    </label>
                    <input
                      className="w-full rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                      id="name"
                      placeholder="Tu nombre"
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="w-full rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                      id="email"
                      placeholder="tu@correo.com"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant" htmlFor="message">
                    Mensaje
                  </label>
                  <textarea
                    className="w-full resize-none rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                    id="message"
                    placeholder="¿En qué podemos ayudarte?"
                    rows={4}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  />
                </div>

                <div className="pt-4">
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-container px-10 py-4 text-sm font-bold uppercase tracking-[0.05em] text-on-primary-container transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-container/20 md:w-auto"
                    type="submit"
                  >
                    Enviar mensaje
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal as="section" className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-primary-container p-10 text-center shadow-[0_15px_30px_rgba(255,91,26,0.15)] md:p-16" delay={0.1}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex gap-4">
              <a className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-on-primary-container backdrop-blur-sm transition-colors duration-300 hover:bg-white/30" href="#">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  photo_camera
                </span>
              </a>
              <a className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-on-primary-container backdrop-blur-sm transition-colors duration-300 hover:bg-white/30" href="#">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  forum
                </span>
              </a>
            </div>
            <h3 className="max-w-xl text-2xl font-bold leading-[1.3] text-on-primary-container">
              ¡Síguenos y mira a nuestros clientes peludos!
            </h3>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

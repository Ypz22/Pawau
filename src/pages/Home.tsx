import Button from '../components/Button';
import Reveal from '../components/Reveal';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const heroImage = 'https://thumbs.dreamstime.com/b/retrato-perro-de-bulldog-ingl%C3%A9s-con-gafas-sol-fondo-naranja-fotograf%C3%ADa-perros-toros-ingleses-ropa-accesorios-raza-fotogr%C3%A1fica-294516501.jpg'; // PON_AQUI_LA_RUTA_DE_LA_IMAGEN_PRINCIPAL
  const featuredProductImage = 'https://png.pngtree.com/png-vector/20231224/ourmid/pngtree-pet-accessories-accompanied-by-dry-food-on-a-white-png-image_11230281.png'; // PON_AQUI_LA_RUTA_DE_LA_IMAGEN_DEL_PRODUCTO_DESTACADO

  const services = [
    {
      title: 'Grooming Completo',
      description: 'Corte de pelo, baño spa, limpieza de oídos y corte de uñas con productos premium.',
      price: 'Desde $45',
      imageUrl: 'https://hiraoka.com.pe/media/mageplaza/blog/post/a/c/accesorios-para-mascotas-grooming.jpg', // PON_AQUI_LA_RUTA_IMAGEN_GROOMING
      icon: (
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          content_cut
        </span>
      ),
    },
    {
      title: 'Baño Spa Relajante',
      description: 'Masajes, aromaterapia y baño con shampoo especializado según el pelaje.',
      price: 'Desde $25',
      imageUrl: 'https://thumbs.dreamstime.com/b/mascotas-disfrutando-de-un-d%C3%ADa-spa-con-toallas-y-pepinos-en-acogedor-ba%C3%B1o-dos-relajadas-perro-gato-disfrutan-juntos-el-lleva-una-384225792.jpg', // PON_AQUI_LA_RUTA_IMAGEN_BANO_SPA
      icon: (
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          shower
        </span>
      ),
    },
    {
      title: 'Boutique Exclusiva',
      description: 'Accesorios de diseñador, ropa, juguetes interactivos y snacks orgánicos.',
      price: 'Ver Catálogo',
      imageUrl: 'https://s3.ppllstatics.com/elcorreo/www/multimedia/202210/20/media/cortadas/tienda-perros-bilbao-espana-kihB-U1804282509805TF-1248x770@El%20Correo.JPG', // PON_AQUI_LA_RUTA_IMAGEN_BOUTIQUE
      icon: (
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          shopping_bag
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 pb-16 pt-32">
      <main className="mx-auto w-full max-w-[1280px]">
        <Reveal as="section" className="mb-20 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-5 py-3 text-sm font-bold uppercase tracking-[0.05em] text-primary-container shadow-[0_10px_30px_rgba(255,91,26,0.05)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                pets
              </span>
              Boutique, spa y mimos para tu mascota
            </div>
            <h1 className="mt-6 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface md:text-[64px]">
              Cuidado premium para consentir a tu mejor amigo en cada visita.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-[1.6] text-on-surface-variant">
              En Pawau unimos grooming, spa y accesorios con una experiencia cálida, elegante y pensada para mascotas felices y dueños tranquilos.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button to="/agendar" className="px-8 py-4 text-base">
                Agendar Cita
              </Button>
              <Button to="/servicios" variant="secondary" className="px-8 py-4 text-base">
                Ver Servicios
              </Button>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-surface-container-high shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
            {heroImage ? (
              <img
                alt="Mascota destacada de Pawau"
                className="absolute inset-0 h-full w-full object-cover"
                src={heroImage}
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffd8cb_0%,#ffe9e3_45%,#fff8f6_100%)]" />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-surface/80 to-transparent p-6">
              <div className="rounded-full bg-surface-container-lowest/90 px-6 py-3 text-sm font-bold uppercase tracking-[0.05em] text-on-surface shadow-sm backdrop-blur-sm">
                Tu mascota merece una experiencia especial
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="mb-20" delay={0.05}>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container">Nuestros Servicios</p>
              <h2 className="mt-2 text-[32px] font-bold leading-[1.2] text-on-surface">Todo lo que necesitan en un solo lugar</h2>
            </div>
            <p className="max-w-xl text-on-surface-variant">
              Tratamos a cada mascota con el mismo amor y respeto que tú. Conoce nuestros servicios diseñados para su confort y estilo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-20 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]" delay={0.08}>
          <div className="rounded-[2rem] bg-primary-container p-10 text-on-primary-container shadow-[0_15px_30px_rgba(255,91,26,0.15)]">
            <p className="text-sm font-bold uppercase tracking-[0.05em]">Experiencia Pawau</p>
            <h2 className="mt-3 text-[32px] font-bold leading-[1.2]">Un espacio pensado para consentir, cuidar y sorprender.</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-white/20 p-5 backdrop-blur-sm">
                <span className="material-symbols-outlined mb-3 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  spa
                </span>
                <p className="font-bold">Baños relajantes</p>
                <p className="mt-2 text-sm text-on-primary-container/85">Rutinas suaves y productos adecuados para cada pelaje.</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/20 p-5 backdrop-blur-sm">
                <span className="material-symbols-outlined mb-3 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <p className="font-bold">Atención con cariño</p>
                <p className="mt-2 text-sm text-on-primary-container/85">Un trato cálido desde que llegan hasta que regresan a casa.</p>
              </div>
            </div>
          </div>

          <div className="grid items-center gap-8 rounded-[2rem] bg-surface-container-low p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)] lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h3 className="text-[32px] font-bold leading-[1.2] text-on-surface">Productos que combinan estilo y comodidad</h3>
              <p className="mt-4 text-on-surface-variant">
                Aquí puedes mostrar una imagen destacada de tus pecheras, collares, placas o accesorios favoritos.
              </p>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] bg-surface-container-high">
              {featuredProductImage ? (
                <img
                  alt="Producto destacado de Pawau"
                  className="absolute inset-0 h-full w-full object-cover"
                  src={featuredProductImage}
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffe2d9_0%,#fff1ed_100%)]" />
              )}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="relative overflow-hidden rounded-[2rem] bg-primary-container p-10 text-center shadow-[0_15px_30px_rgba(255,91,26,0.15)] md:p-16" delay={0.1}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <div className="relative z-10">
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-primary-container md:text-[40px]">
              ¿Listo para consentir a tu mascota?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-on-primary-container/85">
              Reserva un espacio y dale a tu peludo una experiencia boutique pensada para verse y sentirse increíble.
            </p>
            <div className="mt-8">
              <Button to="/agendar" variant="secondary" className="border-white bg-white px-10 py-4 text-[#FF5B1A]">
                Quiero una cita
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

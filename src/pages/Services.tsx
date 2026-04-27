import Button from '../components/Button';
import Reveal from '../components/Reveal';
import ServiceCard from '../components/ServiceCard';

const dogServices = [
  { title: 'Baño y secado', description: 'Shampoo especial, secado y cepillado.', imageUrl: 'https://wakyma.com/blog/wp-content/uploads/2021/02/como-usar-el-secador-de-pelo-con-el-perro.jpg', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shower</span> },
  { title: 'Corte de pelo', description: 'Estilizado según la raza.', imageUrl: 'https://cdn.shopify.com/s/files/1/0552/3750/9303/files/tipos_de_corte_de_pelo_perros.jpg?v=1633071492', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>content_cut</span> },
  { title: 'Corte de uñas', description: 'Cuidado profesional y seguro.', imageUrl: 'https://cdn0.expertoanimal.com/es/posts/5/2/3/como_cortar_las_unas_a_un_perro_en_casa_20325_orig.jpg', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span> },
  { title: 'Limpieza de oídos', description: 'Higiene segura y cuidadosa.', imageUrl: 'https://www.zooplus.es/magazine/wp-content/uploads/2021/01/C%C3%B3mo-limpiar-las-orejas-a-un-perro-1.webp', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>hearing</span> },
  { title: 'Grooming completo', description: 'Baño + corte + uñas + oídos. El paquete definitivo.', imageUrl: 'https://lh4.googleusercontent.com/proxy/yDDVTJoxnesrtltqfimbIvF3s7fN2BNXCgEU83PoYgYS8n8UWnyNZ3uWPbgAdvSMQTsQhIGgJIrkoZ_Vqb66A7NC8dHAmUiuNJHPSmUE_8iPHKHZSythIf8dL5UJoC_r36YMHaObDZ4G4VxzkHTIS2P6_Po9flAvZL0f2zGJRDKEe4-to92Sw1GSIs6vBgav11C9aOO0LJ15zOL7V0uiCohmwwsak-f58-Sq', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> },
];

const catServices = [
  { title: 'Baño especial para gatos', description: 'Productos suaves diseñados para felinos.', imageUrl: 'https://fotografias.lasexta.com/clipping/cmsimages02/2023/02/14/9F78A0A6-4D42-4AF2-BB1A-6C5C2EAB3192/xiaowan-intelligent-automatic-cat-litter-box_103.jpg?crop=1000,750,x151,y0&width=1200&height=900&optimize=low&format=webply', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shower</span> },
  { title: 'Corte higiénico', description: 'Mantenimiento rápido y sin estrés.', imageUrl: 'https://assets.petscare.com/media/original_images/persian-cat-sanitary-trim-grooming-table-84537.webp', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>content_cut</span> },
  { title: 'Corte de uñas felino', description: 'Seguro para las garras de tu gato.', imageUrl: 'https://www.zooplus.es/magazine/wp-content/uploads/2021/09/Cortar-las-unas-a-un-gato.webp', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span> },
  { title: 'Spa relajante completo', description: 'Experiencia calmante total.', imageUrl: 'https://cdn.shopify.com/s/files/1/0019/4985/9885/files/Blog_Image_-_1536x1024_px_14_3db9149f-6edb-4bf6-a232-05598087f4db_600x600.png?v=1768844665', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span> },
];

const boutiqueItems = [
  { title: 'Pecheras ajustables', description: 'Comodidad y seguridad para los paseos.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRjzLQlEW6SAUg4PYHbhTtSXPkTBxFdLlDKw&s', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span> },
  { title: 'Pecheras personalizadas', description: 'Con el nombre y estilo único de tu mascota.', imageUrl: 'https://www.vainillamascotas.com/cdn/shop/files/pecheras-para-perros-patos-3_81764f9d-5df7-4f2c-9801-679abc297bf4.jpg?v=1714161333', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span> },
  { title: 'Placas de identificación', description: 'Seguridad con los mejores diseños.', imageUrl: 'https://i.etsystatic.com/37388600/r/il/80e469/5785642736/il_340x270.5785642736_jdsf.jpg', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span> },
  { title: 'Collares', description: 'De diferentes materiales y colores vibrantes.', imageUrl: 'https://citypet.ec/wp-content/uploads/2020/05/SPORT-DOG-C-COLLAR-BLUE-1.jpg', icon: <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span> },
];

export default function Services() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 pb-16 pt-32">
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

        <Reveal as="section" className="mb-16" delay={0.04}>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              pets
            </span>
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Grooming & Spa para Perros</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {dogServices.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-16" delay={0.06}>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              cruelty_free
            </span>
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Spa para Gatos</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {catServices.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="mb-16" delay={0.08}>
          <div className="mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              shopping_bag
            </span>
            <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Boutique</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {boutiqueItems.map((item) => (
              <ServiceCard key={item.title} {...item} />
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

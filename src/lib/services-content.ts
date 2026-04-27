export interface MarketingServiceItem {
  title: string;
  description: string;
  imageUrl: string;
  iconName: string;
}

export const dogServices: MarketingServiceItem[] = [
  {
    title: 'Baño y secado',
    description: 'Shampoo especial, secado y cepillado.',
    imageUrl: 'https://wakyma.com/blog/wp-content/uploads/2021/02/como-usar-el-secador-de-pelo-con-el-perro.jpg',
    iconName: 'shower',
  },
  {
    title: 'Corte de pelo',
    description: 'Estilizado según la raza.',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0552/3750/9303/files/tipos_de_corte_de_pelo_perros.jpg?v=1633071492',
    iconName: 'content_cut',
  },
  {
    title: 'Corte de uñas',
    description: 'Cuidado profesional y seguro.',
    imageUrl: 'https://cdn0.expertoanimal.com/es/posts/5/2/3/como_cortar_las_unas_a_un_perro_en_casa_20325_orig.jpg',
    iconName: 'pets',
  },
  {
    title: 'Limpieza de oídos',
    description: 'Higiene segura y cuidadosa.',
    imageUrl: 'https://www.zooplus.es/magazine/wp-content/uploads/2021/01/C%C3%B3mo-limpiar-las-orejas-a-un-perro-1.webp',
    iconName: 'hearing',
  },
  {
    title: 'Grooming completo',
    description: 'Baño + corte + uñas + oídos. El paquete definitivo.',
    imageUrl:
      'https://lh4.googleusercontent.com/proxy/yDDVTJoxnesrtltqfimbIvF3s7fN2BNXCgEU83PoYgYS8n8UWnyNZ3uWPbgAdvSMQTsQhIGgJIrkoZ_Vqb66A7NC8dHAmUiuNJHPSmUE_8iPHKHZSythIf8dL5UJoC_r36YMHaObDZ4G4VxzkHTIS2P6_Po9flAvZL0f2zGJRDKEe4-to92Sw1GSIs6vBgav11C9aOO0LJ15zOL7V0uiCohmwwsak-f58-Sq',
    iconName: 'auto_awesome',
  },
];

export const catServices: MarketingServiceItem[] = [
  {
    title: 'Baño especial para gatos',
    description: 'Productos suaves diseñados para felinos.',
    imageUrl:
      'https://fotografias.lasexta.com/clipping/cmsimages02/2023/02/14/9F78A0A6-4D42-4AF2-BB1A-6C5C2EAB3192/xiaowan-intelligent-automatic-cat-litter-box_103.jpg?crop=1000,750,x151,y0&width=1200&height=900&optimize=low&format=webply',
    iconName: 'shower',
  },
  {
    title: 'Corte higiénico',
    description: 'Mantenimiento rápido y sin estrés.',
    imageUrl: 'https://assets.petscare.com/media/original_images/persian-cat-sanitary-trim-grooming-table-84537.webp',
    iconName: 'content_cut',
  },
  {
    title: 'Corte de uñas felino',
    description: 'Seguro para las garras de tu gato.',
    imageUrl: 'https://www.zooplus.es/magazine/wp-content/uploads/2021/09/Cortar-las-unas-a-un-gato.webp',
    iconName: 'pets',
  },
  {
    title: 'Spa relajante completo',
    description: 'Experiencia calmante total.',
    imageUrl:
      'https://cdn.shopify.com/s/files/1/0019/4985/9885/files/Blog_Image_-_1536x1024_px_14_3db9149f-6edb-4bf6-a232-05598087f4db_600x600.png?v=1768844665',
    iconName: 'spa',
  },
];

export const boutiqueItems: MarketingServiceItem[] = [
  {
    title: 'Pecheras ajustables',
    description: 'Comodidad y seguridad para los paseos.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRjzLQlEW6SAUg4PYHbhTtSXPkTBxFdLlDKw&s',
    iconName: 'shopping_bag',
  },
  {
    title: 'Pecheras personalizadas',
    description: 'Con el nombre y estilo único de tu mascota.',
    imageUrl: 'https://www.vainillamascotas.com/cdn/shop/files/pecheras-para-perros-patos-3_81764f9d-5df7-4f2c-9801-679abc297bf4.jpg?v=1714161333',
    iconName: 'sell',
  },
  {
    title: 'Placas de identificación',
    description: 'Seguridad con los mejores diseños.',
    imageUrl: 'https://i.etsystatic.com/37388600/r/il/80e469/5785642736/il_340x270.5785642736_jdsf.jpg',
    iconName: 'badge',
  },
  {
    title: 'Collares',
    description: 'De diferentes materiales y colores vibrantes.',
    imageUrl: 'https://citypet.ec/wp-content/uploads/2020/05/SPORT-DOG-C-COLLAR-BLUE-1.jpg',
    iconName: 'pets',
  },
];

export const serviceSectionAnchors = {
  dogs: 'GroomingPerros',
  cats: 'SpaGatos',
  boutique: 'boutique',
} as const;

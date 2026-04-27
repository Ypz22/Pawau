import type { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  imageUrl?: string;
  price?: string;
}

export default function ServiceCard({ title, description, icon, imageUrl, price }: ServiceCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-[0_15px_30px_rgba(255,91,26,0.06)]"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {imageUrl && (
        <div className="h-52 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="relative p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary-container">
          {icon || <PawPrint className="w-6 h-6" />}
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-on-surface">{title}</h3>
        <p className="mb-6 leading-relaxed text-on-surface-variant">
          {description}
        </p>
        
        {price && (
          <div className="font-extrabold text-primary-container">
            {price}
          </div>
        )}

        {/* Decorative paw print water mark */}
        <PawPrint className="absolute bottom-4 right-4 h-16 w-16 -rotate-12 text-[#f4ddd5] transition-transform duration-500 group-hover:scale-110" />
      </div>
    </motion.div>
  );
}

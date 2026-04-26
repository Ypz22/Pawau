import type { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  imageUrl?: string;
  price?: string;
}

export default function ServiceCard({ title, description, icon, imageUrl, price }: ServiceCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,91,26,0.08)]">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-8 relative">
        <div className="w-12 h-12 bg-[#FFF3E6] text-brand-primary rounded-2xl flex items-center justify-center mb-6">
          {icon || <PawPrint className="w-6 h-6" />}
        </div>
        
        <h3 className="text-xl font-bold text-brand-charcoal mb-3">{title}</h3>
        <p className="text-brand-charcoal/70 leading-relaxed mb-6">
          {description}
        </p>
        
        {price && (
          <div className="font-extrabold text-brand-primary">
            {price}
          </div>
        )}

        {/* Decorative paw print water mark */}
        <PawPrint className="absolute bottom-4 right-4 w-16 h-16 text-brand-charcoal/[0.03] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:text-brand-primary/[0.05]" />
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white py-14 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(75,200,232,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,91,26,0.18),transparent_35%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-extrabold text-brand-primary tracking-tight">
              Pawau<span className="text-white">.</span>
            </Link>
            <p className="mt-4 text-white/70 text-sm leading-relaxed">
              El lugar donde tu mascota recibe el trato boutique que se merece. Cuidado, estilo y mucho amor.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Enlaces</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-white/70 hover:text-brand-blue text-sm transition-colors">Inicio</Link></li>
              <li><Link to="/agendar" className="text-white/70 hover:text-brand-blue text-sm transition-colors">Agendar Cita</Link></li>
              <li><Link to="/contacto" className="text-white/70 hover:text-brand-blue text-sm transition-colors">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Servicios</h3>
            <ul className="space-y-3">
              <li className="text-white/70 text-sm">Grooming Completo</li>
              <li className="text-white/70 text-sm">Bano Spa</li>
              <li className="text-white/70 text-sm">Corte de Unas</li>
              <li className="text-white/70 text-sm">Boutique</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="text-white/70 text-sm">Direccion: Calle Principal 123, Ciudad</li>
              <li className="text-white/70 text-sm">Telefono: (555) 123-4567</li>
              <li className="text-white/70 text-sm">Correo: hola@pawau.com</li>
            </ul>
          </div>
        </div>
        
        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/45 text-sm">
            &copy; {new Date().getFullYear()} Pawau Boutique & Spa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

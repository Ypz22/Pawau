import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Servicios', to: '/servicios' },
    { label: 'Agendar Cita', to: '/agendar' },
    { label: 'Contacto', to: '/contacto' },
  ];

  const serviceLinks = [
    { label: 'Grooming Completo', to: '/servicios' },
    { label: 'Baño Spa', to: '/servicios' },
    { label: 'Corte de Uñas', to: '/servicios' },
    { label: 'Boutique', to: '/servicios' },
  ];

  function getLinkClass(path: string) {
    return currentPath === path
      ? 'font-bold text-[#FF5B1A] underline underline-offset-4 opacity-100'
      : 'text-slate-500 underline underline-offset-4 opacity-80 transition-opacity hover:text-[#FF5B1A] hover:opacity-100';
  }

  return (
    <footer className="mt-12 w-full rounded-t-[48px] border-t border-[#FFF3E6] bg-white text-sm text-[#4BC8E8] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-8 py-12 text-center md:grid-cols-4 md:text-left">
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xl font-bold text-[#FF5B1A]">
            Pawau
          </Link>
          <p className="text-slate-500">© 2024 Pawau. Todos los derechos reservados.</p>
        </div>

        <div className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.label} className={getLinkClass(link.to)} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {serviceLinks.map((link) => (
            <Link key={link.label} className={getLinkClass(link.to)} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-slate-500">@pawau_ec</span>
          <span className="text-slate-500">Ibarra, Ecuador</span>
          <span className="text-slate-500">+593 99 999 9999</span>
          <Link className="text-slate-400 underline underline-offset-4 opacity-70 transition-opacity hover:text-[#FF5B1A] hover:opacity-100" to="/admin/login">
            Acceso administrativo
          </Link>
        </div>
      </div>
    </footer>
  );
}

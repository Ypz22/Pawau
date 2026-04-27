import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full rounded-b-[32px] bg-[#FFF3E6]/80 shadow-[0_10px_30px_rgba(255,91,26,0.05)] backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex shrink-0 items-center">
          <Link to="/" className="flex items-center gap-1 text-2xl font-black tracking-tight text-[#FF5B1A]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            Pawau
          </Link>
        </div>
        
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold tracking-tight transition-colors ${
                location.pathname === link.path ? 'text-[#FF5B1A]' : 'text-slate-600 hover:text-[#FF5B1A]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button to="/agendar">Agendar Cita</Button>
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#5B4138] transition-colors hover:text-[#FF5B1A]"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-[#E4BEB3] bg-[#FFF8F6]/95 px-6 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-[#FFF1ED] hover:text-[#FF5B1A]"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-3">
              <Button to="/agendar" className="w-full justify-center">
                Agendar Cita
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

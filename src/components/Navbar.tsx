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
    <nav className="fixed w-full z-50 bg-brand-cream/78 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_30px_rgba(45,41,38,0.05)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-brand-primary tracking-tight">
              Pawau<span className="text-brand-charcoal"> Boutique & Spa</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold tracking-wide transition-colors ${
                  location.pathname === link.path ? 'text-brand-primary' : 'text-brand-charcoal hover:text-brand-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button to="/agendar">Agendar Cita</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-charcoal hover:text-brand-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream/95 backdrop-blur-xl border-t border-brand-charcoal/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-bold text-brand-charcoal hover:text-brand-primary hover:bg-brand-charcoal/5 rounded-md"
              >
                {link.name}
              </Link>
            ))}
            <div className="px-3 py-2 mt-4">
              <Button to="/agendar" className="w-full justify-center">Agendar Cita</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

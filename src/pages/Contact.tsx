import { MapPin, Phone, Mail } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useState } from 'react';

export default function Contact() {
  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-[linear-gradient(180deg,#fff3e6_0%,#fff8f1_52%,#ffffff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal mb-4">Hablemos</h1>
          <p className="text-brand-charcoal/70 text-lg max-w-2xl mx-auto">
            ¿Tienes alguna duda sobre nuestros servicios o productos boutique? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Contact Info */}
          <div className="bg-brand-primary text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 mb-12">
              <h2 className="text-3xl font-extrabold mb-8">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 mr-4 shrink-0 text-brand-cream" />
                  <p className="text-white/90 leading-relaxed">
                    Calle PetFriendly 123, Local 4B.<br />
                    Sector El Bosque, Ciudad, CP 12345
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4 shrink-0 text-brand-cream" />
                  <p className="text-white/90">(555) 123-4567</p>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4 shrink-0 text-brand-cream" />
                  <p className="text-white/90">hola@pawau.com</p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold tracking-wider uppercase mb-4 text-brand-cream/80">Redes Sociales</h3>
              <p className="text-white/90">Encuéntranos como @pawau_spa</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-4 sm:p-8">
            {isSent ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-brand-charcoal mb-2">Mensaje Enviado</h3>
                <p className="text-brand-charcoal/70 mb-6">Gracias por escribirnos. Te responderemos lo antes posible.</p>
                <Button onClick={() => setIsSent(false)} variant="secondary">Enviar otro mensaje</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-brand-charcoal mb-6">Envíanos un mensaje</h2>
                
                <Input
                  label="Nombre Completo"
                  placeholder="Ej. Carlos Mendoza"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
                <Input
                  label="Correo Electrónico"
                  type="email"
                  placeholder="carlos@correo.com"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
                
                <div className="flex flex-col w-full mb-6">
                  <label className="mb-2 text-sm font-bold text-brand-charcoal tracking-wide">Mensaje</label>
                  <textarea 
                    required
                    rows={5}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    className="w-full px-4 py-3 rounded-3xl bg-[#FFF3E6] border-2 border-[#E6D8CA] text-brand-charcoal transition-all duration-300 outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.15)] resize-none"
                    placeholder="¿En qué te podemos ayudar?"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full">
                  Enviar Mensaje
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import { createAppointment, getAvailability, getServices } from '../lib/api';
import {
  formatMoney,
  formatReadableDate,
  getMinBookingDate,
  initialBookingForm,
  type BookingFormState,
  type ServiceItem,
} from '../lib/booking';
import { buildOrganizationSchema } from '../lib/seo';

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''
          }`}
      >
        <option value="">Selecciona...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs font-bold text-red-500">{error}</span>}
    </div>
  );
}

export default function Booking() {
  const bookingSideImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nCWLlQAgdwyJL1SJDBYfCrZUlyA7uS9hnQ&s'; // PON_AQUI_LA_RUTA_DE_LA_IMAGEN_PARA_LA_PAGINA_DE_RESERVAS

  const [form, setForm] = useState<BookingFormState>(initialBookingForm);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<{
    ownerName: string;
    petName: string;
    appointmentDate: string;
    appointmentTime: string;
    serviceName: string;
  } | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId),
    [form.serviceId, services]
  );

  useEffect(() => {
    async function loadInitialData() {
      try {
        const servicesResponse = await getServices();
        setServices(servicesResponse.services);
      } catch {
        setFormMessage('No pudimos cargar los horarios en este momento. Intenta nuevamente en unos minutos.');
      }
    }

    void loadInitialData();
  }, []);

  useEffect(() => {
    async function loadSlots() {
      if (!form.date || !form.serviceId) {
        setSlots([]);
        setForm((current) => ({ ...current, time: '' }));
        return;
      }

      setIsLoadingSlots(true);
      setFormMessage('');

      try {
        const response = await getAvailability(form.date, form.serviceId);
        setSlots(response.slots);

        if (!response.slots.includes(form.time)) {
          setForm((current) => ({ ...current, time: '' }));
        }
      } catch {
        setSlots([]);
        setFormMessage('No pudimos consultar la disponibilidad para esa fecha.');
      } finally {
        setIsLoadingSlots(false);
      }
    }

    void loadSlots();
  }, [form.date, form.serviceId, form.time]);

  function updateField<K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setSuccessMessage('');
    setConfirmedBooking(null);

    if (field === 'date' || field === 'serviceId') {
      setForm((current) => ({ ...current, time: '' }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage('');
    setSuccessMessage('');

    try {
      const response = await createAppointment(form);
      const serviceName = services.find((service) => service.id === response.appointment.service_id)?.name ?? 'Servicio';

      setSuccessMessage('Tu cita fue reservada correctamente.');
      setConfirmedBooking({
        ownerName: response.appointment.owner_name,
        petName: response.appointment.pet_name,
        appointmentDate: response.appointment.appointment_date,
        appointmentTime: response.appointment.appointment_time,
        serviceName,
      });
      setForm(initialBookingForm);
      setErrors({});
      setSlots([]);
    } catch (error) {
      const payload = error as { message?: string; errors?: Record<string, string> };
      setFormMessage(payload.message ?? 'No pudimos registrar tu cita.');

      if (payload.errors) {
        setErrors(payload.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background px-6 pb-16 pt-32">
      <Seo
        title="Agenda una Cita para tu Mascota | Pawau Boutique & Spa"
        description="Agenda online una cita para grooming, baño spa o corte de uñas en Pawau Boutique & Spa. Revisa horarios disponibles y reserva en pocos pasos."
        path="/agendar"
        image={bookingSideImage}
        schema={buildOrganizationSchema()}
      />
      <main className="mx-auto w-full max-w-[1280px]">
        <Reveal as="section" className="mb-16 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container">Agendar Cita</p>
            <h1 className="mt-3 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-on-surface">
              Reserva el momento perfecto para consentir a tu mascota.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-[1.6] text-on-surface-variant">
              Elige el servicio, revisa la disponibilidad y confirma tu cita en pocos pasos.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
                <div className="text-3xl font-extrabold text-primary-container">1</div>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Elige</p>
                <p className="mt-2 text-sm text-on-surface-variant">Selecciona el servicio ideal para tu mascota.</p>
              </div>
              <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
                <div className="text-3xl font-extrabold text-primary-container">2</div>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Revisa</p>
                <p className="mt-2 text-sm text-on-surface-variant">Consulta las horas disponibles para la fecha que prefieras.</p>
              </div>
              <div className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
                <div className="text-3xl font-extrabold text-primary-container">3</div>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.05em] text-on-surface">Confirma</p>
                <p className="mt-2 text-sm text-on-surface-variant">Completa tus datos y reserva tu espacio.</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] bg-surface-container-high shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
            {bookingSideImage ? (
              <img
                alt="Mascota lista para su cita"
                className="absolute inset-0 h-full w-full object-cover"
                src={bookingSideImage}
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffd8cb_0%,#ffe9e3_45%,#fff8f6_100%)]" />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-surface/80 to-transparent p-6">
              <div className="rounded-full bg-surface-container-lowest/90 px-6 py-3 text-sm font-bold uppercase tracking-[0.05em] text-on-surface shadow-sm backdrop-blur-sm">
                Horarios visibles y confirmación clara
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="grid gap-8 xl:grid-cols-[1fr_0.82fr]" delay={0.05}>
          <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(255,91,26,0.08)] md:p-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[32px] font-bold leading-[1.2] text-on-surface">Reserva tu cita</h2>
                <p className="mt-2 text-on-surface-variant">Completa el formulario y elige una hora disponible.</p>
              </div>

              {selectedService && (
                <div className="rounded-[1.5rem] bg-surface-container px-5 py-4">
                  <p className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Servicio</p>
                  <p className="mt-1 font-bold text-on-surface">{selectedService.duration} min</p>
                  <p className="font-extrabold text-primary-container">{formatMoney(selectedService.price)}</p>
                </div>
              )}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Tu nombre"
                  placeholder="Ej. Ana Pérez"
                  value={form.ownerName}
                  onChange={(event) => updateField('ownerName', event.target.value)}
                  error={errors.ownerName}
                  required
                />
                <Input
                  label="Teléfono"
                  placeholder="0990000000"
                  value={form.ownerPhone}
                  onChange={(event) => updateField('ownerPhone', event.target.value)}
                  error={errors.ownerPhone}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@correo.com"
                  value={form.ownerEmail}
                  onChange={(event) => updateField('ownerEmail', event.target.value)}
                  error={errors.ownerEmail}
                  required
                />
                <Input
                  label="Nombre de tu mascota"
                  placeholder="Ej. Nala"
                  value={form.petName}
                  onChange={(event) => updateField('petName', event.target.value)}
                  error={errors.petName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectField
                  label="Tipo de mascota"
                  value={form.petType}
                  onChange={(value) => updateField('petType', value as BookingFormState['petType'])}
                  error={errors.petType}
                  options={[
                    { value: 'perro', label: 'Perro' },
                    { value: 'gato', label: 'Gato' },
                    { value: 'otro', label: 'Otro' },
                  ]}
                />
                <SelectField
                  label="Servicio"
                  value={form.serviceId}
                  onChange={(value) => updateField('serviceId', value)}
                  error={errors.serviceId}
                  options={services.map((service) => ({
                    value: service.id,
                    label: `${service.name} · ${service.duration} min`,
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Fecha"
                  type="date"
                  value={form.date}
                  min={getMinBookingDate()}
                  onChange={(event) => updateField('date', event.target.value)}
                  error={errors.date}
                  hint="Domingos cerrados."
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Hora disponible</label>
                  <div className="flex min-h-[56px] flex-wrap items-center gap-2 rounded-[1rem] border border-outline-variant bg-background px-4 py-3">
                    {!form.date || !form.serviceId ? (
                      <span className="text-sm text-on-surface-variant/70">Selecciona fecha y servicio para ver horarios.</span>
                    ) : isLoadingSlots ? (
                      <span className="text-sm text-on-surface-variant/70">Cargando horarios...</span>
                    ) : slots.length === 0 ? (
                      <span className="text-sm text-on-surface-variant/70">No quedan espacios disponibles para esa combinación.</span>
                    ) : (
                      slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => updateField('time', slot)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${form.time === slot
                              ? 'bg-[#FF5B1A] text-white shadow-[0_4px_12px_rgba(255,91,26,0.3)]'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                        >
                          {slot}
                        </button>
                      ))
                    )}
                  </div>
                  {errors.time && <span className="text-xs font-bold text-red-500">{errors.time}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Notas adicionales</label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  placeholder="Alergias, observaciones, raza o detalles de comportamiento..."
                  className="w-full resize-none rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                />
              </div>

              {selectedService && form.date && form.time && (
                <div className="rounded-[1.5rem] bg-surface-container p-5 text-on-surface-variant">
                  <p className="font-bold text-on-surface">Resumen de tu cita</p>
                  <p className="mt-2">
                    {selectedService.name} para {form.petName || 'tu mascota'} el {formatReadableDate(form.date)} a las {form.time}.
                  </p>
                </div>
              )}

              {formMessage && <p className="text-sm font-semibold text-red-600">{formMessage}</p>}
              {successMessage && <p className="text-sm font-semibold text-emerald-600">{successMessage}</p>}

              <Button type="submit" className="w-full py-4 text-base" disabled={isSubmitting}>
                {isSubmitting ? 'Confirmando reserva...' : 'Confirmar y reservar cita'}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-primary-container p-8 text-on-primary-container shadow-[0_15px_30px_rgba(255,91,26,0.15)]">
              <h3 className="text-[32px] font-bold leading-[1.2]">Antes de reservar</h3>
              <div className="mt-6 space-y-4">
                <p>Comparte un teléfono y correo válidos para poder enviarte los datos de la cita.</p>
                <p>En notas puedes indicarnos raza, alergias o cuidados especiales.</p>
                <p>Solo verás horarios disponibles para que reserves con tranquilidad.</p>
              </div>
            </div>

            {confirmedBooking && (
              <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(255,91,26,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F7F3] text-[#25D366]">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-on-surface">Reserva confirmada</h3>
                    <p className="text-on-surface-variant">Aquí tienes el resumen de tu cita.</p>
                  </div>
                </div>

                <div className="space-y-3 text-on-surface-variant">
                  <p><span className="font-bold text-on-surface">Cliente:</span> {confirmedBooking.ownerName}</p>
                  <p><span className="font-bold text-on-surface">Mascota:</span> {confirmedBooking.petName}</p>
                  <p><span className="font-bold text-on-surface">Servicio:</span> {confirmedBooking.serviceName}</p>
                  <p><span className="font-bold text-on-surface">Fecha:</span> {formatReadableDate(confirmedBooking.appointmentDate)}</p>
                  <p><span className="font-bold text-on-surface">Hora:</span> {confirmedBooking.appointmentTime}</p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </main>
    </div>
  );
}

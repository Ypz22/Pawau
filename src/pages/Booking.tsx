import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  PawPrint,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import {
  createAppointment,
  getAppointments,
  getAvailability,
  getServices,
  updateAppointmentStatus,
} from '../lib/api';
import {
  formatMoney,
  formatReadableDate,
  getMinBookingDate,
  initialBookingForm,
  petTypeLabelMap,
  statusLabelMap,
  type Appointment,
  type AppointmentStatus,
  type BookingFormState,
  type ServiceItem,
} from '../lib/booking';

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
    <div className="flex flex-col w-full mb-4">
      <label className="mb-2 text-sm font-bold text-brand-charcoal tracking-wide">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full px-4 py-3 rounded-full bg-[#FFF3E6] border-2 border-[#E6D8CA] text-brand-charcoal transition-all duration-300 outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.15)] appearance-none ${
          error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,0,0,0.15)]' : ''
        }`}
      >
        <option value="">Selecciona...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-xs font-bold text-red-500 ml-4">{error}</span>}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col w-full mb-6">
      <label className="mb-2 text-sm font-bold text-brand-charcoal tracking-wide">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 rounded-3xl bg-[#FFF3E6] border-2 border-[#E6D8CA] text-brand-charcoal transition-all duration-300 outline-none focus:border-brand-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.15)] resize-none"
        placeholder="Alergias, observaciones, raza o detalles de comportamiento..."
      />
    </div>
  );
}

function getStatusClasses(status: AppointmentStatus) {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700';
    case 'completed':
      return 'bg-sky-100 text-sky-700';
    case 'cancelled':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

export default function Booking() {
  const [form, setForm] = useState<BookingFormState>(initialBookingForm);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [adminDateFilter, setAdminDateFilter] = useState('');

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId),
    [form.serviceId, services]
  );

  const todayAppointments = appointments.filter(
    (appointment) => appointment.appointment_date === (adminDateFilter || getMinBookingDate())
  );

  const appointmentSummary = {
    total: appointments.length,
    pending: appointments.filter((appointment) => appointment.status === 'pending').length,
    confirmed: appointments.filter((appointment) => appointment.status === 'confirmed').length,
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [servicesResponse, appointmentsResponse] = await Promise.all([
          getServices(),
          getAppointments(),
        ]);

        setServices(servicesResponse.services);
        setAppointments(appointmentsResponse.appointments);
      } catch {
        setFormMessage('No pudimos cargar la informacion inicial. Verifica que el servidor local este encendido.');
      } finally {
        setIsLoadingAppointments(false);
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

  async function refreshAppointments() {
    const response = await getAppointments(adminDateFilter ? { date: adminDateFilter } : undefined);
    setAppointments(response.appointments);
  }

  function updateField<K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setSuccessMessage('');

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
      setSuccessMessage(`${response.message} Te esperamos el ${formatReadableDate(response.appointment.appointment_date)} a las ${response.appointment.appointment_time}.`);
      setForm(initialBookingForm);
      setErrors({});
      setSlots([]);
      await refreshAppointments();
    } catch (error) {
      const payload = error as { message?: string; errors?: Record<string, string> };
      setFormMessage(payload.message ?? 'No pudimos registrar la cita.');

      if (payload.errors) {
        setErrors(payload.errors);
      }

      if (!payload.errors && form.date && form.serviceId) {
        try {
          const response = await getAvailability(form.date, form.serviceId);
          setSlots(response.slots);
        } catch {
          setSlots([]);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(id: number, status: AppointmentStatus) {
    setAdminMessage('');

    try {
      await updateAppointmentStatus(id, status);
      await refreshAppointments();
      setAdminMessage('El estado de la cita se actualizo correctamente.');
    } catch {
      setAdminMessage('No pudimos actualizar el estado de la cita.');
    }
  }

  async function applyAdminFilter(date: string) {
    setAdminDateFilter(date);
    setIsLoadingAppointments(true);

    try {
      const response = await getAppointments(date ? { date } : undefined);
      setAppointments(response.appointments);
    } catch {
      setAdminMessage('No pudimos cargar las citas filtradas.');
    } finally {
      setIsLoadingAppointments(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-[linear-gradient(180deg,#fff3e6_0%,#fffaf4_48%,#ffffff_100%)]">
      <section className="relative overflow-hidden border-b border-brand-charcoal/5">
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_right,rgba(75,200,232,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,91,26,0.14),transparent_38%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-brand-primary shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                Agenda con control real de horarios
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-brand-charcoal leading-tight">
                Citas conectadas a una agenda real para evitar cruces y mantener el control del dia.
              </h1>
              <p className="mt-5 text-lg text-brand-charcoal/70 max-w-2xl leading-relaxed">
                Cada reserva se guarda en una base de datos SQLite, consulta disponibilidad por servicio y permite administrar estados desde el mismo panel.
              </p>
              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white/90 p-5 shadow-[0_14px_40px_rgba(45,41,38,0.06)]">
                  <div className="text-3xl font-extrabold text-brand-primary">{appointmentSummary.total}</div>
                  <p className="mt-2 text-sm text-brand-charcoal/65">Citas registradas</p>
                </div>
                <div className="rounded-3xl bg-white/90 p-5 shadow-[0_14px_40px_rgba(45,41,38,0.06)]">
                  <div className="text-3xl font-extrabold text-amber-600">{appointmentSummary.pending}</div>
                  <p className="mt-2 text-sm text-brand-charcoal/65">Pendientes de confirmar</p>
                </div>
                <div className="rounded-3xl bg-white/90 p-5 shadow-[0_14px_40px_rgba(45,41,38,0.06)]">
                  <div className="text-3xl font-extrabold text-sky-600">{appointmentSummary.confirmed}</div>
                  <p className="mt-2 text-sm text-brand-charcoal/65">Confirmadas</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-brand-charcoal text-white p-8 shadow-[0_24px_60px_rgba(45,41,38,0.16)] relative overflow-hidden">
              <PawPrint className="absolute -top-8 -right-8 h-32 w-32 text-white/5 rotate-12" />
              <h2 className="text-2xl font-extrabold">Como funciona ahora la agenda</h2>
              <div className="mt-6 space-y-4 text-white/85">
                <div className="flex gap-3">
                  <CalendarDays className="w-5 h-5 mt-0.5 text-brand-blue shrink-0" />
                  <p>Los horarios disponibles cambian segun la fecha y la duracion del servicio.</p>
                </div>
                <div className="flex gap-3">
                  <Clock3 className="w-5 h-5 mt-0.5 text-brand-blue shrink-0" />
                  <p>La logica evita citas traslapadas y bloquea horas pasadas o fuera del horario laboral.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-brand-blue shrink-0" />
                  <p>El panel administrativo permite confirmar, completar o cancelar reservas en segundos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid xl:grid-cols-[1fr_1.1fr] gap-8 items-start">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(45,41,38,0.07)] border border-white/80">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-charcoal">Reserva tu cita</h2>
                <p className="mt-2 text-brand-charcoal/65">
                  Completa el formulario y escoge solo horas que esten realmente libres.
                </p>
              </div>
              {selectedService && (
                <div className="rounded-2xl bg-brand-cream px-4 py-3 text-right min-w-36">
                  <div className="text-sm text-brand-charcoal/55">Servicio</div>
                  <div className="font-bold text-brand-charcoal">{selectedService.duration} min</div>
                  <div className="text-brand-primary font-extrabold">{formatMoney(selectedService.price)}</div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Tu Nombre"
                  placeholder="Ej. Ana Perez"
                  value={form.ownerName}
                  onChange={(event) => updateField('ownerName', event.target.value)}
                  error={errors.ownerName}
                  required
                />
                <Input
                  label="Telefono"
                  placeholder="0990000000"
                  value={form.ownerPhone}
                  onChange={(event) => updateField('ownerPhone', event.target.value)}
                  error={errors.ownerPhone}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Correo Electronico"
                  type="email"
                  placeholder="hola@correo.com"
                  value={form.ownerEmail}
                  onChange={(event) => updateField('ownerEmail', event.target.value)}
                  error={errors.ownerEmail}
                  required
                />
                <Input
                  label="Nombre de tu Mascota"
                  placeholder="Ej. Nala"
                  value={form.petName}
                  onChange={(event) => updateField('petName', event.target.value)}
                  error={errors.petName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectField
                  label="Tipo de Mascota"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <div className="flex flex-col w-full mb-4">
                  <label className="mb-2 text-sm font-bold text-brand-charcoal tracking-wide">Hora disponible</label>
                  <div className="w-full px-4 py-3 rounded-3xl bg-[#FFF8F1] border-2 border-[#F1E1D1] min-h-[56px] flex flex-wrap gap-2 items-center">
                    {!form.date || !form.serviceId ? (
                      <span className="text-sm text-brand-charcoal/50">Selecciona fecha y servicio para ver horarios.</span>
                    ) : isLoadingSlots ? (
                      <span className="inline-flex items-center gap-2 text-sm text-brand-charcoal/60">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Cargando horarios...
                      </span>
                    ) : slots.length === 0 ? (
                      <span className="text-sm text-brand-charcoal/50">No quedan espacios para esa combinacion.</span>
                    ) : (
                      slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => updateField('time', slot)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                            form.time === slot
                              ? 'bg-brand-primary text-white shadow-[0_8px_18px_rgba(255,91,26,0.3)]'
                              : 'bg-white text-brand-charcoal hover:bg-brand-cream'
                          }`}
                        >
                          {slot}
                        </button>
                      ))
                    )}
                  </div>
                  {errors.time && <span className="mt-1 text-xs font-bold text-red-500 ml-4">{errors.time}</span>}
                </div>
              </div>

              <TextareaField
                label="Notas adicionales"
                value={form.notes}
                onChange={(value) => updateField('notes', value)}
              />

              {formMessage && <p className="text-sm font-semibold text-red-600">{formMessage}</p>}
              {successMessage && <p className="text-sm font-semibold text-emerald-600">{successMessage}</p>}

              <Button type="submit" className="w-full text-lg py-4" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando cita...' : 'Agendar cita'}
              </Button>
            </form>
          </div>

          <div className="bg-brand-charcoal rounded-[2rem] p-6 sm:p-8 text-white shadow-[0_20px_50px_rgba(45,41,38,0.18)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
              <div>
                <h2 className="text-3xl font-extrabold">Administracion de citas</h2>
                <p className="mt-2 text-white/70">
                  Revisa las reservas guardadas en la base local y actualiza su estado.
                </p>
              </div>
              <Input
                label="Filtrar por fecha"
                type="date"
                value={adminDateFilter}
                onChange={(event) => void applyAdminFilter(event.target.value)}
                className="bg-white text-brand-charcoal"
              />
            </div>

            {adminMessage && <p className="mb-4 text-sm font-semibold text-brand-blue">{adminMessage}</p>}

            {isLoadingAppointments ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
                Cargando citas...
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
                Aun no hay citas registradas para mostrar.
              </div>
            ) : (
              <div className="space-y-4 max-h-[920px] overflow-y-auto pr-1">
                {appointments.map((appointment) => {
                  const service = services.find((item) => item.id === appointment.service_id);

                  return (
                    <article
                      key={appointment.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-bold">
                              {appointment.pet_name} · {service?.name ?? appointment.service_id}
                            </h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(appointment.status)}`}>
                              {statusLabelMap[appointment.status]}
                            </span>
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-white/70">
                            <p>
                              Cliente: <span className="text-white font-medium">{appointment.owner_name}</span>
                            </p>
                            <p>
                              Mascota: <span className="text-white font-medium">{petTypeLabelMap[appointment.pet_type]}</span>
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-brand-blue" />
                              {formatReadableDate(appointment.appointment_date)} · {appointment.appointment_time}
                            </p>
                            <p className="inline-flex items-center gap-2">
                              <Phone className="w-4 h-4 text-brand-blue" />
                              {appointment.owner_phone}
                            </p>
                            <p className="inline-flex items-center gap-2 break-all">
                              <Mail className="w-4 h-4 text-brand-blue" />
                              {appointment.owner_email}
                            </p>
                            {appointment.notes && <p>Notas: {appointment.notes}</p>}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            className="bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => void handleStatusChange(appointment.id, 'confirmed')}
                          >
                            Confirmar
                          </Button>
                          <Button
                            type="button"
                            className="bg-sky-500 hover:bg-sky-600"
                            onClick={() => void handleStatusChange(appointment.id, 'completed')}
                          >
                            Completar
                          </Button>
                          <Button
                            type="button"
                            className="bg-rose-500 hover:bg-rose-600"
                            onClick={() => void handleStatusChange(appointment.id, 'cancelled')}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {todayAppointments.length > 0 && (
              <div className="mt-6 rounded-3xl bg-white/[0.08] p-4 text-sm text-white/75">
                Vista del dia: {todayAppointments.length} cita(s) para {formatReadableDate(adminDateFilter || getMinBookingDate())}.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

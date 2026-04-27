import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import { getAdminAppointments } from '../../lib/api';
import type { AdminAppointment } from '../../lib/admin';
import { formatReadableDate, getMinBookingDate } from '../../lib/booking';

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(getMinBookingDate());
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCalendar() {
      try {
        setError('');
        const response = await getAdminAppointments({ date: selectedDate });
        setAppointments(response.appointments);
      } catch {
        setError('No pudimos cargar las citas del calendario.');
      }
    }

    void loadCalendar();
  }, [selectedDate]);

  const grouped = useMemo(() => {
    return [...appointments].sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
  }, [appointments]);

  return (
    <AdminLayout title="Calendario de citas" subtitle="Consulta rápidamente qué reservas hay en una fecha específica y revisa los detalles del día.">
      <Seo
        title="Calendario Administrativo | Pawau Boutique & Spa"
        description="Calendario privado para revisar las citas de Pawau Boutique & Spa."
        path="/admin/calendario"
        noIndex
      />
      <Reveal className="rounded-[2rem] bg-white p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <label className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Selecciona un día</label>
            <input
              className="mt-2 rounded-[1rem] border border-outline-variant bg-background px-4 py-3"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          <div className="rounded-[1.5rem] bg-surface-container px-5 py-4">
            <p className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Agenda del día</p>
            <p className="mt-1 text-xl font-extrabold text-on-surface">{formatReadableDate(selectedDate)}</p>
          </div>
        </div>
      </Reveal>

      {error && <p className="mt-6 text-sm font-semibold text-red-600">{error}</p>}

      <Reveal className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)]" delay={0.05}>
        {grouped.length === 0 ? (
          <p className="text-on-surface-variant">No hay citas programadas para esta fecha.</p>
        ) : (
          <div className="space-y-4">
            {grouped.map((appointment) => (
              <div key={appointment.id} className="rounded-[1.5rem] border border-outline-variant/60 bg-surface-container-low p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-on-surface">
                      {appointment.appointment_time} · {appointment.pet_name} · {appointment.service_name}
                    </p>
                    <p className="mt-1 text-on-surface-variant">
                      {appointment.owner_name} · {appointment.owner_phone} · {appointment.owner_email}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-primary-container">
                    {appointment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </AdminLayout>
  );
}

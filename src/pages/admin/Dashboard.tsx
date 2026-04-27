import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Reveal from '../../components/Reveal';
import { getAdminOverview } from '../../lib/api';
import type { AdminAppointment, AdminOverview } from '../../lib/admin';
import { formatReadableDate } from '../../lib/booking';

const emptyOverview: AdminOverview = {
  summary: {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    total: 0,
  },
  upcoming: [],
};

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview>(emptyOverview);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOverview() {
      try {
        setOverview(await getAdminOverview());
      } catch {
        setError('No pudimos cargar el resumen del panel.');
      }
    }

    void loadOverview();
  }, []);

  const cards = [
    { label: 'Pendientes', value: overview.summary.pending, tone: 'text-amber-600' },
    { label: 'Confirmadas', value: overview.summary.confirmed, tone: 'text-emerald-600' },
    { label: 'Canceladas', value: overview.summary.cancelled, tone: 'text-rose-600' },
    { label: 'Completadas', value: overview.summary.completed, tone: 'text-sky-600' },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Visualiza el estado general de las citas y revisa las próximas reservas de un vistazo.">
      {error && <p className="mb-6 text-sm font-semibold text-red-600">{error}</p>}

      <Reveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[2rem] bg-white p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
            <p className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">{card.label}</p>
            <div className={`mt-3 text-4xl font-black ${card.tone}`}>{card.value}</div>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-8 rounded-[2rem] bg-white p-8 shadow-[0_15px_30px_rgba(255,91,26,0.06)]" delay={0.06}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold text-on-surface">Próximas citas</h3>
            <p className="mt-2 text-on-surface-variant">Las siguientes reservas programadas para los próximos días.</p>
          </div>
        </div>

        {overview.upcoming.length === 0 ? (
          <p className="text-on-surface-variant">No hay citas próximas registradas.</p>
        ) : (
          <div className="grid gap-4">
            {overview.upcoming.map((appointment: AdminAppointment) => (
              <div key={appointment.id} className="rounded-[1.5rem] border border-outline-variant/60 bg-surface-container-low p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-on-surface">
                      {appointment.pet_name} · {appointment.service_name}
                    </p>
                    <p className="mt-1 text-on-surface-variant">
                      {appointment.owner_name} · {formatReadableDate(appointment.appointment_date)} · {appointment.appointment_time}
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

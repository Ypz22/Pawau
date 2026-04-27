import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Reveal from '../../components/Reveal';
import { getAdminAppointments, getAvailability, rescheduleAdminAppointment, updateAdminAppointmentStatus } from '../../lib/api';
import type { AdminAppointment } from '../../lib/admin';
import { formatReadableDate, getMinBookingDate, statusLabelMap, type AppointmentStatus } from '../../lib/booking';

async function fetchAppointments(date?: string, status?: AppointmentStatus | '') {
  return getAdminAppointments({
    date: date || undefined,
    status: status || undefined,
  });
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('');
  const [dateFilter, setDateFilter] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const activeAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === rescheduleId) ?? null,
    [appointments, rescheduleId]
  );

  useEffect(() => {
    let isActive = true;

    async function loadAppointmentsForFilters() {
      try {
        const response = await fetchAppointments(dateFilter, statusFilter);

        if (!isActive) {
          return;
        }

        setError('');
        setAppointments(response.appointments);
      } catch {
        if (!isActive) {
          return;
        }

        setError('No pudimos cargar las citas.');
      }
    }

    void loadAppointmentsForFilters();

    return () => {
      isActive = false;
    };
  }, [dateFilter, statusFilter]);

  useEffect(() => {
    async function loadSlots() {
      if (!activeAppointment || !rescheduleDate) {
        setAvailableSlots([]);
        return;
      }

      try {
        const response = await getAvailability(rescheduleDate, activeAppointment.service_id);
        setAvailableSlots(response.slots);
      } catch {
        setAvailableSlots([]);
      }
    }

    void loadSlots();
  }, [activeAppointment, rescheduleDate]);

  async function handleStatusChange(id: number, status: AppointmentStatus) {
    try {
      setError('');
      await updateAdminAppointmentStatus(id, status);
      setFeedback(
        statusFilter && statusFilter !== status
          ? 'El estado se actualizó correctamente. La cita puede haber salido del filtro actual.'
          : 'El estado de la cita se actualizó correctamente.'
      );
      const response = await fetchAppointments(dateFilter, statusFilter);
      setAppointments(response.appointments);
    } catch (updateError) {
      const payload = updateError as { message?: string };
      setError(payload.message ?? 'No pudimos actualizar el estado de la cita.');
    }
  }

  async function handleReschedule() {
    if (!rescheduleId || !rescheduleDate || !rescheduleTime) {
      setError('Selecciona fecha y hora para reprogramar.');
      return;
    }

    try {
      setError('');
      await rescheduleAdminAppointment(rescheduleId, rescheduleDate, rescheduleTime);
      setFeedback('La cita fue reprogramada correctamente.');
      setRescheduleId(null);
      setRescheduleDate('');
      setRescheduleTime('');
      setAvailableSlots([]);
      const response = await fetchAppointments(dateFilter, statusFilter);
      setAppointments(response.appointments);
    } catch (rescheduleError) {
      const payload = rescheduleError as { message?: string };
      setError(payload.message ?? 'No pudimos reprogramar esa cita.');
    }
  }

  return (
    <AdminLayout title="Listado de citas" subtitle="Administra reservas por día, estado, cliente y servicio desde un solo lugar.">
      <Reveal className="rounded-[2rem] bg-white p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Filtrar por estado</label>
            <select
              className="rounded-[1rem] border border-outline-variant bg-background px-4 py-3"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as AppointmentStatus | '')}
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Filtrar por fecha</label>
            <input
              className="rounded-[1rem] border border-outline-variant bg-background px-4 py-3"
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </div>

          <div className="flex items-end">
            <button
              className="w-full rounded-full border border-outline-variant bg-white px-5 py-3 font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container"
              type="button"
              onClick={() => {
                setDateFilter('');
                setStatusFilter('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </Reveal>

      {(feedback || error) && (
        <p className={`mt-6 text-sm font-semibold ${error ? 'text-red-600' : 'text-emerald-600'}`}>{error || feedback}</p>
      )}

      <Reveal className="mt-8 grid gap-5" delay={0.05}>
        {appointments.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-8 text-on-surface-variant shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
            No hay citas para esos filtros.
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-[2rem] bg-white p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-extrabold text-on-surface">
                      {appointment.pet_name} · {appointment.service_name}
                    </h3>
                    <span className="rounded-full bg-surface-container px-4 py-2 text-sm font-bold text-primary-container">
                      {statusLabelMap[appointment.status]}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-on-surface-variant">
                    <p><span className="font-bold text-on-surface">Cliente:</span> {appointment.owner_name}</p>
                    <p><span className="font-bold text-on-surface">Correo:</span> {appointment.owner_email}</p>
                    <p><span className="font-bold text-on-surface">Teléfono:</span> {appointment.owner_phone}</p>
                    <p><span className="font-bold text-on-surface">Mascota:</span> {appointment.pet_name}</p>
                    <p><span className="font-bold text-on-surface">Servicio:</span> {appointment.service_name}</p>
                    <p><span className="font-bold text-on-surface">Fecha:</span> {formatReadableDate(appointment.appointment_date)}</p>
                    <p><span className="font-bold text-on-surface">Hora:</span> {appointment.appointment_time}</p>
                    {appointment.notes && <p><span className="font-bold text-on-surface">Notas:</span> {appointment.notes}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 xl:max-w-[340px]">
                  <button className="rounded-full bg-emerald-500 px-5 py-3 font-bold text-white transition-all hover:-translate-y-0.5" type="button" onClick={() => void handleStatusChange(appointment.id, 'confirmed')}>
                    Confirmar
                  </button>
                  <button className="rounded-full bg-rose-500 px-5 py-3 font-bold text-white transition-all hover:-translate-y-0.5" type="button" onClick={() => void handleStatusChange(appointment.id, 'cancelled')}>
                    Cancelar
                  </button>
                  <button className="rounded-full bg-sky-500 px-5 py-3 font-bold text-white transition-all hover:-translate-y-0.5" type="button" onClick={() => void handleStatusChange(appointment.id, 'completed')}>
                    Completar
                  </button>
                  <button
                    className="rounded-full border border-outline-variant bg-white px-5 py-3 font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container"
                    type="button"
                    onClick={() => {
                      setRescheduleId(appointment.id);
                      setRescheduleDate(appointment.appointment_date);
                      setRescheduleTime('');
                      setFeedback('');
                      setError('');
                    }}
                  >
                    Reprogramar
                  </button>
                </div>
              </div>

              {rescheduleId === appointment.id && (
                <div className="mt-6 rounded-[1.5rem] bg-surface-container-low p-5">
                  <h4 className="text-lg font-bold text-on-surface">Reprogramar cita</h4>
                  <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr_auto]">
                    <input
                      className="rounded-[1rem] border border-outline-variant bg-white px-4 py-3"
                      type="date"
                      min={getMinBookingDate()}
                      value={rescheduleDate}
                      onChange={(event) => setRescheduleDate(event.target.value)}
                    />

                    <div className="flex flex-wrap gap-2">
                      {availableSlots.length === 0 ? (
                        <span className="self-center text-sm text-on-surface-variant">Selecciona una fecha para ver horarios.</span>
                      ) : (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                              rescheduleTime === slot ? 'bg-[#FF5B1A] text-white' : 'bg-white text-on-surface hover:bg-surface-container'
                            }`}
                            type="button"
                            onClick={() => setRescheduleTime(slot)}
                          >
                            {slot}
                          </button>
                        ))
                      )}
                    </div>

                    <button
                      className="rounded-full bg-[#FF5B1A] px-5 py-3 font-bold text-white transition-all hover:-translate-y-0.5"
                      type="button"
                      onClick={() => void handleReschedule()}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </Reveal>
    </AdminLayout>
  );
}

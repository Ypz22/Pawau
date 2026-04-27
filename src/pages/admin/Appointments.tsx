import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, CalendarClock, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
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
  const [pendingAction, setPendingAction] = useState<string | null>(null);

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
        const response = await getAvailability(rescheduleDate, activeAppointment.service_id, {
          excludeAppointmentId: activeAppointment.id,
        });
        setAvailableSlots(response.slots);
      } catch {
        setAvailableSlots([]);
      }
    }

    void loadSlots();
  }, [activeAppointment, rescheduleDate]);

  async function handleStatusChange(id: number, status: AppointmentStatus) {
    try {
      setPendingAction(`${id}:${status}`);
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
    } finally {
      setPendingAction(null);
    }
  }

  async function handleReschedule() {
    if (!rescheduleId || !rescheduleDate || !rescheduleTime) {
      setError('Selecciona fecha y hora para reprogramar.');
      return;
    }

    try {
      setPendingAction(`${rescheduleId}:reschedule`);
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
    } finally {
      setPendingAction(null);
    }
  }

  function closeReschedulePanel() {
    setRescheduleId(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setAvailableSlots([]);
  }

  function isBusy(actionKey: string) {
    return pendingAction === actionKey;
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

                <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[340px] xl:max-w-[360px]">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(16,185,129,0.18)] transition-all hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-white/80 disabled:shadow-none"
                    type="button"
                    disabled={appointment.status === 'confirmed' || appointment.status === 'completed' || isBusy(`${appointment.id}:confirmed`)}
                    onClick={() => void handleStatusChange(appointment.id, 'confirmed')}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isBusy(`${appointment.id}:confirmed`) ? 'Confirmando...' : 'Confirmar'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(244,63,94,0.18)] transition-all hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-200 disabled:text-white/80 disabled:shadow-none"
                    type="button"
                    disabled={appointment.status === 'cancelled' || appointment.status === 'completed' || isBusy(`${appointment.id}:cancelled`)}
                    onClick={() => void handleStatusChange(appointment.id, 'cancelled')}
                  >
                    <XCircle className="h-4 w-4" />
                    {isBusy(`${appointment.id}:cancelled`) ? 'Cancelando...' : 'Cancelar'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(14,165,233,0.18)] transition-all hover:-translate-y-0.5 hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-200 disabled:text-white/80 disabled:shadow-none"
                    type="button"
                    disabled={appointment.status === 'completed' || appointment.status === 'cancelled' || isBusy(`${appointment.id}:completed`)}
                    onClick={() => void handleStatusChange(appointment.id, 'completed')}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {isBusy(`${appointment.id}:completed`) ? 'Completando...' : 'Completar'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border border-outline-variant bg-white px-5 py-3 text-sm font-bold text-on-surface shadow-[0_10px_20px_rgba(39,24,19,0.05)] transition-all hover:-translate-y-0.5 hover:border-primary-container hover:bg-surface-container-low hover:text-primary-container"
                    type="button"
                    onClick={() => {
                      setRescheduleId(appointment.id);
                      setRescheduleDate(appointment.appointment_date);
                      setRescheduleTime('');
                      setFeedback('');
                      setError('');
                    }}
                  >
                    <CalendarClock className="h-4 w-4" />
                    Reprogramar
                  </button>
                </div>
              </div>

              {rescheduleId === appointment.id && (
                <div className="mt-6 rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(135deg,#fff7f3_0%,#fff1ed_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-on-surface">Reprogramar cita</h4>
                      <p className="text-sm text-on-surface-variant">Elige una nueva fecha y selecciona uno de los horarios disponibles.</p>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:bg-white/70 hover:text-on-surface"
                      type="button"
                      onClick={closeReschedulePanel}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Cerrar
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[220px_1fr]">
                    <input
                      className="rounded-[1rem] border border-outline-variant bg-white px-4 py-3 shadow-[0_8px_18px_rgba(39,24,19,0.04)]"
                      type="date"
                      min={getMinBookingDate()}
                      value={rescheduleDate}
                      onChange={(event) => {
                        setRescheduleDate(event.target.value);
                        setRescheduleTime('');
                      }}
                    />

                    <div className="rounded-[1.25rem] bg-white/80 p-4 shadow-[0_10px_22px_rgba(39,24,19,0.04)]">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-on-surface-variant">Horarios disponibles</p>
                      <div className="flex flex-wrap gap-2">
                      {availableSlots.length === 0 ? (
                        <span className="self-center text-sm text-on-surface-variant">
                          {rescheduleDate ? 'No hay horarios disponibles para esa fecha.' : 'Selecciona una fecha para ver horarios.'}
                        </span>
                      ) : (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                              rescheduleTime === slot
                                ? 'border-[#FF5B1A] bg-[#FF5B1A] text-white shadow-[0_8px_18px_rgba(255,91,26,0.24)]'
                                : 'border-outline-variant bg-white text-on-surface hover:border-primary-container hover:bg-surface-container'
                            }`}
                            type="button"
                            onClick={() => setRescheduleTime(slot)}
                          >
                            {slot}
                          </button>
                        ))
                      )}
                    </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant bg-white px-5 py-3 font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container"
                      type="button"
                      onClick={closeReschedulePanel}
                    >
                      Cancelar
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5B1A] px-6 py-3 font-bold text-white shadow-[0_12px_24px_rgba(255,91,26,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#ff6a30] disabled:cursor-not-allowed disabled:bg-[#ffb59d] disabled:shadow-none"
                      type="button"
                      disabled={!rescheduleTime || isBusy(`${appointment.id}:reschedule`)}
                      onClick={() => void handleReschedule()}
                    >
                      <CalendarClock className="h-4 w-4" />
                      {isBusy(`${appointment.id}:reschedule`) ? 'Guardando...' : 'Guardar nueva fecha'}
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

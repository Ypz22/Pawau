import { useEffect, useMemo, useState } from 'react';
import AdminAppointmentCard from '../../components/admin/AdminAppointmentCard';
import AdminAppointmentFilters from '../../components/admin/AdminAppointmentFilters';
import AdminAppointmentsPagination from '../../components/admin/AdminAppointmentsPagination';
import AdminLayout from '../../components/AdminLayout';
import Reveal from '../../components/Reveal';
import Seo from '../../components/Seo';
import { getAdminAppointments, getAvailability, rescheduleAdminAppointment, updateAdminAppointmentStatus } from '../../lib/api';
import type { AdminAppointment } from '../../lib/admin';
import { type AppointmentStatus } from '../../lib/booking';

async function fetchAppointments(date?: string, status?: AppointmentStatus | '') {
  return getAdminAppointments({
    date: date || undefined,
    status: status || undefined,
  });
}

const PAGE_SIZE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);

  const activeAppointment = useMemo(
    () => appointments.find((appointment) => appointment.id === rescheduleId) ?? null,
    [appointments, rescheduleId]
  );

  const totalPages = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, totalPages);

  const paginatedAppointments = useMemo(() => {
    const start = (visiblePage - 1) * PAGE_SIZE;
    return appointments.slice(start, start + PAGE_SIZE);
  }, [appointments, visiblePage]);

  const paginationWindow = useMemo(() => {
    const start = Math.max(1, visiblePage - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }, [visiblePage, totalPages]);

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
        setCurrentPage(1);
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
      closeReschedulePanel();
      const response = await fetchAppointments(dateFilter, statusFilter);
      setAppointments(response.appointments);
    } catch (rescheduleError) {
      const payload = rescheduleError as { message?: string };
      setError(payload.message ?? 'No pudimos reprogramar esa cita.');
    } finally {
      setPendingAction(null);
    }
  }

  function handleStartReschedule(appointment: AdminAppointment) {
    setRescheduleId(appointment.id);
    setRescheduleDate(appointment.appointment_date);
    setRescheduleTime('');
    setFeedback('');
    setError('');
  }

  function handleRescheduleDateChange(value: string) {
    setRescheduleDate(value);
    setRescheduleTime('');
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
      <Seo
        title="Citas Administrativas | Pawau Boutique & Spa"
        description="Vista privada para gestionar citas de Pawau Boutique & Spa."
        path="/admin/citas"
        noIndex
      />
      <Reveal className="rounded-[2rem] bg-white p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
        <AdminAppointmentFilters
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onStatusChange={setStatusFilter}
          onDateChange={setDateFilter}
          onReset={() => {
            setDateFilter('');
            setStatusFilter('');
          }}
        />
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
          paginatedAppointments.map((appointment) => (
            <AdminAppointmentCard
              key={appointment.id}
              appointment={appointment}
              isRescheduling={rescheduleId === appointment.id}
              rescheduleDate={rescheduleDate}
              rescheduleTime={rescheduleTime}
              availableSlots={availableSlots}
              onStatusChange={(id, status) => void handleStatusChange(id, status)}
              onStartReschedule={handleStartReschedule}
              onCloseReschedule={closeReschedulePanel}
              onRescheduleDateChange={handleRescheduleDateChange}
              onRescheduleTimeChange={setRescheduleTime}
              onSaveReschedule={() => void handleReschedule()}
              isBusy={isBusy}
            />
          ))
        )}
      </Reveal>

      {appointments.length > PAGE_SIZE && (
        <Reveal className="mt-8 rounded-[2rem] bg-white p-5 shadow-[0_15px_30px_rgba(255,91,26,0.06)]" delay={0.08}>
          <AdminAppointmentsPagination
            currentPage={visiblePage}
            totalPages={totalPages}
            totalItems={appointments.length}
            pageSize={PAGE_SIZE}
            paginationWindow={paginationWindow}
            onPageChange={setCurrentPage}
          />
        </Reveal>
      )}
    </AdminLayout>
  );
}

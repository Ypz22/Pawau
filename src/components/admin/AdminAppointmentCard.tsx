import { BadgeCheck, CalendarClock, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { AdminAppointment } from '../../lib/admin';
import { formatReadableDate, getMinBookingDate, statusLabelMap, type AppointmentStatus } from '../../lib/booking';

interface AdminAppointmentCardProps {
  appointment: AdminAppointment;
  isRescheduling: boolean;
  rescheduleDate: string;
  rescheduleTime: string;
  availableSlots: string[];
  onStatusChange: (id: number, status: AppointmentStatus) => void;
  onStartReschedule: (appointment: AdminAppointment) => void;
  onCloseReschedule: () => void;
  onRescheduleDateChange: (value: string) => void;
  onRescheduleTimeChange: (value: string) => void;
  onSaveReschedule: () => void;
  isBusy: (actionKey: string) => boolean;
}

export default function AdminAppointmentCard({
  appointment,
  isRescheduling,
  rescheduleDate,
  rescheduleTime,
  availableSlots,
  onStatusChange,
  onStartReschedule,
  onCloseReschedule,
  onRescheduleDateChange,
  onRescheduleTimeChange,
  onSaveReschedule,
  isBusy,
}: AdminAppointmentCardProps) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[0_15px_30px_rgba(255,91,26,0.06)]">
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
            onClick={() => onStatusChange(appointment.id, 'confirmed')}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isBusy(`${appointment.id}:confirmed`) ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(244,63,94,0.18)] transition-all hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-200 disabled:text-white/80 disabled:shadow-none"
            type="button"
            disabled={appointment.status === 'cancelled' || appointment.status === 'completed' || isBusy(`${appointment.id}:cancelled`)}
            onClick={() => onStatusChange(appointment.id, 'cancelled')}
          >
            <XCircle className="h-4 w-4" />
            {isBusy(`${appointment.id}:cancelled`) ? 'Cancelando...' : 'Cancelar'}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_20px_rgba(14,165,233,0.18)] transition-all hover:-translate-y-0.5 hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-200 disabled:text-white/80 disabled:shadow-none"
            type="button"
            disabled={appointment.status === 'completed' || appointment.status === 'cancelled' || isBusy(`${appointment.id}:completed`)}
            onClick={() => onStatusChange(appointment.id, 'completed')}
          >
            <BadgeCheck className="h-4 w-4" />
            {isBusy(`${appointment.id}:completed`) ? 'Completando...' : 'Completar'}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[1.1rem] border border-outline-variant bg-white px-5 py-3 text-sm font-bold text-on-surface shadow-[0_10px_20px_rgba(39,24,19,0.05)] transition-all hover:-translate-y-0.5 hover:border-primary-container hover:bg-surface-container-low hover:text-primary-container"
            type="button"
            onClick={() => onStartReschedule(appointment)}
          >
            <CalendarClock className="h-4 w-4" />
            Reprogramar
          </button>
        </div>
      </div>

      {isRescheduling && (
        <div className="mt-6 rounded-[1.75rem] border border-outline-variant/60 bg-[linear-gradient(135deg,#fff7f3_0%,#fff1ed_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Reprogramar cita</h4>
              <p className="text-sm text-on-surface-variant">Elige una nueva fecha y selecciona uno de los horarios disponibles.</p>
            </div>
            <button
              className="inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:bg-white/70 hover:text-on-surface"
              type="button"
              onClick={onCloseReschedule}
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
              onChange={(event) => onRescheduleDateChange(event.target.value)}
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
                      onClick={() => onRescheduleTimeChange(slot)}
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
              onClick={onCloseReschedule}
            >
              Cancelar
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5B1A] px-6 py-3 font-bold text-white shadow-[0_12px_24px_rgba(255,91,26,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#ff6a30] disabled:cursor-not-allowed disabled:bg-[#ffb59d] disabled:shadow-none"
              type="button"
              disabled={!rescheduleTime || isBusy(`${appointment.id}:reschedule`)}
              onClick={onSaveReschedule}
            >
              <CalendarClock className="h-4 w-4" />
              {isBusy(`${appointment.id}:reschedule`) ? 'Guardando...' : 'Guardar nueva fecha'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import type { AppointmentStatus } from '../../lib/booking';

interface AdminAppointmentFiltersProps {
  statusFilter: AppointmentStatus | '';
  dateFilter: string;
  onStatusChange: (value: AppointmentStatus | '') => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
}

export default function AdminAppointmentFilters({
  statusFilter,
  dateFilter,
  onStatusChange,
  onDateChange,
  onReset,
}: AdminAppointmentFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Filtrar por estado</label>
        <select
          className="rounded-[1rem] border border-outline-variant bg-background px-4 py-3"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value as AppointmentStatus | '')}
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
          onChange={(event) => onDateChange(event.target.value)}
        />
      </div>

      <div className="flex items-end">
        <button
          className="w-full rounded-full border border-outline-variant bg-white px-5 py-3 font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container"
          type="button"
          onClick={onReset}
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

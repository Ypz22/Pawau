interface AdminAppointmentsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  paginationWindow: number[];
  onPageChange: (page: number) => void;
}

export default function AdminAppointmentsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  paginationWindow,
  onPageChange,
}: AdminAppointmentsPaginationProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-semibold text-on-surface-variant">
        Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalItems)} a {Math.min(currentPage * pageSize, totalItems)} de{' '}
        {totalItems} citas
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Anterior
        </button>

        {paginationWindow.map((page) => (
          <button
            key={page}
            className={`h-11 min-w-11 rounded-full px-4 text-sm font-bold transition-all ${
              page === currentPage
                ? 'bg-[#FF5B1A] text-white shadow-[0_10px_20px_rgba(255,91,26,0.2)]'
                : 'border border-outline-variant bg-white text-on-surface hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container'
            }`}
            type="button"
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

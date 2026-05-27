export type PetType = 'perro' | 'gato' | 'otro';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export const serviceCatalog: ServiceItem[] = [
  {
    id: 'grooming',
    name: 'Grooming Completo',
    description: 'Corte, bano, limpieza de oidos y unas.',
    duration: 120,
    price: 45,
  },
  {
    id: 'bath',
    name: 'Bano Spa',
    description: 'Bano relajante con secado y cepillado.',
    duration: 90,
    price: 25,
  },
  {
    id: 'nails',
    name: 'Solo Unas',
    description: 'Corte de unas y retoque higienico rapido.',
    duration: 45,
    price: 15,
  },
];

export const bookingSettings = {
  openingHour: 9,
  closingHour: 18,
  slotIntervalMinutes: 30,
  maxAppointmentsPerSlot: 1,
  closedWeekdays: [0],
};

export interface Appointment {
  id: number;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  pet_name: string;
  pet_type: PetType;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  start_at: string;
  end_at: string;
  notes: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface BookingFormState {
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  petName: string;
  petType: PetType | '';
  serviceId: string;
  date: string;
  time: string;
  notes: string;
}

export type BookingFieldErrors = Partial<Record<keyof BookingFormState, string>>;

export const initialBookingForm: BookingFormState = {
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  petName: '',
  petType: '',
  serviceId: '',
  date: '',
  time: '',
  notes: '',
};

export const statusLabelMap: Record<AppointmentStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export const petTypeLabelMap: Record<PetType, string> = {
  perro: 'Perro',
  gato: 'Gato',
  otro: 'Otro',
};

const serviceCatalogById = new Map(serviceCatalog.map((service) => [service.id, service]));

export function getServiceById(serviceId: string) {
  return serviceCatalogById.get(serviceId);
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatReadableDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(year, month - 1, day));
}

export function getMinBookingDate() {
  return new Date().toISOString().split('T')[0];
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  const normalized = value.replace(/\D/g, '');
  return normalized.length >= 7;
}

export function validateBookingForm(form: BookingFormState): BookingFieldErrors {
  const errors: BookingFieldErrors = {};

  if (form.ownerName.trim().length < 2) {
    errors.ownerName = 'Ingresa tu nombre completo.';
  }

  if (!isValidPhone(form.ownerPhone.trim())) {
    errors.ownerPhone = 'Ingresa un teléfono válido.';
  }

  if (!isValidEmail(form.ownerEmail.trim())) {
    errors.ownerEmail = 'Ingresa un correo válido.';
  }

  if (form.petName.trim().length < 2) {
    errors.petName = 'Ingresa el nombre de tu mascota.';
  }

  if (!form.petType) {
    errors.petType = 'Selecciona el tipo de mascota.';
  }

  if (!form.serviceId) {
    errors.serviceId = 'Selecciona un servicio.';
  } else if (!getServiceById(form.serviceId)) {
    errors.serviceId = 'El servicio seleccionado no existe.';
  }

  if (!form.date) {
    errors.date = 'Selecciona una fecha.';
  } else if (form.date < getMinBookingDate()) {
    errors.date = 'Selecciona una fecha válida.';
  } else if (bookingSettings.closedWeekdays.includes(new Date(`${form.date}T00:00:00`).getDay())) {
    errors.date = 'No atendemos en la fecha seleccionada.';
  }

  if (!form.time) {
    errors.time = 'Selecciona un horario disponible.';
  }

  return errors;
}

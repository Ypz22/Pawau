import type { User } from '@supabase/supabase-js';
import type { AdminAppointment, AdminOverview } from './admin';
import { isAdminUser, mapAdminUser } from './admin';
import { AppError } from './errors';
import {
  bookingSettings,
  getServiceById,
  serviceCatalog,
  type Appointment,
  type AppointmentStatus,
  type BookingFormState,
  type ServiceItem,
  validateBookingForm,
} from './booking';
import { supabase } from './supabase';

const APPOINTMENTS_TABLE = import.meta.env.VITE_SUPABASE_APPOINTMENTS_TABLE || 'appointments';

function assertNoError(error: { message: string } | null) {
  if (error) {
    throw new AppError(error.message);
  }
}

function toDateTimeParts(date: string, time: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return { year, month, day, hours, minutes };
}

function createLocalDate(date: string, time = '00:00') {
  const { year, month, day, hours, minutes } = toDateTimeParts(date, time);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function toIso(date: string, time: string) {
  return createLocalDate(date, time).toISOString();
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isClosedDay(dateString: string) {
  return bookingSettings.closedWeekdays.includes(createLocalDate(dateString).getDay());
}

function overlaps(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && startB < endA;
}

function hasSlotCapacity(existingAppointments: Appointment[], slotStart: Date, slotEnd: Date) {
  let conflicts = 0;

  for (const appointment of existingAppointments) {
    if (overlaps(slotStart, slotEnd, new Date(appointment.start_at), new Date(appointment.end_at))) {
      conflicts += 1;

      if (conflicts >= bookingSettings.maxAppointmentsPerSlot) {
        return false;
      }
    }
  }

  return true;
}

function normalizeAppointment(appointment: Appointment) {
  return {
    ...appointment,
    id: Number(appointment.id),
  };
}

function serializeAppointmentWithService(appointment: Appointment): AdminAppointment {
  const normalized = normalizeAppointment(appointment);
  const service = getServiceById(normalized.service_id);

  return {
    ...normalized,
    service_name: service?.name ?? normalized.service_id,
    service_duration: service?.duration ?? null,
    service_price: service?.price ?? null,
  };
}

function getStatusSummary(appointments: Appointment[]) {
  return appointments.reduce<Record<AppointmentStatus | 'total', number>>(
    (summary, appointment) => {
      summary[appointment.status] += 1;
      summary.total += 1;
      return summary;
    },
    {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      total: 0,
    }
  );
}

async function requireAdminUser() {
  const { data, error } = await supabase.auth.getUser();

  assertNoError(error);

  const user = data.user;

  if (!isAdminUser(user)) {
    throw new AppError('No autorizado.');
  }

  return user;
}

async function queryAppointments(filters?: { date?: string; status?: AppointmentStatus | ''; activeOnly?: boolean; excludeId?: number }) {
  let query = supabase
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (filters?.date) query = query.eq('appointment_date', filters.date);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.excludeId) query = query.neq('id', filters.excludeId);
  if (filters?.activeOnly) query = query.in('status', ['pending', 'confirmed']);

  const { data, error } = await query;

  assertNoError(error);

  return (data ?? []).map((appointment: Appointment) => normalizeAppointment(appointment));
}

async function getPublicActiveAppointmentsForDate(date: string) {
  const { data, error } = await supabase.rpc('get_public_appointments_for_date', {
    target_date: date,
  });

  assertNoError(error);

  return (data ?? []).map((appointment: Appointment) => normalizeAppointment(appointment));
}

async function getAppointmentsForAvailability(date: string, excludeId?: number) {
  if (excludeId) {
    await requireAdminUser();

    return queryAppointments({
      date,
      excludeId,
      activeOnly: true,
    });
  }

  return getPublicActiveAppointmentsForDate(date);
}

function buildAvailableSlots(existingAppointments: Appointment[], date: string, service: ServiceItem) {
  if (!date || !service || isClosedDay(date)) {
    return [];
  }

  const startOfDay = createLocalDate(date, `${String(bookingSettings.openingHour).padStart(2, '0')}:00`);
  const endOfDay = createLocalDate(date, `${String(bookingSettings.closingHour).padStart(2, '0')}:00`);
  const now = new Date();
  const slots: string[] = [];

  for (
    let slotStart = new Date(startOfDay);
    addMinutes(slotStart, service.duration) <= endOfDay;
    slotStart = addMinutes(slotStart, bookingSettings.slotIntervalMinutes)
  ) {
    const slotEnd = addMinutes(slotStart, service.duration);

    if (slotStart > now && hasSlotCapacity(existingAppointments, slotStart, slotEnd)) {
      slots.push(formatTime(slotStart));
    }
  }

  return slots;
}

export async function getServices() {
  return {
    services: serviceCatalog,
    settings: {
      openingHour: bookingSettings.openingHour,
      closingHour: bookingSettings.closingHour,
    },
  };
}

export async function getAvailability(date: string, serviceId: string, options?: { excludeAppointmentId?: number }) {
  const service = getServiceById(serviceId);

  if (!service) {
    throw new AppError('Servicio inválido.');
  }

  const appointments = await getAppointmentsForAvailability(date, options?.excludeAppointmentId);

  return {
    slots: buildAvailableSlots(appointments, date, service),
  };
}

export async function createAppointment(payload: BookingFormState) {
  const validationErrors = validateBookingForm(payload);

  if (Object.keys(validationErrors).length > 0) {
    throw new AppError('Revisa los campos marcados para continuar.', {
      errors: validationErrors,
    });
  }

  const service = getServiceById(payload.serviceId);

  if (!service) {
    throw new AppError('El servicio seleccionado no existe.');
  }

  const appointments = await getPublicActiveAppointmentsForDate(payload.date);
  const availableSlots = buildAvailableSlots(appointments, payload.date, service);

  if (!availableSlots.includes(payload.time)) {
    throw new AppError('La hora seleccionada ya no esta disponible. Elige otra opcion.');
  }

  const startAt = toIso(payload.date, payload.time);
  const endAt = addMinutes(createLocalDate(payload.date, payload.time), service.duration).toISOString();

  const insertPayload = {
    owner_name: payload.ownerName.trim(),
    owner_phone: payload.ownerPhone.trim(),
    owner_email: payload.ownerEmail.trim(),
    pet_name: payload.petName.trim(),
    pet_type: payload.petType,
    service_id: payload.serviceId,
    appointment_date: payload.date,
    appointment_time: payload.time,
    start_at: startAt,
    end_at: endAt,
    notes: payload.notes?.trim() ?? '',
    status: 'pending',
  };

  const { error } = await supabase.from(APPOINTMENTS_TABLE).insert(insertPayload);

  assertNoError(error);

  return {
    message: 'Cita creada correctamente.',
    appointment: {
      id: 0,
      ...insertPayload,
      created_at: new Date().toISOString(),
    } as Appointment,
  };
}

export async function adminLogin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  assertNoError(error);

  const user = data.user;

  if (!isAdminUser(user)) {
    await supabase.auth.signOut();
    throw new AppError('Tu usuario no tiene permisos de administrador.');
  }

  return {
    admin: mapAdminUser(user),
  };
}

export async function adminMe() {
  const user = await requireAdminUser();

  return {
    admin: mapAdminUser(user),
  };
}

export async function adminLogout() {
  const { error } = await supabase.auth.signOut();

  assertNoError(error);

  return { ok: true };
}

export async function getAdminOverview() {
  await requireAdminUser();
  const appointments = await queryAppointments();
  const upcoming = appointments
    .filter((appointment) => new Date(appointment.start_at) >= new Date())
    .slice(0, 5)
    .map(serializeAppointmentWithService);

  return {
    summary: getStatusSummary(appointments),
    upcoming,
  } satisfies AdminOverview;
}

export async function getAdminAppointments(filters?: { date?: string; status?: AppointmentStatus | '' }) {
  await requireAdminUser();
  const appointments = await queryAppointments({
    date: filters?.date,
    status: filters?.status,
  });

  return {
    appointments: appointments.map(serializeAppointmentWithService),
    summary: getStatusSummary(appointments),
  };
}

export async function updateAdminAppointmentStatus(id: number, status: AppointmentStatus) {
  await requireAdminUser();

  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  assertNoError(error);

  return {
    appointment: serializeAppointmentWithService(data as Appointment),
    message: 'Estado actualizado.',
  };
}

export async function rescheduleAdminAppointment(id: number, date: string, time: string) {
  await requireAdminUser();

  if (!date || !time) {
    throw new AppError('Selecciona una fecha y una hora válidas.');
  }

  const appointments = await queryAppointments({
    date,
    excludeId: id,
    activeOnly: true,
  });

  const { data: currentAppointment, error: currentAppointmentError } = await supabase
    .from(APPOINTMENTS_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  assertNoError(currentAppointmentError);

  const appointment = normalizeAppointment(currentAppointment as Appointment);
  const service = getServiceById(appointment.service_id);

  if (!service) {
    throw new AppError('El servicio de la cita no es valido.');
  }

  const availableSlots = buildAvailableSlots(appointments, date, service);

  if (!availableSlots.includes(time)) {
    throw new AppError('Ese horario no esta disponible para reprogramar.');
  }

  const startAt = toIso(date, time);
  const endAt = addMinutes(createLocalDate(date, time), service.duration).toISOString();

  const { data, error } = await supabase
    .from(APPOINTMENTS_TABLE)
    .update({
      appointment_date: date,
      appointment_time: time,
      start_at: startAt,
      end_at: endAt,
      status: 'confirmed',
    })
    .eq('id', id)
    .select('*')
    .single();

  assertNoError(error);

  return {
    appointment: serializeAppointmentWithService(data as Appointment),
    message: 'Cita reprogramada correctamente.',
  };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  assertNoError(error);

  return data.user as User | null;
}

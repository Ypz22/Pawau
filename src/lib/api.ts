import type { Appointment, AppointmentStatus, BookingFormState, ServiceItem } from './booking';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw data;
  }

  return data as T;
}

export function getServices() {
  return request<{ services: ServiceItem[]; settings: { openingHour: number; closingHour: number } }>('/api/services');
}

export function getAvailability(date: string, serviceId: string) {
  return request<{ slots: string[] }>(`/api/availability?date=${date}&serviceId=${serviceId}`);
}

export function createAppointment(payload: BookingFormState) {
  return request<{ appointment: Appointment; message: string }>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAppointments(filters?: { date?: string; status?: AppointmentStatus | '' }) {
  const params = new URLSearchParams();

  if (filters?.date) params.set('date', filters.date);
  if (filters?.status) params.set('status', filters.status);

  return request<{ appointments: Appointment[] }>(`/api/appointments?${params.toString()}`);
}

export function updateAppointmentStatus(id: number, status: AppointmentStatus) {
  return request<{ appointment: Appointment; message: string }>(`/api/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

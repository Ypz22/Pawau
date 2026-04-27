import type { AdminAppointment, AdminOverview, AdminUser } from './admin';
import { clearAdminToken, getAdminToken } from './admin';
import type { Appointment, AppointmentStatus, BookingFormState, ServiceItem } from './booking';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw data;
  }

  return data as T;
}

async function adminRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  
  try {
    return await request<T>(input, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const payload = error as { message?: string };

    if (payload?.message === 'No autorizado.') {
      clearAdminToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    throw error;
  }
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

export function adminLogin(email: string, password: string) {
  return request<{ token: string; admin: AdminUser }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function adminMe() {
  return adminRequest<{ admin: AdminUser }>('/api/admin/me');
}

export function adminLogout() {
  return adminRequest<{ ok: boolean }>('/api/admin/logout', {
    method: 'POST',
  });
}

export function getAdminOverview() {
  return adminRequest<AdminOverview>('/api/admin/overview');
}

export function getAdminAppointments(filters?: { date?: string; status?: AppointmentStatus | '' }) {
  const params = new URLSearchParams();

  if (filters?.date) params.set('date', filters.date);
  if (filters?.status) params.set('status', filters.status);

  return adminRequest<{ appointments: AdminAppointment[]; summary: Record<AppointmentStatus | 'total', number> }>(
    `/api/admin/appointments?${params.toString()}`
  );
}

export function updateAdminAppointmentStatus(id: number, status: AppointmentStatus) {
  return adminRequest<{ appointment: AdminAppointment; message: string }>(`/api/admin/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function rescheduleAdminAppointment(id: number, date: string, time: string) {
  return adminRequest<{ appointment: AdminAppointment; message: string }>(`/api/admin/appointments/${id}/reschedule`, {
    method: 'PATCH',
    body: JSON.stringify({ date, time }),
  });
}

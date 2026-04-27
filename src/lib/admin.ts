import type { Appointment, AppointmentStatus } from './booking';

export interface AdminUser {
  email: string;
  createdAt?: string;
}

export interface AdminOverview {
  summary: Record<AppointmentStatus | 'total', number>;
  upcoming: AdminAppointment[];
}

export interface AdminAppointment extends Appointment {
  service_name: string;
  service_duration: number | null;
  service_price: number | null;
}

export const ADMIN_TOKEN_KEY = 'pawau_admin_token';

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) ?? '';
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

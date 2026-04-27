import type { User } from '@supabase/supabase-js';
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

export function isAdminUser(user: User | null | undefined) {
  return user?.app_metadata?.role === 'admin';
}

export function mapAdminUser(user: User): AdminUser {
  return {
    email: user.email ?? '',
    createdAt: user.created_at,
  };
}

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminToken } from '../lib/admin';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

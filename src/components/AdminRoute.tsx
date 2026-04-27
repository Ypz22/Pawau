import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminUser } from '../lib/admin';
import { getCurrentUser } from '../lib/api';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    let active = true;

    async function verifyAdminAccess() {
      try {
        const user = await getCurrentUser();

        if (!active) return;
        setStatus(isAdminUser(user) ? 'allowed' : 'denied');
      } catch {
        if (!active) return;
        setStatus('denied');
      }
    }

    void verifyAdminAccess();

    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return <div className="min-h-screen bg-background" />;
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

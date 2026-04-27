import type { ReactNode } from 'react';
import { CalendarDays, ClipboardList, LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { adminLogout } from '../lib/api';

interface AdminLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/citas', label: 'Citas', icon: ClipboardList },
  { to: '/admin/calendario', label: 'Calendario', icon: CalendarDays },
];

export default function AdminLayout({ title, subtitle, children }: AdminLayoutProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await adminLogout();
    } finally {
      navigate('/admin/login', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f6_0%,#fff1ed_100%)]">
      <div className="mx-auto grid min-h-screen max-w-[1440px] gap-0 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-outline-variant/50 bg-white/75 p-6 backdrop-blur-xl">
          <div className="rounded-[2rem] bg-primary-container p-6 text-white shadow-[0_15px_30px_rgba(255,91,26,0.18)]">
            <p className="text-sm font-bold uppercase tracking-[0.05em] text-white/80">Panel privado</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Pawau Admin</h1>
            <p className="mt-3 text-sm text-white/80">Gestiona citas, confirma reservas y organiza tu calendario.</p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-[1.25rem] px-4 py-3 font-bold transition-all ${
                      isActive
                        ? 'bg-surface-container text-primary-container shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-white px-5 py-3 font-bold text-on-surface transition-all hover:-translate-y-0.5 hover:border-primary-container hover:text-primary-container"
            onClick={() => void handleLogout()}
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </aside>

        <main className="px-6 py-10 md:px-10">
          <header className="mb-8 rounded-[2rem] bg-white p-8 shadow-[0_12px_30px_rgba(255,91,26,0.06)]">
            <p className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container">Administrador</p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-[-0.02em] text-on-surface">{title}</h2>
            <p className="mt-3 max-w-2xl text-on-surface-variant">{subtitle}</p>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

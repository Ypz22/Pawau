import { useState } from 'react';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { adminLogin } from '../../lib/api';
import { setAdminToken } from '../../lib/admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await adminLogin(email, password);
      setAdminToken(response.token);
      const nextPath = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';
      navigate(nextPath, { replace: true });
    } catch (loginError) {
      const payload = loginError as { message?: string };
      setError(payload.message ?? 'No pudimos iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff8f6_0%,#ffe9e3_100%)] px-6 py-12">
      <div className="mx-auto mb-6 max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-on-surface shadow-[0_10px_24px_rgba(255,91,26,0.08)] transition-all hover:-translate-y-0.5 hover:text-primary-container"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la página del cliente
        </Link>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-primary-container p-10 text-white shadow-[0_20px_50px_rgba(255,91,26,0.2)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.05em]">
            <ShieldCheck className="h-4 w-4" />
            Acceso administrativo
          </div>
          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-0.03em]">Gestiona las citas de Pawau desde un panel privado.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Revisa reservas pendientes, confirma, cancela o reprograma citas y mantén organizado el calendario del negocio.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_rgba(255,91,26,0.08)] md:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary-container">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.05em] text-primary-container">Iniciar sesión</p>
              <h2 className="text-3xl font-extrabold text-on-surface">Panel de administrador</h2>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Correo</label>
              <input
                className="w-full rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@pawau.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="ml-1 text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant">Contraseña</label>
              <input
                className="w-full rounded-[1rem] border border-outline-variant bg-background px-4 py-3 text-on-surface outline-none transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <button
              className="w-full rounded-full bg-[#FF5B1A] px-6 py-4 font-bold text-white shadow-[0_4px_12px_rgba(255,91,26,0.3)] transition-all hover:-translate-y-0.5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ingresando...' : 'Entrar al panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

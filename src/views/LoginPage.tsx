import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Field } from '../ui/Field';
import { Button } from '../ui/Button';
import { useAuth } from '../state/auth/useAuth';

export default function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      nav('/profile');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'No se pudo iniciar sesión.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Enter your credentials to access your account.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label="Email" value={email} onChange={setEmail} autoComplete="email" />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-slate-900 underline dark:text-slate-50">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}


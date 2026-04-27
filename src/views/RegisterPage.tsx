import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Field } from '../ui/Field';
import { Button } from '../ui/Button';
import { useAuth } from '../state/auth/useAuth';

export default function RegisterPage() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, username, password);
      nav('/profile');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'No se pudo crear la cuenta.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold">Register</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create your account to save animes.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label="Email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Username" value={username} onChange={setUsername} autoComplete="username" />
          <Field
            label="Password (minimum 6 characters)"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 underline dark:text-slate-50">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}


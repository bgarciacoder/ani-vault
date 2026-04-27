import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../state/auth/useAuth';

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-lg px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
            : 'text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { token, user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="container-app flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="https://i.postimg.cc/hjKMQTFj/anivault-logo.png" alt="Logo de anivault" width={100} />
        </Link>

        <nav className="flex items-center gap-2">
          <NavItem to="/">Home</NavItem>
          {token ? (
            <>
              <NavItem to="/profile">Profile</NavItem>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Logout
              </button>
              <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
                {user?.username}
              </span>
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Register</NavItem>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


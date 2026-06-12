import { useState } from 'react';
import { Lock, Pizza, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login, isAdmin } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-600/30">
            <Pizza className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Painel Admin</h1>
          <p className="text-slate-400">Digite a senha para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Senha de acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Digite a senha"
                className="w-full pl-12 pr-12 py-3.5 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-white placeholder-slate-400"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 animate-fade-in">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-primary text-white py-3.5 rounded-xl font-bold text-lg"
          >
            Entrar
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}

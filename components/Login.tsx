import Logo from './Logo';
import { LogIn, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onGoToStore: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Credenciales inválidas o usuario inactivo.');
      }
    } catch (err: any) {
      if (err.message.includes('network error')) {
        setError('Error de conexión. Por favor, revisa tu conexión a internet.');
      } else {
        setError('Ocurrió un error al intentar ingresar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 pb-0 flex justify-center">
            <div className="w-48">
                <Logo />
            </div>
        </div>

        <div className="p-8 pt-6">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Acceso Administrativo</h2>
          <p className="text-center text-slate-500 mb-8">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuario (Email)</label>
              <input
                type="email"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                placeholder="usuario@mw.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-600 text-white font-bold py-3 rounded-lg hover:bg-lime-700 transition-colors shadow-lg shadow-lime-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? 'Verificando...' : (
                <>
                  <LogIn size={20} />
                  Ingresar al Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-slate-500 text-sm mb-4">¿Eres cliente?</p>
             <button 
                onClick={onGoToStore}
                className="text-lime-700 hover:text-lime-800 font-medium text-sm flex items-center justify-center gap-1 mx-auto group"
             >
                Ir al Sitio Web Público
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </div>
      <p className="text-slate-600 mt-8 text-sm">&copy; {new Date().getFullYear()} MW Servicio Comercial</p>
    </div>
  );
};

export default Login;

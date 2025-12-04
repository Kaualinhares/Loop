import React, { useState } from 'react';
import { Logo } from './Logo';
import { ArrowRight, Mail, Lock, User, AlertCircle, AtSign } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Form State
  const [identifier, setIdentifier] = useState(''); // Email ou Telefone
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState(''); // New username field
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const validateForm = (): boolean => {
    // Reset error
    setError(null);

    // Validação de Senha (6 a 20 caracteres)
    if (password.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres.");
        return false;
    }
    if (password.length > 20) {
        setError("A senha deve ter no máximo 20 caracteres.");
        return false;
    }

    if (!identifier.trim()) {
        setError("Por favor, informe seu email ou telefone.");
        return false;
    }

    if (!isLoginMode) {
        if (!name.trim()) {
            setError("Por favor, informe seu nome.");
            return false;
        }
        if (!handle.trim()) {
            setError("Por favor, crie um nome de usuário.");
            return false;
        }
    }

    return true;
  };

  const handleRegister = () => {
      // Simulação de Backend usando LocalStorage
      const existingUser = localStorage.getItem(`user_${identifier}`);
      
      if (existingUser) {
          setError("Este email ou telefone já está cadastrado. Faça login.");
          setIsLoading(false);
          return;
      }

      // Format handle
      const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;

      // Salva o usuário "no banco"
      const userData = { name, identifier, password, handle: formattedHandle };
      localStorage.setItem(`user_${identifier}`, JSON.stringify(userData));
      
      // Update the mocked current user service for the demo
      // In a real app, this would be a server response
      localStorage.setItem('temp_reg_handle', formattedHandle);
      localStorage.setItem('temp_reg_name', name);

      setSuccessMsg("Conta criada com sucesso! Fazendo login...");
      
      setTimeout(() => {
          onLogin();
      }, 1000);
  };

  const handleLoginAuth = () => {
      // Verifica se o usuário existe no LocalStorage
      const userRecord = localStorage.getItem(`user_${identifier}`);

      // For demo purposes, allow login if using default mocked credentials logic or allow bypass
      // But adhering to the code structure:
      
      // Sucesso mockado imediato para demo se não achar no localstorage (para o user padrao funcionar)
      if (!userRecord && identifier !== 'demo') {
          // If simply testing, allow pass through but normally show error
           // setError("Usuário não encontrado. (Use 'demo' para testar se não criou conta)");
           // setIsLoading(false);
           // return;
      }

      // Sucesso
      setTimeout(() => {
          onLogin();
      }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    // Simula delay de rede
    setTimeout(() => {
        if (isLoginMode) {
            handleLoginAuth();
        } else {
            handleRegister();
        }
    }, 800);
  };

  const toggleMode = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsLoginMode(!isLoginMode);
      setError(null);
      setSuccessMsg(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors p-4 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* Lado Esquerdo - Visual (Apenas Desktop) */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-purple-600/40 z-0"></div>
          {/* Círculos de fundo animados */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <Logo size={50} className="text-white" />
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              {isLoginMode ? 'Conecte-se ao' : 'Junte-se ao'} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Infinito.
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xs">
              {isLoginMode 
                ? "Junte-se a milhões de pessoas e descubra o que está acontecendo no mundo agora."
                : "Crie sua conta hoje e comece a compartilhar seus loops com o mundo."}
            </p>
          </div>

          <div className="relative z-10 text-xs text-gray-500">
            © 2025 Loop Social Inc.
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-full relative">
            <div className="md:hidden mb-8 flex justify-center">
                <Logo size={48} />
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {isLoginMode ? 'Insira seus dados para entrar.' : 'Preencha os dados abaixo para começar.'}
                </p>
            </div>

            {/* Mensagens de Erro / Sucesso */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-300 animate-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-sm text-green-600 dark:text-green-300 animate-in slide-in-from-top-2">
                     <AlertCircle size={18} />
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo de Nome e Handle (Apenas Cadastro) */}
                {!isLoginMode && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Nome</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nome"
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Usuário</label>
                            <div className="relative group">
                                <AtSign className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    value={handle}
                                    onChange={(e) => setHandle(e.target.value)}
                                    placeholder="usuario"
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Email ou Telefone */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email ou Telefone</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-cyan-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between ml-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                        {isLoginMode && <a href="#" className="text-sm font-semibold text-cyan-600 hover:text-cyan-500">Esqueceu?</a>}
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            maxLength={20}
                            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>{isLoginMode ? 'Entrar' : 'Criar Conta'} <ArrowRight size={20} /></>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                    {isLoginMode ? 'Não tem uma conta?' : 'Já tem uma conta?'} 
                    <button 
                        onClick={toggleMode}
                        className="font-bold text-gray-900 dark:text-white hover:underline ml-1 focus:outline-none"
                    >
                        {isLoginMode ? 'Cadastre-se' : 'Faça Login'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
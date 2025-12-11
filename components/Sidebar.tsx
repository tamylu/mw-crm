
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, CalendarDays, Package, Settings, LogOut, UsersRound, Users, Globe, X, ShoppingBag } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout?: () => void;
  onConfig?: () => void;
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout, onConfig, userName, isOpen, onClose }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Panel Principal', icon: <LayoutDashboard size={20} /> },
    { id: ViewState.SALES, label: 'Ventas Realizadas', icon: <ShoppingBag size={20} /> },
    { id: ViewState.APPOINTMENTS, label: 'Citas', icon: <CalendarDays size={20} /> },
    { id: ViewState.PRODUCTS, label: 'Productos', icon: <Package size={20} /> },
    { id: ViewState.CLIENTS, label: 'Clientes', icon: <Users size={20} /> },
    { id: ViewState.SELLERS, label: 'Vendedores', icon: <UsersRound size={20} /> },
    { id: ViewState.PUBLIC_STORE, label: 'Ver Sitio Web', icon: <Globe size={20} /> },
  ];

  const handleNavClick = (view: ViewState) => {
      onChangeView(view);
      onClose(); // Close sidebar on mobile when item clicked
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-950 text-white h-screen flex flex-col shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-900 flex justify-between items-center relative">
          <div className="bg-white p-2 rounded-lg w-full max-w-[160px] shadow-lg shadow-lime-900/10">
            <Logo className="w-full h-auto" />
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-lime-600 text-white shadow-lg shadow-lime-900/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-lime-400'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-900 bg-slate-950">
          {userName && (
              <div className="mb-4 px-2">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Usuario</p>
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
              </div>
          )}
          <button 
            onClick={() => {
                if (onConfig) onConfig();
                onClose();
            }}
            className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors w-full"
          >
            <Settings size={18} />
            <span className="text-sm">Configuración</span>
          </button>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors w-full mt-1"
            >
              <LogOut size={18} />
              <span className="text-sm">Salir</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

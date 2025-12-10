
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, CalendarDays, Package, Settings, LogOut, UsersRound, Users, Globe } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Panel Principal', icon: <LayoutDashboard size={20} /> },
    { id: ViewState.APPOINTMENTS, label: 'Citas', icon: <CalendarDays size={20} /> },
    { id: ViewState.PRODUCTS, label: 'Productos', icon: <Package size={20} /> },
    { id: ViewState.CLIENTS, label: 'Clientes', icon: <Users size={20} /> },
    { id: ViewState.SELLERS, label: 'Vendedores', icon: <UsersRound size={20} /> },
    { id: ViewState.PUBLIC_STORE, label: 'Ver Sitio Web', icon: <Globe size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-950 text-white h-screen flex flex-col sticky top-0 shadow-xl">
      <div className="p-6 border-b border-slate-900 flex justify-center items-center">
        <div className="bg-white p-3 rounded-lg w-full max-w-[180px] shadow-lg shadow-lime-900/10">
          <Logo className="w-full h-auto" />
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
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

      <div className="p-4 border-t border-slate-900">
        <button className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors w-full">
          <Settings size={18} />
          <span className="text-sm">Configuración</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition-colors w-full mt-1">
          <LogOut size={18} />
          <span className="text-sm">Salir</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
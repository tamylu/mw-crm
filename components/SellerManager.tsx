
import React, { useState } from 'react';
import { Seller } from '../types';
import { Plus, Trash2, User, Mail, Phone, X, Lock } from 'lucide-react';

interface SellerManagerProps {
  sellers: Seller[];
  onAddSeller: (seller: Omit<Seller, 'id'>) => void;
  onDelete: (id: string) => void;
}

const SellerManager: React.FC<SellerManagerProps> = ({ sellers, onAddSeller, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSeller, setNewSeller] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSeller(newSeller);
    setIsModalOpen(false);
    setNewSeller({ name: '', email: '', phone: '', password: '', active: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Vendedores</h2>
          <p className="text-slate-500">Administra el equipo de ventas y sus accesos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} />
          Nuevo Vendedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div key={seller.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-lime-50 rounded-full text-lime-600">
                <User size={24} />
              </div>
              <button 
                onClick={() => onDelete(seller.id)} 
                className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{seller.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span className={`w-2 h-2 rounded-full ${seller.active ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              {seller.active ? 'Activo' : 'Inactivo'}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{seller.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{seller.phone}</span>
              </div>
            </div>
          </div>
        ))}
        {sellers.length === 0 && (
             <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                No hay vendedores registrados.
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Agregar Vendedor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newSeller.name}
                  onChange={(e) => setNewSeller({...newSeller, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico (Usuario)</label>
                <input
                  required
                  type="email"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newSeller.email}
                  onChange={(e) => setNewSeller({...newSeller, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña de Acceso</label>
                <div className="relative">
                    <input
                        required
                        type="password"
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                        value={newSeller.password}
                        onChange={(e) => setNewSeller({...newSeller, password: e.target.value})}
                        placeholder="••••••••"
                    />
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  required
                  type="tel"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newSeller.phone}
                  onChange={(e) => setNewSeller({...newSeller, phone: e.target.value})}
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-medium shadow-md"
                >
                    Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManager;

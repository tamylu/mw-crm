
import React, { useState, useEffect } from 'react';
import { Seller } from '../types';
import { X, Save, Lock, User, Mail, Phone } from 'lucide-react';

interface ConfigModalProps {
  user: Seller;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Seller>) => Promise<void>;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create update object
    const updates: Partial<Seller> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
    };

    // Only update password if user typed something
    if (formData.password.trim()) {
        updates.password = formData.password;
    }

    try {
        await onSave(user.id, updates);
        onClose();
    } catch (error) {
        console.error("Error updating profile", error);
        alert("Ocurrió un error al actualizar el perfil.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Mi Configuración</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <div className="relative">
                <input
                    required
                    type="text"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
                <input
                    required
                    type="email"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="text-xs text-orange-500 mt-1">Nota: Este es tu usuario de ingreso.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <div className="relative">
                <input
                    required
                    type="tel"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
            <div className="relative">
                <input
                    type="password"
                    placeholder="Dejar vacío para mantener la actual"
                    className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900 placeholder:text-slate-400"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-medium shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
                {isLoading ? 'Guardando...' : (
                    <>
                        <Save size={18} />
                        Guardar Cambios
                    </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;


import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Trash2, User, Mail, Phone, MapPin, X } from 'lucide-react';

interface ClientManagerProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onDelete: (id: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, onAddClient, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient(newClient);
    setIsModalOpen(false);
    setNewClient({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h2>
          <p className="text-slate-500">Directorio de clientes y contactos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-lime-50 rounded-full text-lime-600">
                <User size={24} />
              </div>
              <button 
                onClick={() => onDelete(client.id)} 
                className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                title="Eliminar Cliente"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-3">{client.name}</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{client.email || 'Sin correo'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{client.phone || 'Sin teléfono'}</span>
              </div>
              {client.address && (
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="line-clamp-2">{client.address}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {clients.length === 0 && (
             <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                No hay clientes registrados.
            </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Agregar Cliente</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                <textarea>
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none resize-none h-20 bg-white text-slate-900"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                </textarea>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button>
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                
                    Cancelar
                </button>
                <button>
                    type="submit"
                    className="flex-1 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-medium shadow-md"
                
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

export default ClientManager;

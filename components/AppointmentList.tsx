
import React, { useState } from 'react';
import { Appointment, Seller, Client } from '../types';
import { Plus, Clock, Calendar, User, Trash2, CheckCircle, Briefcase, Ban, X } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
  sellers: Seller[];
  clients: Client[];
  onAddAppointment: (appt: Omit<Appointment, 'id'>) => void;
  onStatusChange: (id: string, status: Appointment['status']) => void;
  onDelete: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, sellers, clients, onAddAppointment, onStatusChange, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    service: 'Consulta',
    notes: '',
    sellerId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({
      ...newAppt,
      status: 'pending'
    });
    setIsModalOpen(false);
    setNewAppt({
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        service: 'Consulta',
        notes: '',
        sellerId: ''
    });
  };

  const translateStatus = (status: string) => {
      switch(status) {
          case 'completed': return 'Completada';
          case 'cancelled': return 'Cancelada';
          case 'pending': return 'Pendiente';
          default: return status;
      }
  };

  const getSellerName = (id?: string) => {
      if (!id) return null;
      const seller = sellers.find(s => s.id === id);
      return seller ? seller.name : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Citas</h2>
          <p className="text-slate-500 text-sm">Administra tu agenda y reuniones</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} />
          Nueva Cita
        </button>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
            <div className="p-8 md:p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No hay citas programadas todavía.</p>
            </div>
        ) : (
            appointments.map((appt) => (
            <div key={appt.id} className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-lime-300 transition-colors">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`p-3 rounded-full shrink-0 ${
                      appt.status === 'completed' ? 'bg-green-100 text-green-600' :
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                      'bg-lime-50 text-lime-600'
                  }`}>
                      {appt.status === 'cancelled' ? <Ban size={24} /> : <User size={24} />}
                  </div>
                  <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-slate-800 truncate">{appt.clientName}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {appt.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {appt.time}</span>
                        <span className={`px-2 py-0.5 rounded text-xs uppercase tracking-wide font-medium border ${
                            appt.status === 'completed' ? 'bg-green-50 border-green-100 text-green-600' :
                            appt.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                            'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                            {translateStatus(appt.status)}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-xs uppercase tracking-wide font-medium truncate">{appt.service}</span>
                      </div>
                      {getSellerName(appt.sellerId) && (
                          <div className="flex items-center gap-1 text-xs text-lime-700 mt-1 font-medium">
                              <Briefcase size={12} />
                              <span className="truncate">Vendedor: {getSellerName(appt.sellerId)}</span>
                          </div>
                      )}
                      {appt.notes && <p className="text-xs text-slate-400 mt-2 italic line-clamp-2">"{appt.notes}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end md:justify-start border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
                  {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                      <>
                          <button
                              onClick={() => onStatusChange(appt.id, 'completed')}
                              className="flex-1 md:flex-none flex items-center justify-center text-green-600 bg-green-50 md:bg-transparent hover:bg-green-50 p-2 rounded-lg transition-colors border border-green-100 md:border-transparent"
                              title="Marcar como Completada"
                          >
                              <CheckCircle size={20} className="md:hidden mr-1" />
                              <span className="md:hidden text-sm font-medium">Completar</span>
                              <CheckCircle size={20} className="hidden md:block" />
                          </button>
                          <button
                              onClick={() => onStatusChange(appt.id, 'cancelled')}
                              className="flex-1 md:flex-none flex items-center justify-center text-red-500 bg-red-50 md:bg-transparent hover:bg-red-50 p-2 rounded-lg transition-colors border border-red-100 md:border-transparent"
                              title="Cancelar Cita"
                          >
                              <Ban size={20} className="md:hidden mr-1" />
                              <span className="md:hidden text-sm font-medium">Cancelar</span>
                              <Ban size={20} className="hidden md:block" />
                          </button>
                      </>
                  )}
                  <button
                      onClick={() => onDelete(appt.id)}
                      className="flex-none text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-2 rounded-lg transition-colors"
                      title="Eliminar del sistema"
                  >
                      <Trash2 size={20} />
                  </button>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Nueva Cita</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Cliente</label>
                <input
                  required
                  list="clients-list"
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={newAppt.clientName}
                  onChange={(e) => setNewAppt({...newAppt, clientName: e.target.value})}
                  placeholder="Escribe o selecciona..."
                />
                <datalist id="clients-list">
                    {clients.map(client => (
                        <option key={client.id} value={client.name} />
                    ))}
                </datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                    <input
                    required
                    type="date"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={newAppt.date}
                    onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                    <input
                    required
                    type="time"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={newAppt.time}
                    onChange={(e) => setNewAppt({...newAppt, time: e.target.value})}
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendedor Asignado</label>
                <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={newAppt.sellerId}
                    onChange={(e) => setNewAppt({...newAppt, sellerId: e.target.value})}
                >
                    <option value="" className="text-slate-500">-- Seleccionar Vendedor --</option>
                    {sellers.filter(s => s.active).map(seller => (
                        <option key={seller.id} value={seller.id} className="text-slate-900">
                            {seller.name}
                        </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Servicio</label>
                <select
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                    value={newAppt.service}
                    onChange={(e) => setNewAppt({...newAppt, service: e.target.value})}
                >
                    <option className="text-slate-900">Consulta</option>
                    <option className="text-slate-900">Venta</option>
                    <option className="text-slate-900">Pagos</option>
                    <option className="text-slate-900">Seguimiento</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none h-24 resize-none bg-white text-slate-900"
                  value={newAppt.notes}
                  onChange={(e) => setNewAppt({...newAppt, notes: e.target.value})}
                ></textarea>
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
                    className="flex-1 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-medium shadow-md shadow-lime-200"
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

export default AppointmentList;

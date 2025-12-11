
import React, { useState, useEffect } from 'react';
import { Sale, Product, Client, Seller } from '../types';
import { Plus, Search, Trash2, X, DollarSign, FileText, User, ShoppingBag } from 'lucide-react';

interface SalesManagerProps {
  sales: Sale[];
  products: Product[];
  clients: Client[];
  sellers: Seller[];
  currentUser: Seller;
  onAddSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const SalesManager: React.FC<SalesManagerProps> = ({ sales, products, clients, sellers, currentUser, onAddSale, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSale, setNewSale] = useState<Partial<Sale>>({
    productId: '',
    clientId: '',
    sellerId: currentUser.id,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Efectivo',
    salePrice: 0,
    extraCosts: 0,
    total: 0,
    notes: ''
  });

  // Auto-calculate total when price or extra costs change
  useEffect(() => {
    const price = newSale.salePrice || 0;
    const extra = newSale.extraCosts || 0;
    setNewSale(prev => ({ ...prev, total: price + extra }));
  }, [newSale.salePrice, newSale.extraCosts]);

  // Auto-fill price when product is selected
  const handleProductChange = (productId: string) => {
      const product = products.find(p => p.id === productId);
      setNewSale(prev => ({
          ...prev,
          productId,
          salePrice: product ? product.price : 0
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.productId || !newSale.clientId || !newSale.sellerId) {
        alert("Por favor complete los campos obligatorios.");
        return;
    }

    try {
        await onAddSale(newSale as Omit<Sale, 'id'>);
        setIsModalOpen(false);
        // Reset form
        setNewSale({
            productId: '',
            clientId: '',
            sellerId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            paymentMethod: 'Efectivo',
            salePrice: 0,
            extraCosts: 0,
            total: 0,
            notes: ''
        });
    } catch (error) {
        alert("Error al registrar la venta.");
    }
  };

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Producto Eliminado';
  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Cliente Eliminado';
  const getSellerName = (id: string) => sellers.find(s => s.id === id)?.name || 'Vendedor Eliminado';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ventas Realizadas</h2>
          <p className="text-slate-500">Registro histórico de transacciones</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} />
          Registrar Venta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold border-b border-slate-100">Fecha</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Producto</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Cliente</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Vendedor</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Total</th>
                        <th className="p-4 font-semibold border-b border-slate-100">Pago</th>
                        <th className="p-4 font-semibold border-b border-slate-100 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map((sale) => (
                            <tr key={sale.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-600">{sale.date}</td>
                                <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                                    <ShoppingBag size={16} className="text-lime-600" />
                                    {getProductName(sale.productId)}
                                </td>
                                <td className="p-4 text-slate-600">{getClientName(sale.clientId)}</td>
                                <td className="p-4 text-slate-600 text-sm">{getSellerName(sale.sellerId)}</td>
                                <td className="p-4 font-bold text-slate-800">${sale.total.toLocaleString()}</td>
                                <td className="p-4 text-slate-600 text-sm">
                                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                        {sale.paymentMethod}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => onDelete(sale.id)}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="p-12 text-center text-slate-500">
                                No hay ventas registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* New Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Registrar Nueva Venta</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
                        <select
                            required
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                            value={newSale.productId}
                            onChange={(e) => handleProductChange(e.target.value)}
                        >
                            <option value="">-- Seleccionar Producto --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                        <input
                            required
                            list="clients-datalist"
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                            onChange={(e) => {
                                const client = clients.find(c => c.name === e.target.value);
                                if (client) setNewSale({...newSale, clientId: client.id});
                            }}
                        />
                         <datalist id="clients-datalist">
                            {clients.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vendedor</label>
                        <select
                            required
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                            value={newSale.sellerId}
                            onChange={(e) => setNewSale({...newSale, sellerId: e.target.value})}
                        >
                            {sellers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                      </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Forma de Pago</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                            value={newSale.paymentMethod}
                            onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value as any})}
                        >
                            <option>Efectivo</option>
                            <option>Tarjeta Crédito</option>
                            <option>Tarjeta Débito</option>
                            <option>Transferencia</option>
                            <option>Otro</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Precio Venta</label>
                            <input
                                type="number"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                                value={newSale.salePrice}
                                onChange={(e) => setNewSale({...newSale, salePrice: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gastos Extra</label>
                            <input
                                type="number"
                                placeholder="Impuestos..."
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                                value={newSale.extraCosts}
                                onChange={(e) => setNewSale({...newSale, extraCosts: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-200">
                          <span className="font-medium text-slate-600">Total a Pagar:</span>
                          <span className="text-xl font-bold text-lime-600">${newSale.total?.toLocaleString()}</span>
                      </div>
                  </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Notas (Opcional)</label>
                 <textarea
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none h-20 resize-none bg-white text-slate-900"
                    placeholder="Detalles de facturación, entrega, etc."
                    value={newSale.notes}
                    onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                 ></textarea>
              </div>
              
              <div className="pt-4 flex gap-3 border-t border-slate-100">
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
                    Registrar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManager;

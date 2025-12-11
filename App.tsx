
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AppointmentList from './components/AppointmentList';
import ProductManager from './components/ProductManager';
import SellerManager from './components/SellerManager';
import ClientManager from './components/ClientManager';
import PublicStore from './components/PublicStore';
import Login from './components/Login';
import Logo from './components/Logo';
import { ViewState, Appointment, Product, Seller, Client } from './types';
import { 
  fetchAppointments, createAppointment, updateAppointmentStatus, deleteAppointment,
  fetchProducts, createProduct, deleteProduct,
  fetchSellers, createSeller, deleteSeller,
  fetchClients, createClient, deleteClient,
  loginSeller
} from './services/storageService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, DollarSign, CalendarCheck, CheckCircle, X, Menu } from 'lucide-react';
import { analyzeSchedule } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // UX State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<Seller | null>(null);

  // Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'all' | 'pending' | 'completed'>('all');

  // Load Data Effect (Only if logged in)
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [apptsData, prodsData, sellersData, clientsData] = await Promise.all([
          fetchAppointments(),
          fetchProducts(),
          fetchSellers(),
          fetchClients()
        ]);

        setAppointments(apptsData);
        setProducts(prodsData);
        setSellers(sellersData);
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading initial data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  // AI Insights
  useEffect(() => {
    if (appointments.length > 0) {
        analyzeSchedule(appointments).then(setAiInsight);
    }
  }, [appointments]);

  // --- Handlers (Auth) ---

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
      const user = await loginSeller(email, pass);
      if (user) {
          setCurrentUser(user);
          setCurrentView(ViewState.DASHBOARD);
          return true;
      }
      return false;
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentView(ViewState.DASHBOARD); 
      setIsSidebarOpen(false);
  };

  // --- Handlers (Async Wrappers) ---

  const handleAddAppointment = async (appt: Omit<Appointment, 'id'>) => {
    const newAppt = await createAppointment(appt);
    if (newAppt) {
      setAppointments(prev => [...prev, newAppt]);
    } else {
      alert("Error al guardar la cita en la base de datos.");
    }
  };

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    await updateAppointmentStatus(id, status);
  };

  const handleDeleteAppointment = async (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    await deleteAppointment(id);
  };

  const handleAddProduct = async (prod: Omit<Product, 'id'>) => {
    const newProd = await createProduct(prod);
    if (newProd) {
      setProducts(prev => [...prev, newProd]);
    } else {
      alert("Error al guardar el producto. Verifique conexión.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
      setProducts(prev => prev.filter(p => p.id !== id));
      await deleteProduct(id);
  }

  const handleAddSeller = async (seller: Omit<Seller, 'id'>) => {
    const newSeller = await createSeller(seller);
    if (newSeller) {
      setSellers(prev => [...prev, newSeller]);
    }
  };

  const handleDeleteSeller = async (id: string) => {
    setSellers(prev => prev.filter(s => s.id !== id));
    await deleteSeller(id);
  }

  const handleAddClient = async (client: Omit<Client, 'id'>) => {
      const newClient = await createClient(client);
      if (newClient) {
          setClients(prev => [...prev, newClient]);
      }
  };

  const handleDeleteClient = async (id: string) => {
      setClients(prev => prev.filter(c => c.id !== id));
      await deleteClient(id);
  };

  // --- View Logic ---

  if (currentView === ViewState.PUBLIC_STORE) {
      return (
        <PublicStoreWrapper 
            onBack={() => {
                if (currentUser) setCurrentView(ViewState.DASHBOARD);
                else setCurrentView(ViewState.DASHBOARD); 
            }}
            onAddClient={handleAddClient}
        />
      );
  }

  if (!currentUser) {
      return (
        <Login 
            onLogin={handleLogin} 
            onGoToStore={() => setCurrentView(ViewState.PUBLIC_STORE)}
        />
      );
  }

  // --- Authenticated Dashboard Logic ---

  const getDashboardStats = () => {
    const totalAppts = appointments.length;
    const pendingAppts = appointments.filter(a => a.status === 'pending').length;
    const completedAppts = appointments.filter(a => a.status === 'completed').length;
    const totalProducts = products.length;
    const estimatedRevenue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    return { totalAppts, pendingAppts, completedAppts, totalProducts, estimatedRevenue };
  };

  const stats = getDashboardStats();

  const chartData = appointments.reduce((acc: any[], curr) => {
    const date = curr.date;
    const existing = acc.find(item => item.date === date);
    if (existing) {
        existing.count += 1;
    } else {
        acc.push({ date, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const openReport = (type: 'all' | 'pending' | 'completed') => {
      setReportType(type);
      setReportModalOpen(true);
  };

  const getFilteredReportData = () => {
      if (reportType === 'pending') return appointments.filter(a => a.status === 'pending');
      if (reportType === 'completed') return appointments.filter(a => a.status === 'completed');
      return appointments;
  };

  const getSellerName = (id?: string) => {
      if (!id) return '-';
      const seller = sellers.find(s => s.id === id);
      return seller ? seller.name : '-';
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600"></div>
                  <p className="text-slate-500 font-medium">Cargando sistema...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onLogout={handleLogout}
        userName={currentUser.name}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 overflow-y-auto h-screen w-full relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
            <div className="w-32">
                 <Logo className="w-full h-auto text-slate-900" />
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
                <Menu size={24} />
            </button>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          {currentView === ViewState.DASHBOARD && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Panel Principal</h2>
                    <p className="text-slate-500 mt-1 text-sm md:text-base">Hola, {currentUser.name}. Esto es lo que sucede hoy.</p>
                </div>
                {aiInsight && (
                    <div className="bg-lime-50 border border-lime-200 p-3 rounded-lg w-full md:max-w-md text-sm text-lime-900 flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <SparklesIcon />
                        <p>{aiInsight}</p>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard 
                    title="Total de Citas" 
                    value={stats.totalAppts} 
                    icon={<Users className="text-blue-500" />} 
                    color="bg-blue-50" 
                    onClick={() => openReport('all')}
                    clickable
                />
                <StatCard 
                    title="Citas Pendientes" 
                    value={stats.pendingAppts} 
                    icon={<CalendarCheck className="text-orange-500" />} 
                    color="bg-orange-50" 
                    onClick={() => openReport('pending')}
                    clickable
                />
                <StatCard 
                    title="Citas Realizadas" 
                    value={stats.completedAppts} 
                    icon={<CheckCircle className="text-emerald-500" />} 
                    color="bg-emerald-50" 
                    onClick={() => openReport('completed')}
                    clickable
                />
                <StatCard 
                  title="Valor Inventario" 
                  value={`$${stats.estimatedRevenue.toLocaleString()}`} 
                  icon={<DollarSign className="text-lime-600" />} 
                  color="bg-lime-50" 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Actividad de Citas</h3>
                    <div className="h-64 w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} />
                                    <YAxis allowDecimals={false} tick={{fontSize: 12}} width={30} />
                                    <Tooltip 
                                        cursor={{fill: '#f1f5f9'}} 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                        labelFormatter={(label) => `Fecha: ${label}`}
                                        formatter={(value) => [value, 'Citas']}
                                    />
                                    <Bar dataKey="count" fill="#84cc16" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                No hay datos disponibles
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Productos Recientes</h3>
                    <div className="space-y-4">
                        {products.slice(-3).map(p => (
                            <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="w-12 h-12 bg-slate-200 rounded-md overflow-hidden shrink-0">
                                    {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{p.name}</p>
                                    <p className="text-xs text-slate-500">${p.price}</p>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && <p className="text-slate-400 text-sm">No hay productos.</p>}
                    </div>
                </div>
              </div>
            </div>
          )}

          {currentView === ViewState.APPOINTMENTS && (
            <AppointmentList
              appointments={appointments}
              sellers={sellers}
              clients={clients}
              onAddAppointment={handleAddAppointment}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteAppointment}
            />
          )}

          {currentView === ViewState.PRODUCTS && (
            <ProductManager
              products={products}
              onAddProduct={handleAddProduct}
              onDelete={handleDeleteProduct}
            />
          )}

          {currentView === ViewState.SELLERS && (
              <SellerManager 
                sellers={sellers}
                onAddSeller={handleAddSeller}
                onDelete={handleDeleteSeller}
              />
          )}

          {currentView === ViewState.CLIENTS && (
              <ClientManager 
                clients={clients}
                onAddClient={handleAddClient}
                onDelete={handleDeleteClient}
              />
          )}
        </div>
      </main>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg md:text-xl font-bold text-slate-800">
                Reporte: {reportType === 'all' ? 'Todas' : reportType === 'pending' ? 'Pendientes' : 'Realizadas'}
              </h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <div className="overflow-auto p-0 flex-1">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold border-b border-slate-100">Cliente</th>
                            <th className="p-4 font-semibold border-b border-slate-100">Fecha</th>
                            <th className="p-4 font-semibold border-b border-slate-100">Servicio</th>
                            <th className="p-4 font-semibold border-b border-slate-100">Vendedor</th>
                            <th className="p-4 font-semibold border-b border-slate-100">Estado</th>
                            <th className="p-4 font-semibold border-b border-slate-100">Notas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredReportData().length > 0 ? (
                            getFilteredReportData().map(appt => (
                                <tr key={appt.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800">{appt.clientName}</td>
                                    <td className="p-4 text-slate-600">{appt.date} {appt.time}</td>
                                    <td className="p-4 text-slate-600">{appt.service}</td>
                                    <td className="p-4 text-slate-600 font-medium">{getSellerName(appt.sellerId)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            appt.status === 'completed' ? 'bg-green-100 text-green-600' :
                                            appt.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                            appt.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {appt.status === 'completed' ? 'Realizada' : appt.status === 'pending' ? 'Pendiente' : appt.status === 'cancelled' ? 'Cancelada' : appt.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm italic max-w-xs truncate">{appt.notes || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">No hay datos para este reporte.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                <button 
                    onClick={() => setReportModalOpen(false)}
                    className="w-full md:w-auto px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
                >
                    Cerrar Reporte
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component
const PublicStoreWrapper = ({ onBack, onAddClient }: { onBack: () => void, onAddClient: any }) => {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        fetchProducts().then(setProducts);
    }, []);

    return <PublicStore products={products} onBack={onBack} onAddClient={onAddClient} />;
}

const StatCard = ({ title, value, icon, color, onClick, clickable }: any) => {
  return (
    <div 
        onClick={clickable ? onClick : undefined}
        className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-all ${clickable ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
    >
        <div className={`p-4 rounded-full ${color} shrink-0`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-slate-500 text-sm font-medium truncate">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            {clickable && <p className="text-xs text-lime-600 mt-1 font-medium">Ver detalle &rarr;</p>}
        </div>
    </div>
  );
};

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

export default App;

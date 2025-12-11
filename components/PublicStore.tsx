
import React, { useState, useEffect } from 'react';
import { Product, Client } from '../types';
import { ShoppingBag, ArrowLeft, MessageCircle, Search, Star, X, Send, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Logo from './Logo';

interface PublicStoreProps {
  products: Product[];
  onBack: () => void;
  onAddClient: (client: Omit<Client, 'id'>) => void;
}

const PublicStore: React.FC<PublicStoreProps> = ({ products, onBack, onAddClient }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Carousel State
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const carouselProducts = products.filter(p => p.images && p.images.length > 0);

  const handleConsultClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setClientForm({ name: '', email: '', phone: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    onAddClient({
        ...clientForm,
        address: `Interesado en: ${selectedProduct.name}`
    });

    alert("¡Gracias! Hemos recibido tus datos. Un asesor se pondrá en contacto contigo pronto.");
    handleCloseModal();
  };

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === carouselProducts.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? carouselProducts.length - 1 : prev - 1));
  };

  const openCarousel = () => {
    if (carouselProducts.length > 0) {
        setCurrentSlide(0);
        setIsCarouselOpen(true);
    } else {
        alert("No hay imágenes disponibles en el catálogo actualmente.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isCarouselOpen) return;
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'Escape') setIsCarouselOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCarouselOpen, carouselProducts.length]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-32 md:w-40">
                <Logo className="w-full h-auto" />
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-slate-600 hover:text-lime-600 hover:bg-lime-50 rounded-full transition-colors"
            >
              <ArrowLeft size={16} className="md:w-[18px]" />
              <span className="hidden md:inline">Ingreso Administrativo</span>
              <span className="md:hidden">Administración</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600">
              <Search size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
     
      <div className="bg-slate-950 text-white py-12 md:py-20 px-4 relative overflow-hidden">
<div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
           Somos tu aliado estratégico, <br />
            <span className="text-lime-400"> potenciamos tu negocio.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            
Tu enlace confiable para ventas de autos, transacciones inmobiliarias y proyectos de construcción sin complicaciones.
          </p>
          <button 
            onClick={openCarousel}
            className="px-6 py-2.5 md:px-8 md:py-3 bg-lime-600 text-white rounded-full font-semibold hover:bg-lime-500 transition-colors shadow-lg shadow-lime-900/50 text-sm md:text-base"
          >
            Ver Catálogo
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Productos Destacados</h2>
            <div className="text-sm text-slate-500">{products.length} Productos Disponibles</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ShoppingBag size={48} />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-slate-800">
                  {product.category}
                </div>
              </div>
              
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-lime-600 transition-colors">
                    {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star fill="currentColor" size={12} />
                        <span className="text-slate-400 font-medium">5.0</span>
                    </div>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <span className="text-2xl font-bold text-slate-900">
                    ${product.price}
                  </span>
                  <button 
                    onClick={() => handleConsultClick(product)}
                    className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-slate-950 text-white rounded-lg text-sm font-medium hover:bg-lime-600 hover:text-white transition-colors"
                  >
                    <MessageCircle size={16} />
                    Consultar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No hay productos disponibles</h3>
                <p className="text-slate-500">Vuelve pronto para ver nuestras novedades.</p>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} MW Servicio Comercial. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Contact Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                  <h3 className="text-xl font-bold text-slate-800">Solicitar Información</h3>
                  <p className="text-sm text-lime-600 font-medium mt-1">{selectedProduct.name}</p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <p className="text-sm text-slate-500">Déjanos tus datos y nos pondremos en contacto contigo para coordinar la compra.</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre</label>
                <input
                  required
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  required
                  type="tel"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                  placeholder="+54 9 11 ..."
                />
              </div>
              
              <div className="pt-4">
                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-lime-600 text-white rounded-lg hover:bg-lime-700 font-medium shadow-md flex items-center justify-center gap-2"
                >
                    <Send size={18} />
                    Enviar Consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Carousel Modal */}
      {isCarouselOpen && carouselProducts.length > 0 && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
            {/* Close Button */}
            <button 
                onClick={() => setIsCarouselOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
                <X size={32} />
            </button>

            {/* Left Arrow */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
                <ChevronLeft size={40} />
            </button>

            {/* Image Container */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-10">
                <div className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center">
                     <img 
                        src={carouselProducts[currentSlide].images[0]} 
                        alt={carouselProducts[currentSlide].name} 
                        className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
                     />
                     {/* Caption */}
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 rounded-b-md text-white">
                        <h3 className="text-2xl font-bold">{carouselProducts[currentSlide].name}</h3>
                        <p className="text-lg font-medium text-lime-400">${carouselProducts[currentSlide].price}</p>
                     </div>
                </div>
                
                {/* Indicators */}
                <div className="absolute bottom-8 flex gap-2">
                    {carouselProducts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentSlide ? 'bg-lime-500 w-6' : 'bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Arrow */}
            <button 
                onClick={nextSlide}
                className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            >
                <ChevronRight size={40} />
            </button>
        </div>
      )}
    </div>
  );
};

export default PublicStore;

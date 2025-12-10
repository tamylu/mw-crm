
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Plus, Sparkles, Image as ImageIcon, Trash2, X, Loader2 } from 'lucide-react';
import { fileToBase64 } from '../services/storageService';
import { generateProductDescription } from '../services/geminiService';

interface ProductManagerProps {
  products: Product[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onDelete: (id: string) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, onAddProduct, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState<{
    name: string;
    price: number;
    category: string;
    description: string;
    images: string[];
  }>({
    name: '',
    price: 0,
    category: 'General',
    description: '',
    images: []
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setIsUploading(true);
        try {
            const filePromises = Array.from(e.target.files).map(file => fileToBase64(file));
            const base64Images = await Promise.all(filePromises);
            setNewProduct(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
        } catch (error) {
            console.error("Error uploading files", error);
            alert("Hubo un error al procesar las imágenes.");
        } finally {
            setIsUploading(false);
            // Reset input so the same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }
  };

  const handleGenerateDescription = async () => {
    if (!newProduct.name) return;
    setIsGenerating(true);
    try {
        const desc = await generateProductDescription(newProduct.name, newProduct.category, newProduct.description);
        setNewProduct(prev => ({ ...prev, description: desc }));
    } catch (error) {
        alert("Error al generar descripción con IA. Verifique la API Key.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        // Basic validation logic could go here if needed, but HTML5 'required' handles most
        onAddProduct({ ...newProduct, stock: 10 });
        
        // Reset and close only if successful
        setNewProduct({ name: '', price: 0, category: 'General', description: '', images: [] });
        setIsModalOpen(false);
    } catch (error) {
        console.error("Error saving product:", error);
        alert("No se pudo guardar el producto. Es posible que las imágenes ocupen demasiado espacio. Intenta con menos imágenes o borra productos antiguos.");
    }
  };

  const removeImage = (index: number) => {
      setNewProduct(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Galería de Productos</h2>
          <p className="text-slate-500">Gestiona el inventario y las imágenes de productos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus size={18} />
          Agregar Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              {prod.images.length > 0 ? (
                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onDelete(prod.id)} className="bg-white/90 p-2 rounded-full text-red-500 hover:text-red-600 shadow-sm">
                    <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-800 line-clamp-1" title={prod.name}>{prod.name}</h3>
                    <span className="font-bold text-lime-600">${prod.price}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">{prod.category}</p>
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">{prod.description}</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {prod.images.slice(1).map((img, i) => (
                        <img key={i} src={img} className="w-10 h-10 rounded object-cover border border-slate-100 shrink-0" alt="" />
                    ))}
                </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
                No hay productos en la galería.
            </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Agregar Nuevo Producto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
                        <input required autoFocus type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                            value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
                            <input required type="number" min="0" step="0.01" className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                                value={newProduct.price || ''} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none bg-white text-slate-900"
                                value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            >
                                <option>General</option>
                                <option>Electrónica</option>
                                <option>Servicios</option>
                                <option>Belleza</option>
                                <option>Hogar</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">Descripción</label>
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGenerating || !newProduct.name}
                                className="text-xs flex items-center gap-1 text-lime-600 hover:text-lime-800 disabled:opacity-50"
                            >
                                <Sparkles size={12} />
                                {isGenerating ? 'Pensando...' : 'Generar con IA'}
                            </button>
                        </div>
                        <textarea
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500 outline-none h-32 resize-none text-sm bg-white text-slate-900"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            placeholder="Ingrese detalles o use IA para generar..."
                        ></textarea>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="block text-sm font-medium text-slate-700">Imágenes del Producto</label>
                     <div className="grid grid-cols-2 gap-2">
                        {newProduct.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <label className={`aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-lime-500 hover:bg-lime-50 transition-colors flex flex-col items-center justify-center cursor-pointer ${isUploading ? 'opacity-50 cursor-wait' : ''}`}>
                            {isUploading ? (
                                <Loader2 className="text-lime-500 animate-spin mb-2" />
                            ) : (
                                <ImageIcon className="text-slate-400 mb-2" />
                            )}
                            <span className="text-xs text-slate-500 text-center">
                                {isUploading ? 'Subiendo...' : <>Seleccionar<br/>Imágenes</>}
                            </span>
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/png, image/jpeg, image/webp" 
                                multiple 
                                className="hidden" 
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                        </label>
                     </div>
                     <p className="text-xs text-slate-400">Soporta múltiples imágenes (JPG, PNG, WEBP).</p>
                  </div>
              </div>
              
              <div className="pt-4 flex gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">Cancelar</button>
                <button 
                    type="submit" 
                    disabled={isUploading || isGenerating}
                    className="flex-1 px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Procesando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;

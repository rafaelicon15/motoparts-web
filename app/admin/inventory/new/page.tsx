// app/admin/inventory/new/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UploadCloud, Wand2, Save, ArrowLeft, X, ImagePlus, Package, DollarSign, FileText, Plus, Check } from 'lucide-react';
import Link from 'next/link';
import { removeBackground } from '@imgly/background-removal';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);

  // Motor de IA
  const [aiEngine, setAiEngine] = useState<'api' | 'local'>('api'); 

  // Imágenes (No se pueden guardar en LocalStorage por seguridad del navegador)
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<{url: string, file: File}[]>([]);

  // Listas de la Base de Datos
  const [brands, setBrands] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  // Estado completo B2B
  const [formData, setFormData] = useState({
    name: '', description: '', brand_id: '',
    category_id: '', subcategory_id: '', 
    price_usd: '', wholesale_price_usd: '', 
    boxes: '1', units_per_box: '1', sale_mode: 'both' 
  });

  // Filtros dinámicos
  const mainCategories = allCategories.filter(c => !c.parent_id);
  const subCategories = allCategories.filter(c => c.parent_id === formData.category_id);

  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [isAddingSubcat, setIsAddingSubcat] = useState(false);
  const [newSubcatName, setNewSubcatName] = useState('');

  // 1. Cargar Base de Datos y LOCAL STORAGE al iniciar
  useEffect(() => {
    const fetchSelectData = async () => {
      const { data: bData } = await supabase.from('brands').select('*').order('name');
      const { data: cData } = await supabase.from('categories').select('*').order('name');
      if (bData) setBrands(bData);
      if (cData) setAllCategories(cData);

      // Recuperar el borrador guardado
      const savedDraft = localStorage.getItem('motoparts_product_draft');
      
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      } else {
        // Si no hay borrador, poner por defecto la primera marca y categoría
        const mains = cData?.filter(c => !c.parent_id) || [];
        setFormData(p => ({ 
          ...p, 
          brand_id: bData?.[0]?.id || '',
          category_id: mains[0]?.id || ''
        }));
      }
    };
    fetchSelectData();
  }, []);

  // 2. Guardar en LOCAL STORAGE cada vez que formData cambie
  useEffect(() => {
    // Evitamos guardar si el formulario está totalmente vacío al cargar
    if (formData.name || formData.price_usd || formData.category_id) {
      localStorage.setItem('motoparts_product_draft', JSON.stringify(formData));
    }
  }, [formData]);

  const totalStock = (parseInt(formData.boxes || '0') * parseInt(formData.units_per_box || '0'));

  // --- LÓGICA DE CREACIÓN RÁPIDA ---
  const handleCreateBrand = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return setIsAddingBrand(false);
    const { data } = await supabase.from('brands').insert([{ name: newBrandName.trim() }]).select();
    if (data) {
      setBrands(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ ...prev, brand_id: data[0].id }));
      setNewBrandName(''); setIsAddingBrand(false);
    }
  };

  const handleCreateSubcategory = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newSubcatName.trim() || !formData.category_id) return setIsAddingSubcat(false);
    const { data } = await supabase.from('categories').insert([{ name: newSubcatName.trim(), parent_id: formData.category_id }]).select();
    if (data) {
      setAllCategories(prev => [...prev, data[0]]);
      setFormData(prev => ({ ...prev, subcategory_id: data[0].id }));
      setNewSubcatName(''); setIsAddingSubcat(false);
    }
  };

  // --- IMÁGENES E IA ---
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const originalUrl = URL.createObjectURL(file);
    setMainImage(originalUrl);
    setRemovingBg(true);

    try {
      if (aiEngine === 'local') {
        const blob = await removeBackground(originalUrl);
        setMainImage(URL.createObjectURL(blob));
      } else {
        const apiFormData = new FormData();
        apiFormData.append('image', file);
        const res = await fetch('/api/admin/remove-bg', { method: 'POST', body: apiFormData });
        const data = await res.json();
        if (data.success) setMainImage(data.base64);
        else throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error quitando fondo:", error);
      alert("Fallo el recorte. Se dejó la imagen original.");
      setMainImage(originalUrl); 
    } finally {
      setRemovingBg(false);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newGallery = files.map(file => ({ url: URL.createObjectURL(file), file }));
    setGalleryFiles(prev => [...prev, ...newGallery]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- GUARDADO FINAL ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mainUrl = '';
      const galleryUrls: string[] = [];

      // 1. Subir Imagen Principal a Storage
      if (mainImage) {
        const response = await fetch(mainImage);
        const blob = await response.blob();
        const fileName = `main-${Date.now()}.png`;
        const { error: err } = await supabase.storage.from('products').upload(fileName, blob, { contentType: 'image/png' });
        if (err) throw err;
        mainUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Subir Galería a Storage
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i].file;
        const fileName = `gal-${Date.now()}-${i}.${file.name.split('.').pop()}`;
        const { error: err } = await supabase.storage.from('products').upload(fileName, file);
        if (err) throw err;
        galleryUrls.push(supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl);
      }

      const selectedCat = allCategories.find(c => c.id === formData.category_id)?.name || 'General';
      const priceUSD = formData.sale_mode === 'wholesale_only' ? 0 : parseFloat(formData.price_usd);
      const wholesaleUSD = formData.sale_mode === 'retail_only' ? 0 : parseFloat(formData.wholesale_price_usd);

      // 3. Insertar en Base de Datos
      const { error: dbError } = await supabase.from('products').insert([{
        name: formData.name, description: formData.description, brand_id: formData.brand_id,
        category_id: formData.category_id, subcategory_id: formData.subcategory_id || null, category: selectedCat,
        price_usd: priceUSD, wholesale_price_usd: wholesaleUSD, units_per_box: parseInt(formData.units_per_box),
        stock: totalStock, sale_mode: formData.sale_mode, image_url: mainUrl, gallery_urls: galleryUrls
      }]);

      if (dbError) throw dbError;

      // 4. ÉXITO: Limpiamos el LocalStorage para que el próximo producto empiece en blanco
      localStorage.removeItem('motoparts_product_draft');

      alert("¡Producto corporativo guardado con éxito!");
      router.push('/admin/inventory');
      router.refresh();

    } catch (error: any) {
      console.error(error);
      alert("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Link href="/admin/inventory" className="flex items-center gap-2 text-gray-500 hover:text-[#e3000f] mb-6 transition-colors w-fit">
        <ArrowLeft size={20} /> Volver al Inventario
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Crear Nuevo Producto</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading || removingBg} className="bg-[#e3000f] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 disabled:bg-gray-400 transition-all flex items-center gap-2 shadow-lg">
          {loading ? 'Guardando...' : <><Save size={20} /> Guardar Producto Oficial</>}
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="text-[#e3000f]" size={20} /> Información General
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Repuesto</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea rows={3} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Marca</label>
                    <button type="button" onClick={() => setIsAddingBrand(!isAddingBrand)} className="text-[10px] text-[#e3000f] font-bold flex items-center hover:underline">
                      {isAddingBrand ? 'Cancelar' : '+ Nueva'}
                    </button>
                  </div>
                  {isAddingBrand ? (
                    <div className="flex gap-1">
                      <input autoFocus type="text" className="w-full border border-[#e3000f] rounded-lg p-2 text-sm focus:outline-none" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} />
                      <button onClick={handleCreateBrand} className="bg-[#e3000f] text-white px-2 rounded-lg"><Check size={16}/></button>
                    </div>
                  ) : (
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#e3000f] focus:outline-none bg-white text-sm"
                      value={formData.brand_id} onChange={e => setFormData({...formData, brand_id: e.target.value})}>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#e3000f] focus:outline-none bg-white text-sm"
                    value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value, subcategory_id: ''})}>
                    {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">Subcategoría</label>
                    {formData.category_id && (
                      <button type="button" onClick={() => setIsAddingSubcat(!isAddingSubcat)} className="text-[10px] text-[#e3000f] font-bold flex items-center hover:underline">
                        {isAddingSubcat ? 'Cancelar' : '+ Nueva'}
                      </button>
                    )}
                  </div>
                  {isAddingSubcat ? (
                    <div className="flex gap-1">
                      <input autoFocus type="text" className="w-full border border-[#e3000f] rounded-lg p-2 text-sm focus:outline-none" value={newSubcatName} onChange={e => setNewSubcatName(e.target.value)} />
                      <button onClick={handleCreateSubcategory} className="bg-[#e3000f] text-white px-2 rounded-lg"><Check size={16}/></button>
                    </div>
                  ) : (
                    <select className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#e3000f] focus:outline-none bg-white text-sm"
                      value={formData.subcategory_id} onChange={e => setFormData({...formData, subcategory_id: e.target.value})}>
                      <option value="">Seleccione...</option>
                      {subCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ImagePlus className="text-[#e3000f]" size={20} /> Portada Mágica
              </h2>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button type="button" onClick={() => setAiEngine('local')} className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${aiEngine === 'local' ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  ⚡ IA Gratis (Rápida)
                </button>
                <button type="button" onClick={() => setAiEngine('api')} className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${aiEngine === 'api' ? 'bg-[#e3000f] shadow text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                  💎 Remove.bg (Perfecta)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="border-2 border-dashed border-[#e3000f]/50 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden bg-red-50 hover:bg-red-100 transition-colors h-48 group">
                  {!mainImage && <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />}
                  {mainImage ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={mainImage} alt="Main" className="max-h-full object-contain drop-shadow-md" />
                      <button onClick={(e) => { e.preventDefault(); setMainImage(null); }} className="absolute top-1 right-1 bg-white text-red-500 hover:bg-red-500 hover:text-white border p-1.5 rounded-full z-20"><X size={16} strokeWidth={3} /></button>
                      {removingBg && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-center px-2">
                          <Wand2 className="animate-spin text-[#e3000f] mb-1" size={24} />
                          <span className="text-[10px] font-bold text-[#e3000f]">Procesando IA...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-red-400 pointer-events-none text-center px-4">
                      <Wand2 size={32} className="mb-2" />
                      <span className="text-[11px] font-bold uppercase">Subir Foto</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Galería Adicional (Sin borrar fondo)</label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {galleryFiles.map((img, idx) => (
                    <div key={idx} className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded-lg relative overflow-hidden bg-gray-50">
                      <img src={img.url} alt={`Gal-${idx}`} className="w-full h-full object-cover" />
                      <button onClick={(e) => { e.preventDefault(); removeGalleryImage(idx); }} className="absolute top-1 right-1 bg-white/80 text-red-500 p-1 rounded-full"><X size={12} strokeWidth={3} /></button>
                    </div>
                  ))}
                  <div className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg relative flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-400">
                    <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadCloud size={24} className="mb-1" />
                    <span className="text-[10px] font-medium">Añadir más</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <DollarSign className="text-[#e3000f]" size={20} /> Precios y Ventas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modo de Venta Permitido</label>
                <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none bg-gray-50"
                  value={formData.sale_mode} onChange={e => setFormData({...formData, sale_mode: e.target.value})}>
                  <option value="both">Ambos (Detal y Mayor)</option>
                  <option value="retail_only">Solo Detal</option>
                  <option value="wholesale_only">Solo Mayor</option>
                </select>
              </div>

              {formData.sale_mode !== 'wholesale_only' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Detal (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                    <input required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                      value={formData.price_usd} onChange={e => setFormData({...formData, price_usd: e.target.value})} />
                  </div>
                </div>
              )}

              {formData.sale_mode !== 'retail_only' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Mayorista (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-green-500 font-bold">$</span>
                    <input required type="number" step="0.01" className="w-full border border-green-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                      value={formData.wholesale_price_usd} onChange={e => setFormData({...formData, wholesale_price_usd: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package className="text-[#e3000f]" size={20} /> Inventario Físico
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Cajas</label>
                  <input required type="number" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                    value={formData.boxes} onChange={e => setFormData({...formData, boxes: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unids x Caja</label>
                  <input required type="number" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                    value={formData.units_per_box} onChange={e => setFormData({...formData, units_per_box: e.target.value})} />
                </div>
              </div>
              <div className="bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between shadow-inner">
                <span className="text-sm font-medium text-gray-300">Stock Total Calculado</span>
                <span className="text-2xl font-extrabold text-[#e3000f]">{totalStock} unds</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
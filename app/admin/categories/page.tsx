// app/admin/categories/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FolderTree, Tag, Edit2, Trash2, Plus, X, Save } from 'lucide-react';

export default function CategoriesManagerPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para Formularios
  const [catForm, setCatForm] = useState({ id: '', name: '', parent_id: '' });
  const [brandForm, setBrandForm] = useState({ id: '', name: '' });

  const fetchData = async () => {
    setLoading(true);
    const { data: cData } = await supabase.from('categories').select('*').order('name');
    const { data: bData } = await supabase.from('brands').select('*').order('name');
    if (cData) setCategories(cData);
    if (bData) setBrands(bData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- LÓGICA DE CATEGORÍAS ---
  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!catForm.id;
    const payload = { 
      name: catForm.name, 
      parent_id: catForm.parent_id || null 
    };

    let error;
    if (isUpdate) {
      const { error: err } = await supabase.from('categories').update(payload).eq('id', catForm.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('categories').insert([payload]);
      error = err;
    }

    if (error) alert("Error: " + error.message);
    else {
      setCatForm({ id: '', name: '', parent_id: '' });
      fetchData();
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría? (Asegúrate de que no tenga productos asociados o dará error)")) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) alert("No se puede eliminar: " + error.message);
    else fetchData();
  };

  // --- LÓGICA DE MARCAS ---
  const saveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!brandForm.id;
    
    let error;
    if (isUpdate) {
      const { error: err } = await supabase.from('brands').update({ name: brandForm.name }).eq('id', brandForm.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('brands').insert([{ name: brandForm.name }]);
      error = err;
    }

    if (error) alert("Error: " + error.message);
    else {
      setBrandForm({ id: '', name: '' });
      fetchData();
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta marca?")) return;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) alert("No se puede eliminar: " + error.message);
    else fetchData();
  };

  // Separar categorías principales de subcategorías para la vista de árbol
  const mainCategories = categories.filter(c => !c.parent_id);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parent_id === parentId);

  return (
    <div className="max-w-6xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Taxonomía y Marcas</h1>
        <p className="text-gray-500 mt-1">Administra la estructura de tu catálogo (Categorías, Subcategorías y Marcas).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL IZQUIERDO: CATEGORÍAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <FolderTree className="text-[#e3000f]" size={24} /> Árbol de Categorías
          </h2>

          {/* Formulario de Categorías */}
          <form onSubmit={saveCategory} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              {catForm.id ? 'Editando Categoría' : 'Nueva Categoría / Subcategoría'}
            </h3>
            <div className="space-y-3">
              <input required type="text" placeholder="Nombre de la categoría..." className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
              
              <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none bg-white"
                value={catForm.parent_id} onChange={e => setCatForm({...catForm, parent_id: e.target.value})}>
                <option value="">-- Es Categoría Principal --</option>
                {mainCategories.filter(c => c.id !== catForm.id).map(c => (
                  <option key={c.id} value={c.id}>Depende de: {c.name}</option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-[#e3000f] text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 flex justify-center items-center gap-2">
                  <Save size={16} /> {catForm.id ? 'Actualizar' : 'Guardar'}
                </button>
                {catForm.id && (
                  <button type="button" onClick={() => setCatForm({id: '', name: '', parent_id: ''})} className="px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 flex items-center justify-center">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Lista tipo Árbol (MercadoLibre Style) */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {loading ? <p className="text-sm text-gray-400">Cargando...</p> : mainCategories.map(main => (
              <div key={main.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                  <span className="font-bold text-gray-800">{main.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCatForm({ id: main.id, name: main.name, parent_id: '' })} className="text-gray-400 hover:text-blue-600 transition p-1"><Edit2 size={16}/></button>
                    <button onClick={() => deleteCategory(main.id)} className="text-gray-400 hover:text-red-600 transition p-1"><Trash2 size={16}/></button>
                  </div>
                </div>
                
                {/* Renderizar Subcategorías */}
                {getSubcategories(main.id).length > 0 && (
                  <div className="p-3 bg-white">
                    <ul className="space-y-2 ml-4 border-l-2 border-gray-100 pl-4">
                      {getSubcategories(main.id).map(sub => (
                        <li key={sub.id} className="flex justify-between items-center text-sm text-gray-600 group">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-[2px] bg-gray-300"></span> {sub.name}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                            <button onClick={() => setCatForm({ id: sub.id, name: sub.name, parent_id: main.id })} className="text-gray-400 hover:text-blue-600 transition"><Edit2 size={14}/></button>
                            <button onClick={() => deleteCategory(sub.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 size={14}/></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: MARCAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Tag className="text-[#e3000f]" size={24} /> Directorio de Marcas
          </h2>

          <form onSubmit={saveBrand} className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              {brandForm.id ? 'Editando Marca' : 'Nueva Marca'}
            </h3>
            <div className="flex gap-2">
              <input required type="text" placeholder="Ej. Motul, Bera, Yamaha..." className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} />
              
              <button type="submit" className="bg-[#e3000f] text-white px-4 rounded-lg text-sm font-bold hover:bg-red-700 flex justify-center items-center">
                <Save size={18} />
              </button>
              {brandForm.id && (
                <button type="button" onClick={() => setBrandForm({id: '', name: ''})} className="px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center">
                  <X size={18} />
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {loading ? <p className="text-sm text-gray-400">Cargando...</p> : brands.map(brand => (
              <div key={brand.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center bg-white hover:border-[#e3000f]/30 transition-colors group">
                <span className="font-semibold text-gray-700 text-sm truncate">{brand.name}</span>
                <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity shrink-0 bg-white pl-2">
                  <button onClick={() => setBrandForm({ id: brand.id, name: brand.name })} className="text-gray-400 hover:text-blue-600 transition"><Edit2 size={14}/></button>
                  <button onClick={() => deleteBrand(brand.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
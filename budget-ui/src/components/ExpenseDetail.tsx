import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Calendar as CalendarIcon, FileText, Trash2, UserCircle, Pencil, FolderPlus } from "lucide-react";
import { useBudget } from "../context/BudgetContext";

const SUELDOS_CATEGORY_ID = 7;

// Gradient color mapping by category color class
const gradientMap: Record<string, { color: string; shadow: string }> = {
    'bg-blue-500/20 text-blue-400': { color: 'from-blue-500 to-blue-400 text-white', shadow: 'shadow-blue-500/20' },
    'bg-yellow-500/20 text-yellow-400': { color: 'from-yellow-500 to-yellow-400 text-white', shadow: 'shadow-yellow-500/20' },
    'bg-purple-500/20 text-purple-400': { color: 'from-purple-500 to-purple-400 text-white', shadow: 'shadow-purple-500/20' },
    'bg-emerald-500/20 text-emerald-400': { color: 'from-emerald-500 to-emerald-400 text-white', shadow: 'shadow-emerald-500/20' },
    'bg-cyan-500/20 text-cyan-400': { color: 'from-cyan-500 to-cyan-400 text-white', shadow: 'shadow-cyan-500/20' },
    'bg-brand-rose-pink/20 text-brand-rose-pink': { color: 'from-brand-rose-pink to-brand-light-pink text-white', shadow: 'shadow-brand-rose-pink/20' },
    'bg-orange-500/20 text-orange-400': { color: 'from-orange-500 to-orange-400 text-white', shadow: 'shadow-orange-500/20' },
    'bg-slate-500/20 text-slate-400': { color: 'from-slate-500 to-slate-400 text-white', shadow: 'shadow-slate-500/20' },
};

const defaultGradient = { color: 'from-violet-500 to-violet-400 text-white', shadow: 'shadow-violet-500/20' };

export const ExpenseDetail = () => {
    const { id } = useParams();
    const { expenses, addExpense, deleteExpense, vendedoras, addVendedora, updateExpenseAmount, categories } = useBudget();

    const categoryId = parseInt(id || "1");
    const catFromContext = categories.find(c => c.id === categoryId);
    const gradient = catFromContext ? (gradientMap[catFromContext.color] || defaultGradient) : defaultGradient;
    const categoryInfo = catFromContext
        ? { name: catFromContext.name, icon: catFromContext.icon, color: gradient.color, shadow: gradient.shadow }
        : { name: "Categoría", icon: FolderPlus, color: defaultGradient.color, shadow: defaultGradient.shadow };
    const isSueldos = categoryId === SUELDOS_CATEGORY_ID;

    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");
    const [personName, setPersonName] = useState("");
    const [showAddVendedora, setShowAddVendedora] = useState(false);
    const [newVendedoraName, setNewVendedoraName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    const categoryHistory = [...expenses]
        .filter(exp => exp.categoryId === categoryId)
        .sort((a, b) => b.id - a.id);

    const uniquePersons = isSueldos
        ? [...new Set(categoryHistory.map(exp => exp.personName || "Sin nombre"))]
        : [];

    const Icon = categoryInfo.icon;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSueldos) {
            addExpense(categoryId, Number(amount), date, notes, personName);
        } else {
            addExpense(categoryId, Number(amount), date, notes);
        }
        setAmount("");
        setPersonName("");
        setNotes("");
    };

    const handleAddVendedora = () => {
        if (newVendedoraName.trim()) {
            addVendedora(newVendedoraName.trim());
            setPersonName(newVendedoraName.trim());
            setNewVendedoraName("");
            setShowAddVendedora(false);
        }
    };

    const startEditing = (expId: number, currentAmount: number) => {
        setEditingId(expId);
        setEditValue(String(currentAmount));
    };

    const saveEdit = () => {
        if (editingId !== null && editValue.trim() !== "") {
            updateExpenseAmount(editingId, Number(editValue));
        }
        setEditingId(null);
        setEditValue("");
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <header className="flex justify-between items-center py-4 px-8 border-b border-white/10 mb-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-wide">
                            {categoryInfo.name}
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            {isSueldos ? "Registrar sueldo por vendedora" : "Registrar gasto específico de esta categoría"}
                        </p>
                    </div>
                </div>
            </header>

            <main className="px-8 pb-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column */}
                <div className="space-y-4">
                    <div className={`p-4 lg:p-6 rounded-3xl flex flex-col items-center justify-center bg-gradient-to-br ${categoryInfo.color} shadow-lg ${categoryInfo.shadow}`}>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-2 border border-white/20">
                            <Icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{categoryInfo.name}</h3>
                        <p className="text-white/80 text-xs font-medium">
                            {isSueldos ? "Pago de Sueldos" : "Nueva Transacción"}
                        </p>
                    </div>

                    <div className="glass-panel p-6">
                        <form onSubmit={handleSave} className="space-y-4">
                            {isSueldos && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                                        <UserCircle size={16} className="text-orange-400" />
                                        Vendedora
                                    </label>
                                    {showAddVendedora ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newVendedoraName}
                                                onChange={(e) => setNewVendedoraName(e.target.value)}
                                                placeholder="Nombre de la vendedora"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-orange-400 transition-colors"
                                                autoFocus
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVendedora(); } }}
                                            />
                                            <button type="button" onClick={handleAddVendedora} className="px-4 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
                                                Agregar
                                            </button>
                                            <button type="button" onClick={() => { setShowAddVendedora(false); setNewVendedoraName(""); }} className="px-3 py-3 rounded-xl bg-white/10 text-white/60 text-sm hover:bg-white/20 transition-colors">
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <select
                                                value={personName}
                                                onChange={(e) => setPersonName(e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-orange-400 transition-colors appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="" className="text-black">Seleccione una vendedora</option>
                                                {vendedoras.map(v => (
                                                    <option key={v.name} value={v.name} className="text-black">{v.name}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddVendedora(true)}
                                                className="w-12 h-12 shrink-0 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 flex items-center justify-center transition-colors border border-orange-500/30"
                                                title="Agregar nueva vendedora"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                <label className="flex items-center gap-2 text-xs font-medium text-brand-light-pink mb-2">
                                    <CalendarIcon size={16} /> Seleccionar Día en el Calendario
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white text-base focus:outline-none focus:border-brand-light-pink transition-colors [color-scheme:dark] cursor-pointer"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    {isSueldos ? "Sueldo" : "Monto Gastado"}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-xl font-bold focus:outline-none focus:border-brand-light-pink transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Descripción (Opcional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={1}
                                    placeholder={isSueldos ? "Ej: Pago quincenal, bono..." : "Ej: Compra mensual, verdulería..."}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-colors resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] bg-gradient-to-r ${categoryInfo.color} shadow-lg ${categoryInfo.shadow}`}
                            >
                                <Plus size={20} />
                                {isSueldos ? "Registrar Sueldo" : `Guardar ${categoryInfo.name}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column (History) */}
                {categoryHistory.length > 0 && (
                    <div className="glass-panel p-6 sticky top-4 max-h-[calc(100vh-8rem)] flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 shrink-0">
                            <FileText size={20} className="text-orange-400" />
                            {isSueldos ? "Registro de Sueldos" : `Historial de ${categoryInfo.name}`}
                        </h3>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {isSueldos ? (
                                uniquePersons.map(person => {
                                    const personExpenses = categoryHistory.filter(exp => (exp.personName || "Sin nombre") === person);
                                    const totalPerson = personExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                                    const vendedora = vendedoras.find(v => v.name === person);
                                    const colorClass = vendedora?.color || "bg-white/10 text-white/60";
                                    const textColor = colorClass.split(' ')[1] || 'text-orange-400';
                                    return (
                                        <div key={person} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                            <div className={`flex items-center justify-between p-3 ${colorClass.split(' ')[0]} border-b border-white/10`}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-7 h-7 rounded-full ${colorClass} flex items-center justify-center`}>
                                                        <span className="text-xs font-bold">{person.charAt(0)}</span>
                                                    </div>
                                                    <span className="text-white font-semibold text-sm">{person}</span>
                                                </div>
                                                <span className={`${textColor} font-bold text-sm`}>Total: ${totalPerson.toLocaleString('es-AR')}</span>
                                            </div>
                                            <div className="divide-y divide-white/5">
                                                {personExpenses.map(exp => (
                                                    <div key={exp.id} className="flex justify-between items-center p-3 hover:bg-white/5 transition-colors">
                                                        <div>
                                                            {editingId === exp.id ? (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-white/50 text-sm">$</span>
                                                                    <input
                                                                        type="number"
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                        onBlur={saveEdit}
                                                                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setEditingId(null); setEditValue(''); } }}
                                                                        className="bg-white/10 border border-orange-400 rounded-lg px-2 py-1 text-white font-bold text-sm w-28 focus:outline-none"
                                                                        autoFocus
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <p className="text-white font-bold text-sm">${exp.amount.toLocaleString('es-AR')}</p>
                                                            )}
                                                            <p className="text-white/50 text-xs">{exp.date}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => startEditing(exp.id, exp.amount)}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                                                                title="Editar monto"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteExpense(exp.id)}
                                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                                title="Eliminar registro"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                categoryHistory.map(exp => (
                                    <div key={exp.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                        <div>
                                            {editingId === exp.id ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-white/50 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={saveEdit}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setEditingId(null); setEditValue(''); } }}
                                                        className="bg-white/10 border border-brand-light-pink rounded-lg px-2 py-1 text-white font-bold text-sm w-28 focus:outline-none"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-white font-bold text-sm">${exp.amount.toLocaleString('es-AR')}</p>
                                            )}
                                            <p className="text-white/50 text-xs">{exp.date}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => startEditing(exp.id, exp.amount)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-brand-light-pink hover:bg-brand-light-pink/10 transition-colors"
                                                title="Editar monto"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => deleteExpense(exp.id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Eliminar registro"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

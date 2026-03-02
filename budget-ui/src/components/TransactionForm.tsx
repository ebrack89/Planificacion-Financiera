import { useState, useEffect } from "react";
import { ArrowLeft, Plus, FileText, Trash2, Calendar as CalendarIcon, FolderPlus, Layers } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useBudget } from "../context/BudgetContext";
import { SalaryCalculator } from "./SalaryCalculator";

export const TransactionForm = () => {
    const [searchParams] = useSearchParams();
    const initialType = searchParams.get("type") === "gasto" ? "gasto" : "ingreso";
    const [type, setType] = useState<"gasto" | "ingreso">(initialType);
    const isGastoMode = searchParams.get("type") === "gasto";

    useEffect(() => {
        const urlType = searchParams.get("type");
        if (urlType === "gasto" || urlType === "ingreso") {
            setType(urlType);
        }
    }, [searchParams]);

    const { addIncome, addExpense, incomes, deleteIncome, categories, addCategory } = useBudget();
    const navigate = useNavigate();

    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");
    const [calculationDetails, setCalculationDetails] = useState("");
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const userId = searchParams.get("user") || "";

    const userIncomeHistory = [...incomes]
        .filter(inc => inc.userId === userId)
        .sort((a, b) => b.id - a.id);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (type === "ingreso") {
            if (userId) {
                const sourceName = category === "ventas" ? "Ventas / Honorarios" : "Sueldo";
                addIncome(userId, Number(amount), sourceName, date);
            }
        } else {
            const catId = Number(category);
            const finalNotes = calculationDetails ? `${notes} (${calculationDetails})` : notes;
            addExpense(catId, Number(amount), date, finalNotes);
        }

        navigate("/");
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName.trim());
            setNewCategoryName("");
            setShowAddCategory(false);
        }
    };

    const userName = userId.charAt(0).toUpperCase() + userId.slice(1);

    // GASTO MODE — Dedicated Category Manager Page
    if (isGastoMode) {
        return (
            <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                <header className="flex justify-between items-center py-4 px-8 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold text-white tracking-wide">Agregar Categoría</h2>
                                <span className="px-3 py-1 rounded-full bg-brand-rose-pink/15 border border-brand-rose-pink/20 text-brand-rose-pink text-xs font-bold">{categories.length} activas</span>
                            </div>
                            <p className="text-white/60 text-sm mt-1">Gestiona las categorías de tus gastos operativos</p>
                        </div>
                    </div>
                </header>

                <main className="px-8 pb-4 max-w-5xl mx-auto flex flex-col gap-4">
                    {/* Add New Category */}
                    <div className="glass-panel p-4">
                        {showAddCategory ? (
                            <div className="flex gap-3 items-center">
                                <FolderPlus size={20} className="text-brand-rose-pink shrink-0" />
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Ej: Alquiler, Transporte, Marketing..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-rose-pink transition-colors"
                                    autoFocus
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } if (e.key === 'Escape') { setShowAddCategory(false); setNewCategoryName(""); } }}
                                />
                                <button onClick={handleAddCategory} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose-pink to-brand-light-pink text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-rose-pink/20 transition-all">
                                    Crear
                                </button>
                                <button onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }} className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm hover:bg-white/10 transition-colors">
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddCategory(true)}
                                className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-rose-pink/40 text-white/40 hover:text-brand-rose-pink flex items-center justify-center gap-3 transition-all hover:bg-brand-rose-pink/5 group"
                            >
                                <FolderPlus size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-sm">Agregar nueva categoría</span>
                            </button>
                        )}
                    </div>

                    {/* Categories Grid */}
                    <div className="glass-panel p-4">
                        <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Layers size={16} className="text-brand-light-pink" />
                            Categorías Activas
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {categories.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <Link
                                        to={`/edit-transaction/${cat.id}`}
                                        key={cat.id}
                                        className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer group"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color} transition-transform group-hover:scale-110 shrink-0`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-white font-medium text-xs truncate">{cat.name}</h5>
                                            <p className="text-white/30 text-[10px]">{cat.category}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // INGRESO MODE — Standard Transaction Form
    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <header className="flex justify-between items-center py-4 px-8 border-b border-white/10 mb-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-wide">
                            {type === "ingreso" ? "Registrar Ingreso" : "Registrar Gasto"}
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            {type === "ingreso" ? "Añade un nuevo movimiento a tu presupuesto" : "Registra un gasto operativo del negocio"}
                        </p>
                    </div>
                </div>
                {type === "gasto" && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-rose-pink/10 border border-brand-rose-pink/20 text-brand-rose-pink text-[10px] font-bold uppercase tracking-wider">
                        Modo Gasto Operativo
                    </div>
                )}
            </header>

            <main className="px-8 pb-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                    <form onSubmit={handleSave} className="space-y-5">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Monto</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xl">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-xl font-bold focus:outline-none focus:border-brand-light-pink transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Source / Category */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">
                                {type === "ingreso" ? "Origen" : "Categoría"}
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-light-pink transition-colors appearance-none"
                                required
                            >
                                <option value="" disabled className="text-black">
                                    {type === "ingreso" ? "Seleccione el origen" : "Seleccione la categoría"}
                                </option>
                                {type === "ingreso" ? (
                                    <>
                                        <option value="ventas" className="text-black">Ventas / Honorarios</option>
                                        <option value="sueldo" className="text-black">Sueldo</option>
                                    </>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="text-black">
                                            {cat.name} ({cat.category})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Salary Calculator Integration */}
                        {type === "gasto" && category === "7" && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <SalaryCalculator
                                    onCalculate={(total, details) => {
                                        setAmount(total.toString());
                                        setCalculationDetails(details);
                                    }}
                                    initialHourlyRate={3000}
                                    initialDailyViatico={2700}
                                />
                            </div>
                        )}

                        {/* Date */}
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

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Descripción (Opcional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={1}
                                placeholder="Detalles de la transacción..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-colors resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg ${type === "ingreso"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-emerald-500/20"
                                : "bg-gradient-to-r from-brand-rose-pink to-brand-light-pink text-white shadow-brand-rose-pink/20"
                                }`}
                        >
                            <Plus size={20} />
                            {type === "ingreso" ? "Registrar Ingreso" : "Registrar Gasto"}
                        </button>
                    </form>
                </div>

                {/* Right Column: Income History */}
                {userIncomeHistory.length > 0 && (
                    <div className="glass-panel p-6 sticky top-4 max-h-[calc(100vh-8rem)] flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 shrink-0">
                            <FileText size={20} className="text-emerald-400" />
                            Historial de Ingresos — {userName}
                        </h3>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {userIncomeHistory.map(inc => (
                                <div key={inc.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                    <div>
                                        <p className="text-white font-bold text-sm">${inc.amount.toLocaleString('es-AR')}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-emerald-400 text-xs font-semibold">{inc.source}</span>
                                            <span className="text-white/30 text-xs">•</span>
                                            <span className="text-white/50 text-xs">{inc.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => deleteIncome(inc.id)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Eliminar registro"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

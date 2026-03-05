import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Calendar as CalendarIcon, FileText, Trash2, Wallet, CreditCard, TrendingUp, Home, Pencil, Save, X } from "lucide-react";
import { useBudget } from "../context/BudgetContext";

const CATEGORIES = [
    { id: "tarjetas", name: "Tarjetas", icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/20", gradient: "from-blue-500 to-blue-400", shadow: "shadow-blue-500/20" },
    { id: "gastos-corriente", name: "Gastos del corriente mes", icon: Wallet, color: "text-brand-light-pink", bg: "bg-brand-rose-pink/10", gradient: "from-brand-rose-pink to-brand-dark-plum", shadow: "shadow-brand-rose-pink/10" },
    { id: "gastos", name: "Gastos del siguiente mes", icon: Wallet, color: "text-brand-rose-pink", bg: "bg-brand-rose-pink/20", gradient: "from-brand-rose-pink to-brand-light-pink", shadow: "shadow-brand-rose-pink/20" },
    { id: "inversion", name: "Inversion", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/20", gradient: "from-emerald-500 to-emerald-400", shadow: "shadow-emerald-500/20" },
    { id: "casa", name: "Casa", icon: Home, color: "text-amber-400", bg: "bg-amber-500/20", gradient: "from-amber-500 to-amber-400", shadow: "shadow-amber-500/20" },
];

export const PersonalExpenseDetail = () => {
    const { userId, categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'gasto';
    const isIncome = type === 'ingreso';

    const { personalExpenses, addPersonalExpense, updatePersonalExpense, deletePersonalExpense, users } = useBudget();

    const user = users.find(u => u.id === userId);
    const userName = user?.name || (userId ? userId.charAt(0).toUpperCase() + userId.slice(1) : "Usuario");

    const categoryInfo = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[1];
    const Icon = categoryInfo.icon;

    const [amount, setAmount] = useState("");
    const [detail, setDetail] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Format date for history display
    const formatDateList = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('/')) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const categoryHistory = [...personalExpenses]
        .filter(exp => exp.userId === userId && (exp.description === categoryInfo.name || exp.description.startsWith(`${categoryInfo.name} - `)))
        .sort((a, b) => b.id - a.id);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            let finalAmount = Math.abs(Number(amount));
            if (!isIncome) {
                finalAmount = -finalAmount;
            }
            const fullDescription = detail.trim() ? `${categoryInfo.name} - ${detail.trim()}` : categoryInfo.name;

            if (editingId) {
                updatePersonalExpense(editingId, fullDescription, finalAmount, date);
                setEditingId(null);
            } else {
                addPersonalExpense(userId, fullDescription, finalAmount, date);
            }

            setAmount("");
            setDetail("");
            // Keep date as is for rapid entry
        }
    };

    const handleEditClick = (exp: typeof personalExpenses[0]) => {
        setEditingId(exp.id);
        setAmount(Math.abs(exp.amount).toString());
        setDetail(exp.description.includes(' - ') ? exp.description.split(' - ')[1] : "");

        // Convert DD/MM/YYYY to YYYY-MM-DD for input
        let isoDate = exp.date;
        if (exp.date.includes('/')) {
            const [day, month, year] = exp.date.split('/');
            isoDate = `${year}-${month}-${day}`;
        }
        setDate(isoDate);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setAmount("");
        setDetail("");
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <header className="flex justify-between items-center py-4 px-8 border-b border-white/10 mb-4">
                <div className="flex items-center gap-4">
                    <Link to={`/user-incomes/${userId}`} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-wide">
                            {categoryInfo.name}
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            Registrar {isIncome ? 'ingreso' : 'gasto'} de {userName}
                        </p>
                    </div>
                </div>
            </header>

            <main className="px-8 pb-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column */}
                <div className="space-y-4">
                    <div className={`p-4 lg:p-6 rounded-3xl flex flex-col items-center justify-center bg-gradient-to-br ${categoryInfo.gradient} text-white shadow-lg ${categoryInfo.shadow}`}>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-2 border border-white/20">
                            <Icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{categoryInfo.name}</h3>
                        <p className="text-white/80 text-xs font-medium">{editingId ? 'Editando Transacción' : 'Nueva Transacción'}</p>
                    </div>

                    <div className="glass-panel p-6">
                        <form onSubmit={handleSave} className="space-y-4">
                            {editingId && (
                                <div className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-xl border border-white/20 mb-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                                        <Pencil size={14} className={isIncome ? 'text-emerald-400' : 'text-brand-rose-pink'} />
                                        Modificando un registro
                                    </div>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="text-white/50 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                <label className="flex items-center gap-2 text-xs font-medium text-brand-light-pink mb-2">
                                    <FileText size={16} /> Detalle del {isIncome ? 'Ingreso' : 'Gasto'} (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    placeholder="Ej: Supermercado, Perfume, etc."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white text-base focus:outline-none focus:border-brand-light-pink transition-colors [color-scheme:dark]"
                                />
                            </div>

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
                                    {isIncome ? 'Monto a Ingresar' : 'Monto del Gasto'}
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

                            <button
                                type="submit"
                                className={`w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] bg-gradient-to-r ${isIncome ? 'from-emerald-500 to-emerald-400 shadow-emerald-500/20' : 'from-brand-rose-pink to-brand-light-pink shadow-brand-rose-pink/20'} text-white shadow-lg`}
                            >
                                {editingId ? <Save size={20} /> : <Plus size={20} />}
                                {editingId ? 'Guardar Cambios' : (isIncome ? `Guardar Ingreso en ${categoryInfo.name}` : `Registrar Gasto de ${categoryInfo.name}`)}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column (History) */}
                {categoryHistory.length > 0 && (
                    <div className="glass-panel p-6 sticky top-4 max-h-[calc(100vh-8rem)] flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 shrink-0">
                            <FileText size={20} className={`${categoryInfo.color}`} />
                            {`Historial de ${categoryInfo.name}`}
                        </h3>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {categoryHistory.map(exp => (
                                <div key={exp.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                                    <div>
                                        <p className={`font-bold text-sm ${exp.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                            {exp.amount > 0 ? '+' : ''}{exp.amount.toLocaleString('es-AR')}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`${categoryInfo.color} text-xs font-semibold`}>
                                                {exp.description.includes(' - ') ? exp.description.split(' - ')[1] : exp.description}
                                            </span>
                                            <span className="text-white/30 text-xs">•</span>
                                            <span className="text-white/50 text-xs">{formatDateList(exp.date)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEditClick(exp)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                            title="Editar registro"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => deletePersonalExpense(exp.id)}
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
                )}
            </main>
        </div>
    );
};

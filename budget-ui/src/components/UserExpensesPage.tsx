import { useState } from "react";
import { ArrowLeft, FileText, Trash2, Wallet, CreditCard, TrendingUp, Home, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useBudget } from "../context/BudgetContext";

const CATEGORIES = [
    { id: "tarjetas", name: "Tarjetas", icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/20" },
    { id: "gastos-corriente", name: "Gastos del corriente mes", icon: Wallet, color: "text-brand-light-pink", bg: "bg-brand-rose-pink/10" },
    { id: "gastos", name: "Gastos del siguiente mes", icon: Wallet, color: "text-brand-rose-pink", bg: "bg-brand-rose-pink/20" },
    { id: "inversion", name: "Inversion", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { id: "casa", name: "Casa", icon: Home, color: "text-amber-400", bg: "bg-amber-500/20" },
];

export const UserExpensesPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { personalExpenses, addPersonalExpense, deletePersonalExpense, users } = useBudget();

    const [showForm, setShowForm] = useState(false);
    const [detail, setDetail] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId && amount) {
            const finalAmount = -Math.abs(Number(amount));
            const categoryToUse = CATEGORIES.find(c => c.id === "gastos-corriente")?.name || "Gastos del corriente mes";
            const fullDescription = detail.trim() ? `${categoryToUse} - ${detail.trim()}` : categoryToUse;
            addPersonalExpense(userId, fullDescription, finalAmount, date);
            setAmount("");
            setDetail("");
            setShowForm(false);
        }
    };

    const user = users.find(u => u.id === userId);
    const userName = user?.name || (userId ? userId.charAt(0).toUpperCase() + userId.slice(1) : "Usuario");

    // Get personal expenses for this user
    const userExpenses = [...personalExpenses]
        .filter(exp => exp.userId === userId)
        .sort((a, b) => b.id - a.id);

    const totalGastos = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const getCategoryDetails = (desc: string) => {
        const baseName = desc.includes(' - ') ? desc.split(' - ')[0] : desc;
        const normalized = baseName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return CATEGORIES.find(c => c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized) || CATEGORIES[1];
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <main className="px-4 md:px-8 py-6 pb-4 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Gastos de {userName}</h2>
                            <p className="text-white/60 text-[10px] md:text-xs mt-1">Gastos personales independientes</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-rose-pink to-brand-light-pink text-white font-semibold text-sm hover:scale-105 transition-transform shadow-lg shadow-brand-rose-pink/20 w-full sm:w-auto justify-center"
                    >
                        <Plus size={18} />
                        Gastos del corriente mes
                    </button>
                </div>

                {/* Inline Add Form */}
                {showForm && (
                    <div className="glass-panel p-5 mb-6 border border-brand-rose-pink/30 shadow-[0_0_15px_rgba(217,70,168,0.15)] animate-in fade-in slide-in-from-top-4 duration-300">
                        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1">
                                    <FileText size={12} /> Detalle (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    placeholder="Ej: Perfume"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-brand-rose-pink transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Monto del Gasto</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-white text-sm font-bold focus:outline-none focus:border-brand-rose-pink transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-white/60 mb-1">
                                    <CalendarIcon size={12} /> Fecha
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-3 text-white text-sm focus:outline-none focus:border-brand-rose-pink transition-colors [color-scheme:dark]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 rounded-xl bg-brand-rose-pink/20 text-brand-rose-pink font-bold text-sm hover:bg-brand-rose-pink hover:text-white transition-all border border-brand-rose-pink/50 shadow-[0_0_10px_rgba(217,70,168,0.2)]"
                            >
                                Guardar Gasto
                            </button>
                        </form>
                    </div>
                )}

                {/* Total Summary */}
                <div className="glass-panel p-5 mb-4 flex justify-between items-center bg-gradient-to-r from-brand-dark-plum to-[#211130]">
                    <div>
                        <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-semibold">Total Registros</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">
                            ${totalGastos.toLocaleString("es-AR")}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-brand-rose-pink/20 flex items-center justify-center text-brand-rose-pink">
                        <Wallet size={20} />
                    </div>
                </div>

                {/* Categories Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {CATEGORIES.map(cat => {
                        const totalCat = userExpenses.filter(e => e.description === cat.name || e.description.startsWith(`${cat.name} - `)).reduce((sum, e) => sum + e.amount, 0);
                        const Icon = cat.icon;
                        return (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/personal-expense/${userId}/${cat.id}?type=gasto`)}
                                className="glass-panel p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/20 hover:scale-[1.02] active:scale-95 relative group"
                            >
                                <div
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-white/20 group-hover:text-white transition-all z-10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/personal-expense/${userId}/${cat.id}?type=ingreso`);
                                    }}
                                >
                                    <Plus size={14} />
                                </div>
                                <div className={`w-10 h-10 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center mb-2`}>
                                    <Icon size={18} />
                                </div>
                                <span className="text-white/80 text-xs mb-1 font-medium">{cat.name}</span>
                                <span className="text-white font-bold text-lg">${totalCat.toLocaleString("es-AR")}</span>
                            </div>
                        );
                    })}
                </div>




                {/* Expenses List */}
                <div className="glass-panel p-4">
                    {userExpenses.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-white/40">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-semibold">Sin registros todavía</p>
                            <p className="text-sm mt-1">Presioná "Gastos del corriente mes" para agregar uno.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {userExpenses.map(exp => {
                                const catDetails = getCategoryDetails(exp.description);
                                const Icon = catDetails.icon;
                                return (
                                    <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catDetails.bg} ${catDetails.color} shrink-0`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-base">${exp.amount.toLocaleString('es-AR')}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`${catDetails.color} text-xs font-semibold`}>
                                                        {exp.description.includes(' - ') ? exp.description.split(' - ')[1] : exp.description}
                                                    </span>
                                                    <span className="text-white/30 text-xs">•</span>
                                                    <span className="text-white/50 text-xs">{formatDateList(exp.date)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deletePersonalExpense(exp.id)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            title="Eliminar registro"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Helper for formatting date in the list nicely
const formatDateList = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) return dateStr;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

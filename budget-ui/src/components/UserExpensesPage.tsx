import { useState } from "react";
import { ArrowLeft, FileText, Trash2, DollarSign, Plus, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useBudget } from "../context/BudgetContext";

export const UserExpensesPage = () => {
    const { userId } = useParams();
    const { personalExpenses, addPersonalExpense, deletePersonalExpense, users } = useBudget();

    const user = users.find(u => u.id === userId);
    const userName = user?.name || (userId ? userId.charAt(0).toUpperCase() + userId.slice(1) : "Usuario");

    // Get personal expenses for this user
    const userExpenses = [...personalExpenses]
        .filter(exp => exp.userId === userId)
        .sort((a, b) => b.id - a.id);

    const totalGastos = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Inline form state
    const [showForm, setShowForm] = useState(false);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        addPersonalExpense(userId, description, Number(amount), date);
        setDescription("");
        setAmount("");
        setDate(new Date().toISOString().split('T')[0]);
        setShowForm(false);
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <header className="flex justify-between items-center py-4 px-8 border-b border-white/10 mb-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">Gastos de {userName}</h2>
                        <p className="text-white/60 text-xs mt-1">Gastos personales, independientes de los operativos</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-rose-pink to-brand-light-pink text-white font-semibold text-sm hover:scale-105 transition-transform shadow-lg shadow-brand-rose-pink/20"
                >
                    <Plus size={18} />
                    Nuevo Gasto
                </button>
            </header>

            <main className="px-8 pb-4 max-w-5xl mx-auto">
                {/* Total Summary */}
                <div className="glass-panel p-5 mb-4 flex justify-between items-center bg-gradient-to-r from-brand-dark-plum to-[#211130]">
                    <div>
                        <p className="text-white/60 text-xs mb-1 uppercase tracking-wider font-semibold">Total Gastos Personales</p>
                        <h3 className="text-3xl font-bold text-white tracking-tight">
                            ${totalGastos.toLocaleString("es-AR")}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-brand-rose-pink/20 flex items-center justify-center text-brand-rose-pink">
                        <Wallet size={20} />
                    </div>
                </div>

                {/* Inline Add Form */}
                {showForm && (
                    <div className="glass-panel p-5 mb-4">
                        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Descripción</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ej: Café, Uber..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1">Fecha</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-light-pink transition-colors [color-scheme:dark]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-brand-rose-pink to-brand-light-pink text-white hover:scale-[1.02] transition-transform"
                            >
                                <Plus size={16} />
                                Agregar
                            </button>
                        </form>
                    </div>
                )}

                {/* Expenses List */}
                <div className="glass-panel p-4">
                    {userExpenses.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-white/40">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-semibold">Sin gastos personales</p>
                            <p className="text-sm mt-1">Presioná "Nuevo Gasto" para registrar uno.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {userExpenses.map(exp => (
                                <div key={exp.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-rose-pink/20 text-brand-rose-pink shrink-0">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-base">${exp.amount.toLocaleString('es-AR')}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-brand-light-pink text-xs font-semibold">{exp.description}</span>
                                                <span className="text-white/30 text-xs">•</span>
                                                <span className="text-white/50 text-xs">{exp.date}</span>
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
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

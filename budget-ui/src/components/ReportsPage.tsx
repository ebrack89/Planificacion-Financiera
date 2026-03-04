import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useBudget, DEFAULT_CATEGORIES } from "../context/BudgetContext";

interface MonthlyReport {
    key: string;
    label: string;
    month: string;
    year: string;
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    expensesByCategory: { name: string; amount: number; color: string; icon: React.ElementType }[];
    incomesBySource: { source: string; amount: number }[];
}

export const ReportsPage = () => {
    const { expenses, incomes } = useBudget();

    // Group all transactions by month/year
    const monthNames: Record<string, string> = {
        "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
        "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
        "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
    };

    // Collect all unique month/year combinations
    const monthKeys = new Set<string>();

    expenses.forEach(exp => {
        const [, month, year] = exp.date.split('/');
        monthKeys.add(`${year}-${month}`);
    });

    incomes.forEach(inc => {
        const [, month, year] = inc.date.split('/');
        monthKeys.add(`${year}-${month}`);
    });

    // Build reports sorted by most recent first
    const reports: MonthlyReport[] = Array.from(monthKeys)
        .sort((a, b) => b.localeCompare(a))
        .map(key => {
            const [year, month] = key.split('-');

            const monthExpenses = expenses.filter(exp => {
                const [, m, y] = exp.date.split('/');
                return m === month && y === year;
            });

            const monthIncomes = incomes.filter(inc => {
                const [, m, y] = inc.date.split('/');
                return m === month && y === year;
            });

            const totalGastos = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            const totalIngresos = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);

            // Group expenses by category
            const expByCat: Record<number, number> = {};
            monthExpenses.forEach(exp => {
                expByCat[exp.categoryId] = (expByCat[exp.categoryId] || 0) + exp.amount;
            });

            const expensesByCategory = Object.entries(expByCat).map(([catId, amount]) => {
                const cat = DEFAULT_CATEGORIES.find(c => c.id === Number(catId)) || DEFAULT_CATEGORIES[0];
                return { name: cat.name, amount, color: cat.color, icon: cat.icon };
            }).sort((a, b) => b.amount - a.amount);

            // Group incomes by source
            const incBySource: Record<string, number> = {};
            monthIncomes.forEach(inc => {
                incBySource[inc.source] = (incBySource[inc.source] || 0) + inc.amount;
            });

            const incomesBySource = Object.entries(incBySource).map(([source, amount]) => ({
                source, amount
            })).sort((a, b) => b.amount - a.amount);

            return {
                key,
                label: `${monthNames[month] || month} ${year}`,
                month,
                year,
                totalIngresos,
                totalGastos,
                balance: totalIngresos - totalGastos,
                expensesByCategory,
                incomesBySource
            };
        });

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <main className="px-4 md:px-8 py-6 pb-8 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">Reportes Mensuales</h2>
                        <p className="text-white/60 text-xs mt-1">Resumen de ingresos y gastos por mes</p>
                    </div>
                </div>
                {reports.length === 0 ? (
                    <div className="glass-panel p-12 flex flex-col items-center justify-center text-white/40">
                        <Calendar size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-semibold">Sin datos para generar reportes</p>
                        <p className="text-sm mt-1">Los reportes aparecerán cuando registres ingresos o gastos.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {reports.map(report => (
                            <div key={report.key} className="glass-panel p-6 rounded-3xl">
                                {/* Month Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-brand-rose-pink/20 flex items-center justify-center text-brand-rose-pink">
                                        <Calendar size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{report.label}</h3>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {/* Total Ingresos */}
                                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp size={16} className="text-emerald-400" />
                                            <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Ingresos</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">${report.totalIngresos.toLocaleString("es-AR")}</p>
                                    </div>

                                    {/* Total Gastos */}
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingDown size={16} className="text-red-400" />
                                            <span className="text-xs text-red-400 uppercase tracking-wider font-semibold">Gastos</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">${report.totalGastos.toLocaleString("es-AR")}</p>
                                    </div>

                                    {/* Balance */}
                                    <div className={`p-4 rounded-2xl border ${report.balance >= 0
                                        ? 'bg-emerald-500/10 border-emerald-500/20'
                                        : 'bg-red-500/10 border-red-500/20'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign size={16} className={report.balance >= 0 ? 'text-emerald-400' : 'text-red-400'} />
                                            <span className={`text-xs uppercase tracking-wider font-semibold ${report.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                Balance
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">
                                            {report.balance < 0 ? '-' : ''}${Math.abs(report.balance).toLocaleString("es-AR")}
                                        </p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Expenses by Category */}
                                    {report.expensesByCategory.length > 0 && (
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Gastos por Categoría</h4>
                                            <div className="space-y-2">
                                                {report.expensesByCategory.map((cat, i) => {
                                                    const CatIcon = cat.icon;
                                                    return (
                                                        <div key={i} className="flex items-center justify-between py-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.color} shrink-0`}>
                                                                    <CatIcon size={16} />
                                                                </div>
                                                                <span className="text-white text-sm font-medium">{cat.name}</span>
                                                            </div>
                                                            <span className="text-white font-bold text-sm">${cat.amount.toLocaleString("es-AR")}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Incomes by Source */}
                                    {report.incomesBySource.length > 0 && (
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Ingresos por Origen</h4>
                                            <div className="space-y-2">
                                                {report.incomesBySource.map((inc, i) => (
                                                    <div key={i} className="flex items-center justify-between py-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/20 text-emerald-400 shrink-0">
                                                                <TrendingUp size={16} />
                                                            </div>
                                                            <span className="text-white text-sm font-medium">{inc.source}</span>
                                                        </div>
                                                        <span className="text-white font-bold text-sm">${inc.amount.toLocaleString("es-AR")}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

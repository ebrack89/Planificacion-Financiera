import { ArrowLeft, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useBudget } from "../context/BudgetContext";

export const AllExpensesPage = () => {
    const { expenses, categories } = useBudget();

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    const categoriesWithTotals = categories.map(category => {
        const allCategoryExpenses = expenses.filter(exp => exp.categoryId === category.id);
        const totalAmount = allCategoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        return {
            ...category,
            totalAmount,
            percent: totalExpenses > 0 ? (totalAmount / totalExpenses) * 100 : 0,
        };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full">
            <main className="px-4 md:px-8 py-6 pb-4 max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Todos los Gastos</h2>
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-rose-pink/15 border border-brand-rose-pink/20">
                        <DollarSign size={16} className="text-brand-rose-pink" />
                        <span className="text-brand-rose-pink font-bold text-lg">${totalExpenses.toLocaleString('es-AR')}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {categoriesWithTotals.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                to={`/edit-transaction/${category.id}`}
                                key={category.id}
                                className="glass-panel flex flex-col p-4 rounded-2xl hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5 group"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.color} transition-transform group-hover:scale-110 shrink-0`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-sm truncate">{category.name}</h4>
                                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">{category.category}</p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <p className="text-white font-bold text-xl">${category.totalAmount.toLocaleString("es-AR")}</p>
                                    {/* Percentage bar */}
                                    <div className="mt-2 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-brand-rose-pink to-brand-light-pink transition-all duration-500"
                                            style={{ width: `${Math.max(category.percent, 2)}%` }}
                                        />
                                    </div>
                                    <p className="text-white/30 text-[10px] mt-1 text-right font-semibold">{category.percent.toFixed(1)}%</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

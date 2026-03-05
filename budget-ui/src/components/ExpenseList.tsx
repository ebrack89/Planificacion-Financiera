
import { Link } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { useBudget } from "../context/BudgetContext";

export const ExpenseList = () => {
    const { expenses, categories } = useBudget();

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoriesWithTotals = categories.map(category => {
        const totalAmount = expenses
            .filter(exp => exp.categoryId === category.id)
            .reduce((sum, exp) => sum + exp.amount, 0);

        return {
            ...category,
            totalAmount
        };
    });

    return (
        <div className="p-4 glass-panel mb-4">
            <div className="flex flex-col gap-3 mb-3 w-full">
                <div className="flex items-center justify-between gap-2 overflow-hidden w-full">
                    <h3 className="text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">Gastos del siguiente mes</h3>
                    <div className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-brand-rose-pink/15 border border-brand-rose-pink/20 shrink-0">
                        <DollarSign size={14} className="text-brand-rose-pink shrink-0" />
                        <span className="text-brand-rose-pink font-bold text-xs sm:text-sm whitespace-nowrap">${totalExpenses.toLocaleString('es-AR')}</span>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 w-full shrink-0">
                    <Link to="/add-transaction?type=gasto" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-semibold flex items-center gap-1 whitespace-nowrap">
                        + Agregar
                    </Link>
                    <Link to="/expenses" className="text-sm text-brand-light-pink hover:text-white transition-colors whitespace-nowrap">
                        Ver todos
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoriesWithTotals.map((category) => {
                    const Icon = category.icon;
                    return (
                        <Link
                            to={`/edit-transaction/${category.id}`}
                            key={category.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-white font-medium text-sm leading-tight line-clamp-2 break-words text-left" title={category.name}>
                                        {category.name}
                                    </h4>
                                    <span className="text-[10px] sm:text-xs text-white/50 block truncate text-left mt-0.5">{category.category}</span>
                                </div>
                            </div>
                            <div className="text-right whitespace-nowrap shrink-0 ml-2">
                                <p className="text-white font-bold">${category.totalAmount.toLocaleString("es-AR")}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

import { useBudget } from "../context/BudgetContext";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";
import { UserCard } from "./UserCard";
import { ExpenseList } from "./ExpenseList";
import { ExpenseDonutChart } from "./ExpenseDonutChart";

export const Dashboard = () => {
    const { users, currentPeriod, setCurrentPeriod } = useBudget();

    const handlePrevMonth = () => {
        const [m, y] = currentPeriod.split('/').map(Number);
        const newDate = new Date(y, m - 2, 1);
        setCurrentPeriod(`${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`);
    };

    const handleNextMonth = () => {
        const [m, y] = currentPeriod.split('/').map(Number);
        const newDate = new Date(y, m, 1);
        setCurrentPeriod(`${String(newDate.getMonth() + 1).padStart(2, '0')}/${newDate.getFullYear()}`);
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <TopBar />

            <main className="px-6 pb-2">
                {/* Period Selector */}
                <div className="flex items-center justify-between mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-rose-pink/20 text-brand-rose-pink flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Período Actual</p>
                            <h2 className="text-xl font-bold text-white tracking-tight">{currentPeriod}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevMonth}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                {/* User Cards Section */}
                <section className={`grid grid-cols-1 gap-4 mb-2 ${users.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {users.map(user => (
                        <UserCard
                            key={user.id}
                            id={user.id}
                            name={user.name}
                            balance={user.balance.toLocaleString('es-AR')}
                            variant={user.variant}
                        />
                    ))}
                </section>

                {/* Expenses Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <ExpenseList />
                    </div>
                    <div>
                        <ExpenseDonutChart />
                    </div>
                </div>
            </main>
        </div>
    );
};

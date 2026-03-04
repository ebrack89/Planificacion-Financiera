import { useBudget } from "../context/BudgetContext";
import { UserCard } from "./UserCard";
import { ExpenseList } from "./ExpenseList";
import { ExpenseDonutChart } from "./ExpenseDonutChart";

export const Dashboard = () => {
    const { users } = useBudget();

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto">

            <main className="px-6 pb-2">
                {/* User Cards Section */}
                <section className={`grid grid-cols-1 gap-4 mb-2 ${users.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {[...users].sort((a, b) => a.name.localeCompare(b.name)).map(user => (
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

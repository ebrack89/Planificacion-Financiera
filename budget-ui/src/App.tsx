import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { TransactionForm } from "./components/TransactionForm";
import { AllExpensesPage } from "./components/AllExpensesPage";
import { ExpenseDetail } from "./components/ExpenseDetail";
import { UserExpensesPage } from "./components/UserExpensesPage";
import { ReportsPage } from "./components/ReportsPage";
import { BudgetProvider } from "./context/BudgetContext";

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="flex min-h-screen font-sans selection:bg-brand-rose-pink/30">
        <BudgetProvider>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-transaction" element={<TransactionForm />} />
            <Route path="/expenses" element={<AllExpensesPage />} />
            <Route path="/edit-transaction/:id" element={<ExpenseDetail />} />
            <Route path="/user-incomes/:userId" element={<UserExpensesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </BudgetProvider>
      </div>
    </Router>
  );
}

export default App;

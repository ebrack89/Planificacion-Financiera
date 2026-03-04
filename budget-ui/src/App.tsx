import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { TransactionForm } from "./components/TransactionForm";
import { AllExpensesPage } from "./components/AllExpensesPage";
import { ExpenseDetail } from "./components/ExpenseDetail";
import { UserExpensesPage } from "./components/UserExpensesPage";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";
import { TopBar } from "./components/TopBar";
import { PersonalExpenseDetail } from "./components/PersonalExpenseDetail";
import { BudgetProvider } from "./context/BudgetContext";
import { useState } from "react";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="flex flex-col md:flex-row min-h-screen bg-brand-dark-plum/95 font-sans selection:bg-brand-rose-pink/30 relative">
        <BudgetProvider>
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-transaction" element={<TransactionForm />} />
              <Route path="/expenses" element={<AllExpensesPage />} />
              <Route path="/edit-transaction/:id" element={<ExpenseDetail />} />
              <Route path="/user-incomes/:userId" element={<UserExpensesPage />} />
              <Route path="/personal-expense/:userId/:categoryId" element={<PersonalExpenseDetail />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </BudgetProvider>
      </div>
    </Router>
  );
}

export default App;

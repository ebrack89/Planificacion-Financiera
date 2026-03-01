import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ShoppingCart, Zap, Home, FileText, Wifi, DollarSign, Users, Calculator, FolderPlus } from "lucide-react";

export interface Expense {
    id: number;
    categoryId: number;
    name: string;
    category: string; // Fijo o Variable
    amount: number;
    date: string;
    icon: React.ElementType;
    color: string;
    personName?: string;
}

export interface User {
    id: string;
    name: string;
    balance: number;
    variant: "primary" | "secondary";
}

export interface Income {
    id: number;
    userId: string;
    amount: number;
    source: string;
    date: string;
}

export interface PersonalExpense {
    id: number;
    userId: string;
    description: string;
    amount: number;
    date: string;
}

export interface Vendedora {
    name: string;
    color: string;
}

export const VENDEDORA_COLORS = [
    'bg-pink-500/20 text-pink-400',
    'bg-violet-500/20 text-violet-400',
    'bg-sky-500/20 text-sky-400',
    'bg-amber-500/20 text-amber-400',
    'bg-lime-500/20 text-lime-400',
    'bg-rose-500/20 text-rose-400',
    'bg-teal-500/20 text-teal-400',
    'bg-indigo-500/20 text-indigo-400',
    'bg-fuchsia-500/20 text-fuchsia-400',
    'bg-red-500/20 text-red-400',
];

interface BudgetContextType {
    users: User[];
    expenses: Expense[];
    incomes: Income[];
    personalExpenses: PersonalExpense[];
    vendedoras: Vendedora[];
    addIncome: (userId: string, amount: number, source: string, date: string) => void;
    addExpense: (categoryId: number, amount: number, date: string, notes: string, personName?: string) => void;
    deleteExpense: (expenseId: number) => void;
    deleteIncome: (incomeId: number) => void;
    addPersonalExpense: (userId: string, description: string, amount: number, date: string) => void;
    deletePersonalExpense: (expenseId: number) => void;
    addVendedora: (name: string) => void;
    updateExpenseAmount: (expenseId: number, newAmount: number) => void;
    categories: typeof DEFAULT_CATEGORIES;
    addCategory: (name: string) => void;
}

export const DEFAULT_CATEGORIES = [
    { id: 1, name: "Supermercado", category: "Variable", icon: ShoppingCart, color: "bg-blue-500/20 text-blue-400" },
    { id: 2, name: "Luz", category: "Variable", icon: Zap, color: "bg-yellow-500/20 text-yellow-400" },
    { id: 3, name: "Expensas", category: "Fijo", icon: Home, color: "bg-purple-500/20 text-purple-400" },
    { id: 4, name: "Impuestos", category: "Fijo", icon: FileText, color: "bg-emerald-500/20 text-emerald-400" },
    { id: 5, name: "Internet", category: "Fijo", icon: Wifi, color: "bg-cyan-500/20 text-cyan-400" },
    { id: 6, name: "Publicidad", category: "Variable", icon: DollarSign, color: "bg-brand-rose-pink/20 text-brand-rose-pink" },
    { id: 7, name: "Sueldos", category: "Fijo", icon: Users, color: "bg-orange-500/20 text-orange-400" },
    { id: 8, name: "Contador", category: "Fijo", icon: Calculator, color: "bg-slate-500/20 text-slate-400" },
];

const initialExpenses: Expense[] = [
    { id: 1, categoryId: 1, name: "Supermercado", category: "Variable", amount: 450000, date: "28/02/2026", icon: ShoppingCart, color: "bg-blue-500/20 text-blue-400" },
    { id: 2, categoryId: 2, name: "Luz", category: "Variable", amount: 435000, date: "25/02/2026", icon: Zap, color: "bg-yellow-500/20 text-yellow-400" },
    { id: 3, categoryId: 3, name: "Expensas", category: "Fijo", amount: 110000, date: "10/02/2026", icon: Home, color: "bg-purple-500/20 text-purple-400" },
    { id: 4, categoryId: 4, name: "Impuestos", category: "Fijo", amount: 180000, date: "05/02/2026", icon: FileText, color: "bg-emerald-500/20 text-emerald-400" },
    { id: 5, categoryId: 5, name: "Internet", category: "Fijo", amount: 83000, date: "02/02/2026", icon: Wifi, color: "bg-cyan-500/20 text-cyan-400" },
    { id: 6, categoryId: 6, name: "Publicidad", category: "Variable", amount: 2000000, date: "01/02/2026", icon: DollarSign, color: "bg-brand-rose-pink/20 text-brand-rose-pink" },
];

const initialUsers: User[] = [
    { id: "eduardo", name: "Eduardo", balance: 1500000, variant: "primary" },
    { id: "gabriela", name: "Gabriela", balance: 850000, variant: "secondary" },
    { id: "renata", name: "Renata", balance: 0, variant: "primary" }
];

const initialIncomes: Income[] = [
    { id: 1, userId: "eduardo", amount: 1500000, source: "Sueldo", date: "01/02/2026" },
    { id: 2, userId: "gabriela", amount: 850000, source: "Sueldo", date: "01/02/2026" }
];

const STORAGE_KEYS = {
    users: 'budget_users',
    expenses: 'budget_expenses',
    incomes: 'budget_incomes',
    personalExpenses: 'budget_personal_expenses',
    vendedoras: 'budget_vendedoras',
    customCategories: 'budget_custom_categories'
};

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error(`Error loading ${key} from localStorage`, e);
    }
    return fallback;
}

function hydrateExpenses(rawExpenses: Omit<Expense, 'icon' | 'color'>[]): Expense[] {
    // Merge default + custom categories for hydration
    const customCats: { id: number; name: string; category: string }[] = (() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.customCategories);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    })();
    const allCats = [...DEFAULT_CATEGORIES, ...customCats.map((c: { id: number; name: string; category: string }) => ({ ...c, icon: FolderPlus, color: CUSTOM_CAT_COLORS[customCats.indexOf(c) % CUSTOM_CAT_COLORS.length] }))];
    return rawExpenses.map(exp => {
        const cat = allCats.find(c => c.id === exp.categoryId) || DEFAULT_CATEGORIES[0];
        return { ...exp, icon: cat.icon, color: cat.color };
    });
}

const CUSTOM_CAT_COLORS = [
    'bg-rose-500/20 text-rose-400',
    'bg-teal-500/20 text-teal-400',
    'bg-indigo-500/20 text-indigo-400',
    'bg-amber-500/20 text-amber-400',
    'bg-lime-500/20 text-lime-400',
    'bg-fuchsia-500/20 text-fuchsia-400',
    'bg-sky-500/20 text-sky-400',
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(() => loadFromStorage(STORAGE_KEYS.users, initialUsers));
    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const raw = loadFromStorage(STORAGE_KEYS.expenses, initialExpenses);
        return hydrateExpenses(raw);
    });
    const [incomes, setIncomes] = useState<Income[]>(() => loadFromStorage(STORAGE_KEYS.incomes, initialIncomes));
    const [personalExpenses, setPersonalExpenses] = useState<PersonalExpense[]>(() => loadFromStorage(STORAGE_KEYS.personalExpenses, []));
    const [vendedoras, setVendedoras] = useState<Vendedora[]>(() => loadFromStorage(STORAGE_KEYS.vendedoras, []));
    const [customCategories, setCustomCategories] = useState<{ id: number; name: string; category: string }[]>(() => loadFromStorage(STORAGE_KEYS.customCategories, []));

    // Merge default + custom categories
    const categories = [
        ...DEFAULT_CATEGORIES,
        ...customCategories.map((c, i) => ({ ...c, icon: FolderPlus, color: CUSTOM_CAT_COLORS[i % CUSTOM_CAT_COLORS.length] }))
    ];

    // Persist to localStorage on every change
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users)); }, [users]);
    useEffect(() => {
        // Strip non-serializable fields (icon) before saving
        const serializable = expenses.map(({ icon, ...rest }) => rest);
        localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(serializable));
    }, [expenses]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.incomes, JSON.stringify(incomes)); }, [incomes]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.personalExpenses, JSON.stringify(personalExpenses)); }, [personalExpenses]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.vendedoras, JSON.stringify(vendedoras)); }, [vendedoras]);
    useEffect(() => { localStorage.setItem(STORAGE_KEYS.customCategories, JSON.stringify(customCategories)); }, [customCategories]);

    const addIncome = (userId: string, amount: number, source: string, date: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, balance: amount }
                    : user
            )
        );

        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        const newIncome: Income = {
            id: Date.now(),
            userId,
            amount,
            source,
            date: formattedDate
        };

        setIncomes(prev => [...prev, newIncome]);
    };

    const addExpense = (categoryId: number, amount: number, date: string, _notes: string, personName?: string) => {
        // Find existing category in the predefined list to copy its metadata
        const existingCat = DEFAULT_CATEGORIES.find(c => c.id === categoryId) || DEFAULT_CATEGORIES[0];

        // Format date from YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        const newExpense: Expense = {
            id: Date.now(),
            categoryId,
            name: existingCat.name,
            category: existingCat.category,
            amount,
            date: formattedDate,
            icon: existingCat.icon,
            color: existingCat.color,
            ...(personName ? { personName } : {})
        };

        setExpenses(prev => [...prev, newExpense]);
    };

    const deleteExpense = (expenseId: number) => {
        setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    };

    const deleteIncome = (incomeId: number) => {
        // Find the income to get the userId before deleting
        const incomeToDelete = incomes.find(inc => inc.id === incomeId);
        const updatedIncomes = incomes.filter(inc => inc.id !== incomeId);
        setIncomes(updatedIncomes);

        if (incomeToDelete) {
            // Recalculate user balance: use the most recent remaining income, or 0 if none left
            const remainingUserIncomes = updatedIncomes
                .filter(inc => inc.userId === incomeToDelete.userId)
                .sort((a, b) => b.id - a.id);

            const newBalance = remainingUserIncomes.length > 0 ? remainingUserIncomes[0].amount : 0;

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === incomeToDelete.userId
                        ? { ...user, balance: newBalance }
                        : user
                )
            );
        }
    };

    const addPersonalExpense = (userId: string, description: string, amount: number, date: string) => {
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        const newExp: PersonalExpense = {
            id: Date.now(),
            userId,
            description,
            amount,
            date: formattedDate
        };
        setPersonalExpenses(prev => [...prev, newExp]);
    };

    const deletePersonalExpense = (expenseId: number) => {
        setPersonalExpenses(prev => prev.filter(e => e.id !== expenseId));
    };

    const addVendedora = (name: string) => {
        const color = VENDEDORA_COLORS[vendedoras.length % VENDEDORA_COLORS.length];
        setVendedoras(prev => [...prev, { name, color }]);
    };

    const updateExpenseAmount = (expenseId: number, newAmount: number) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === expenseId ? { ...exp, amount: newAmount } : exp
        ));
    };

    const addCategory = (name: string) => {
        const maxId = Math.max(...DEFAULT_CATEGORIES.map(c => c.id), ...customCategories.map(c => c.id), 0);
        setCustomCategories(prev => [...prev, { id: maxId + 1, name, category: 'Variable' }]);
    };

    return (
        <BudgetContext.Provider value={{ users, expenses, incomes, personalExpenses, vendedoras, categories, addIncome, addExpense, deleteExpense, deleteIncome, addPersonalExpense, deletePersonalExpense, addVendedora, updateExpenseAmount, addCategory }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};

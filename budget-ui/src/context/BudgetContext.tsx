import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ShoppingCart, Zap, Home, FileText, Wifi, DollarSign, Users, Calculator, FolderPlus } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

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
    updatePersonalExpense: (expenseId: number, description: string, amount: number, date: string) => void;
    deletePersonalExpense: (expenseId: number) => void;
    addVendedora: (name: string) => void;
    updateExpenseAmount: (expenseId: number, newAmount: number) => void;
    categories: typeof DEFAULT_CATEGORIES;
    addCategory: (name: string) => void;
    currentPeriod: string;
    setCurrentPeriod: (period: string) => void;
    exportData: () => void;
    importData: (data: any) => void;
    syncToCloud: () => Promise<void>;
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
    const [users, setUsers] = useState<User[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [personalExpenses, setPersonalExpenses] = useState<PersonalExpense[]>([]);
    const [vendedoras, setVendedoras] = useState<Vendedora[]>([]);
    const [customCategories, setCustomCategories] = useState<{ id: number; name: string; category: string }[]>([]);
    const [currentPeriod, setCurrentPeriod] = useState<string>("03/2026");

    const categories = [
        ...DEFAULT_CATEGORIES,
        ...customCategories.map((c, i) => ({ ...c, icon: FolderPlus, color: CUSTOM_CAT_COLORS[i % CUSTOM_CAT_COLORS.length] }))
    ];

    const formatDateToBR = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('/')) return dateStr;
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatDateToISO = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('-')) return dateStr;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    };

    const hydrateExpenses = (raw: any[], currentCustomCats: any[]): Expense[] => {
        return raw.map(exp => {
            const cat = [...DEFAULT_CATEGORIES, ...currentCustomCats.map(c => ({ ...c, icon: FolderPlus, color: CUSTOM_CAT_COLORS[currentCustomCats.indexOf(c) % CUSTOM_CAT_COLORS.length] }))].find(c => c.id === exp.category_id || c.id === exp.categoryId) || DEFAULT_CATEGORIES[0];
            return {
                id: exp.id,
                categoryId: exp.category_id || exp.categoryId,
                name: cat.name,
                category: (cat as any).category || (cat as any).type || exp.category,
                amount: Number(exp.amount),
                date: formatDateToBR(exp.date),
                icon: (cat as any).icon || FolderPlus,
                color: (cat as any).color || CUSTOM_CAT_COLORS[0],
                personName: exp.person_name || exp.personName
            };
        });
    };

    const fetchAll = async () => {
        const { data: profiles } = await supabase.from('profiles').select('*').order('name', { ascending: true });
        if (profiles) setUsers(profiles as User[]);

        const { data: dbCats } = await supabase.from('categories').select('*').eq('is_custom', true);
        const mappedCustomCats = dbCats ? dbCats.map(c => ({ id: c.id, name: c.name, category: c.type })) : [];
        setCustomCategories(mappedCustomCats);

        const { data: dbExpenses } = await supabase.from('expenses').select('*');
        if (dbExpenses) setExpenses(hydrateExpenses(dbExpenses, mappedCustomCats));

        const { data: dbIncomes } = await supabase.from('incomes').select('*');
        if (dbIncomes) setIncomes((dbIncomes || []).map(inc => ({ ...inc, id: inc.id, userId: inc.user_id, amount: Number(inc.amount), date: formatDateToBR(inc.date) })));

        const { data: dbPersonal } = await supabase.from('personal_expenses').select('*');
        if (dbPersonal) setPersonalExpenses((dbPersonal || []).map(exp => ({ ...exp, id: exp.id, userId: exp.user_id, amount: Number(exp.amount), date: formatDateToBR(exp.date) })));
    };

    useEffect(() => {
        fetchAll();

        // Realtime subscriptions
        const channels = [
            supabase.channel('profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchAll),
            supabase.channel('expenses').on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, fetchAll),
            supabase.channel('incomes').on('postgres_changes', { event: '*', schema: 'public', table: 'incomes' }, fetchAll),
            supabase.channel('personal_expenses').on('postgres_changes', { event: '*', schema: 'public', table: 'personal_expenses' }, fetchAll),
            supabase.channel('categories').on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchAll),
        ].map(c => c.subscribe());

        return () => {
            channels.forEach(c => supabase.removeChannel(c));
        };
    }, []);

    const addIncome = async (userId: string, amount: number, source: string, date: string) => {
        const isoDate = formatDateToISO(date);
        await supabase.from('incomes').insert([{ user_id: userId, amount, source, date: isoDate }]);
        await supabase.from('profiles').update({ balance: amount }).eq('id', userId);
    };

    const addExpense = async (categoryId: number, amount: number, date: string, _notes: string, personName?: string) => {
        const isoDate = formatDateToISO(date);
        await supabase.from('expenses').insert([{ category_id: categoryId, amount, date: isoDate, person_name: personName }]);
    };

    const deleteExpense = async (expenseId: number) => {
        await supabase.from('expenses').delete().eq('id', expenseId);
    };

    const deleteIncome = async (incomeId: number) => {
        const income = incomes.find(i => i.id === incomeId);
        await supabase.from('incomes').delete().eq('id', incomeId);
        if (income) {
            const { data: remaining } = await supabase.from('incomes').select('*').eq('user_id', income.userId).order('id', { ascending: false }).limit(1);
            const newBalance = remaining && remaining.length > 0 ? remaining[0].amount : 0;
            await supabase.from('profiles').update({ balance: newBalance }).eq('id', income.userId);
        }
    };

    const addPersonalExpense = async (userId: string, description: string, amount: number, date: string) => {
        const isoDate = formatDateToISO(date);
        await supabase.from('personal_expenses').insert([{ user_id: userId, description, amount, date: isoDate }]);
    };

    const updatePersonalExpense = async (expenseId: number, description: string, amount: number, date: string) => {
        const isoDate = formatDateToISO(date);
        await supabase.from('personal_expenses').update({ description, amount, date: isoDate }).eq('id', expenseId);
    };

    const deletePersonalExpense = async (expenseId: number) => {
        await supabase.from('personal_expenses').delete().eq('id', expenseId);
    };

    const addVendedora = (name: string) => {
        const color = VENDEDORA_COLORS[vendedoras.length % VENDEDORA_COLORS.length];
        setVendedoras(prev => [...prev, { name, color }]);
    };

    const updateExpenseAmount = async (expenseId: number, newAmount: number) => {
        await supabase.from('expenses').update({ amount: newAmount }).eq('id', expenseId);
    };

    const addCategory = async (name: string) => {
        await supabase.from('categories').insert([{ name, type: 'Variable', is_custom: true }]);
    };

    const exportData = () => {
        const data = { users, expenses, incomes, personalExpenses, vendedoras, customCategories, currentPeriod };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `planificacion_financiera_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const importData = (data: any) => {
        console.log("Use syncToCloud for migration", data);
    };

    const syncToCloud = async () => {
        const localExpenses = JSON.parse(localStorage.getItem('budget_expenses') || '[]');
        const localIncomes = JSON.parse(localStorage.getItem('budget_incomes') || '[]');
        const localPersonal = JSON.parse(localStorage.getItem('budget_personal_expenses') || '[]');
        const localCustomCats = JSON.parse(localStorage.getItem('budget_custom_categories') || '[]');

        for (const cat of localCustomCats) {
            await supabase.from('categories').upsert({ id: cat.id, name: cat.name, type: cat.category, is_custom: true });
        }

        if (localIncomes.length > 0) {
            await supabase.from('incomes').insert(localIncomes.map((inc: any) => ({
                user_id: inc.userId,
                amount: inc.amount,
                source: inc.source,
                date: formatDateToISO(inc.date)
            })));
        }

        if (localExpenses.length > 0) {
            await supabase.from('expenses').insert(localExpenses.map((exp: any) => ({
                category_id: exp.categoryId,
                amount: exp.amount,
                date: formatDateToISO(exp.date),
                person_name: exp.personName
            })));
        }

        if (localPersonal.length > 0) {
            await supabase.from('personal_expenses').insert(localPersonal.map((exp: any) => ({
                user_id: exp.userId,
                description: exp.description,
                amount: exp.amount,
                date: formatDateToISO(exp.date)
            })));
        }

        await fetchAll();
    };

    return (
        <BudgetContext.Provider value={{
            users, expenses, incomes, personalExpenses, vendedoras, categories,
            addIncome, addExpense, deleteExpense, deleteIncome, addPersonalExpense, updatePersonalExpense,
            deletePersonalExpense, addVendedora, updateExpenseAmount, addCategory,
            currentPeriod, setCurrentPeriod, exportData, importData, syncToCloud
        }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) throw new Error('useBudget must be used within a BudgetProvider');
    return context;
};

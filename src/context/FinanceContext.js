import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [distribution, setDistribution] = useState({ savings: 20, fixed: 50, variable: 30 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const inc = await storage.getItem('incomes');
        const exp = await storage.getItem('expenses');
        const dist = await storage.getItem('distribution');
        if (inc) setIncomes(inc);
        if (exp) setExpenses(exp);
        if (dist) setDistribution(dist);
        setLoading(false);
    };

    const addIncome = async (item) => {
        const newIncomes = [...incomes, { ...item, id: Date.now().toString() }];
        setIncomes(newIncomes);
        await storage.setItem('incomes', newIncomes);
    };

    const removeIncome = async (id) => {
        const newIncomes = incomes.filter(i => i.id !== id);
        setIncomes(newIncomes);
        await storage.setItem('incomes', newIncomes);
    };

    const addExpense = async (item) => {
        const newExpenses = [...expenses, { ...item, id: Date.now().toString() }];
        setExpenses(newExpenses);
        await storage.setItem('expenses', newExpenses);
    };

    const removeExpense = async (id) => {
        const newExpenses = expenses.filter(e => e.id !== id);
        setExpenses(newExpenses);
        await storage.setItem('expenses', newExpenses);
    };

    const updateDistribution = async (dist) => {
        setDistribution(dist);
        await storage.setItem('distribution', dist);
    };

    return (
        <FinanceContext.Provider value={{
            incomes,
            expenses,
            distribution,
            addIncome,
            removeIncome,
            addExpense,
            removeExpense,
            updateDistribution,
            loading
        }}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => useContext(FinanceContext);

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors, layout } from '../theme/colors';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/format';
import { useNavigation } from '@react-navigation/native';

export const DashboardScreen = () => {
    const { incomes, expenses, distribution } = useFinance();
    const navigation = useNavigation();

    const {
        totalIncome,
        budgetSavings,
        budgetFixed,
        budgetVariable,
        actualFixed,
        actualVariable,
        actualHormiga
    } = useMemo(() => {
        const inc = incomes.reduce((sum, item) => {
            const freq = item.frequency || 1;
            return sum + (parseFloat(item.amount) / freq);
        }, 0);

        const calcBudget = (pct) => inc * (pct / 100);

        const expByType = (type) => expenses
            .filter(e => e.type === type)
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        return {
            totalIncome: inc,
            budgetSavings: calcBudget(distribution.savings),
            budgetFixed: calcBudget(distribution.fixed),
            budgetVariable: calcBudget(distribution.variable),
            actualFixed: expByType('fijo'),
            actualVariable: expByType('variable'),
            actualHormiga: expByType('hormiga'),
        };
    }, [incomes, expenses, distribution]);

    const SummaryCard = ({ title, amount, subtitle, color, onPress }) => (
        <TouchableOpacity onPress={onPress} style={{ width: '100%', maxWidth: 400 }}>
            <Card style={[styles.summaryCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={[styles.cardAmount, { color }]}>{formatCurrency(amount)}</Text>
                {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
            </Card>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>Dashboard</Text>

            <View style={styles.grid}>
                <SummaryCard
                    title="Ingresos Mensuales"
                    amount={totalIncome}
                    subtitle="Toca para editar"
                    color={colors.primary}
                    onPress={() => navigation.navigate('Ingresos')}
                />

                <SummaryCard
                    title="Ahorro Mensual (Est.)"
                    amount={budgetSavings}
                    subtitle={`Anual: ${formatCurrency(budgetSavings * 12)}`}
                    color={colors.primary}
                    onPress={() => navigation.navigate('Configuracion')}
                />

                <SummaryCard
                    title="Gastos Fijos"
                    amount={actualFixed}
                    subtitle={`Presupuesto: ${formatCurrency(budgetFixed)}`}
                    color={colors.danger}
                    onPress={() => navigation.navigate('Gastos', { type: 'fijo' })}
                />

                <SummaryCard
                    title="Gastos Variables"
                    amount={actualVariable}
                    subtitle={`Disp: ${formatCurrency(budgetVariable - actualVariable - actualHormiga)}`}
                    color={colors.warning}
                    onPress={() => navigation.navigate('Gastos', { type: 'variable' })}
                />

                <SummaryCard
                    title="Gastos Hormiga"
                    amount={actualHormiga}
                    subtitle="¡Cuidado con estos!"
                    color={colors.warning}
                    onPress={() => navigation.navigate('Gastos', { type: 'hormiga' })}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.background,
        minHeight: '100%',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center', // Centered for web
    },
    summaryCard: { // Explicitly flat naming to avoid confusion
        marginBottom: 0, // Reset default generic card margin if used in grid wrapper
    },
    cardTitle: {
        fontSize: 14,
        color: colors.textLight,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    cardAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    cardSubtitle: {
        fontSize: 12,
        color: colors.textLight,
    }
});

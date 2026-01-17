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

    const windowWidth = Dimensions.get('window').width;
    const isMobile = windowWidth < 768;

    const SummaryCard = ({ title, amount, subtitle, color, onPress }) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.cardContainer,
                { width: isMobile ? '100%' : '48%' } // Responsive width
            ]}
        >
            <Card style={[styles.summaryCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>
                <Text style={[styles.cardAmount, { color: colors.text }]}>{formatCurrency(amount)}</Text>
                {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
            </Card>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Text style={styles.headerDate}>{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</Text>
            </View>

            <View style={styles.grid}>
                <SummaryCard
                    title="Ingresos Mensuales"
                    amount={totalIncome}
                    subtitle="Toca para editar"
                    color={colors.success}
                    onPress={() => navigation.navigate('Ingresos')}
                />

                <SummaryCard
                    title="Ahorro Mensual (Est.)"
                    amount={budgetSavings}
                    subtitle={`Anual: ${formatCurrency(budgetSavings * 12)}`}
                    color={colors.success}
                    onPress={() => navigation.navigate('Configuración')}
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
        paddingTop: Platform.OS === 'web' ? 20 : 60, // Extra padding for mobile status bar
        backgroundColor: colors.background,
        minHeight: '100%',
    },
    headerContainer: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -1,
    },
    headerDate: {
        fontSize: 16,
        color: colors.textLight,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    cardContainer: {
        marginBottom: 8,
    },
    summaryCard: {
        height: '100%',
        justifyContent: 'center',
        elevation: 2, // Softer shadow for Android
    },
    cardHeader: {
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 13,
        color: colors.textLight,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: colors.textLight,
        fontWeight: '500',
    }
});

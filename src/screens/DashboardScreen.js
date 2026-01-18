import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        actualHormiga,
        balance
    } = useMemo(() => {
        const inc = incomes.reduce((sum, item) => {
            const freq = item.frequency || 1;
            return sum + (parseFloat(item.amount) / freq);
        }, 0);

        const calcBudget = (pct) => inc * (pct / 100);

        const expByType = (type) => expenses
            .filter(e => e.type === type)
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        const totalExpenses = expByType('fijo') + expByType('variable') + expByType('hormiga');

        return {
            totalIncome: inc,
            budgetSavings: calcBudget(distribution.savings),
            budgetFixed: calcBudget(distribution.fixed),
            budgetVariable: calcBudget(distribution.variable),
            actualFixed: expByType('fijo'),
            actualVariable: expByType('variable'),
            actualHormiga: expByType('hormiga'),
            balance: inc - totalExpenses
        };
    }, [incomes, expenses, distribution]);

    const windowWidth = Dimensions.get('window').width;
    const isWebDesktop = Platform.OS === 'web' && windowWidth > 768;
    const availableWidth = isWebDesktop ? windowWidth - 250 : windowWidth;
    const isMobile = availableWidth < 700;

    const BalanceHero = () => (
        <View style={styles.heroContainer}>
            <View style={{ flex: 1 }}>
                <Text style={styles.heroLabel}>Balance General</Text>
                <Text style={styles.heroAmount}>{formatCurrency(balance)}</Text>
            </View>
            <View style={styles.heroIcon}>
                <Ionicons name="wallet" size={32} color={colors.primary} />
            </View>
        </View>
    );

    const SummaryCard = ({ title, amount, subtitle, color, onPress, icon, progress, progressMax }) => {
        const progressPercent = progressMax > 0 ? Math.min((progress / progressMax) * 100, 100) : 0;

        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                    styles.cardContainer,
                    { width: isMobile ? '100%' : '48%' }
                ]}
            >
                <Card style={[styles.summaryCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                        </View>
                        {icon && <Ionicons name={icon} size={18} color={color} />}
                    </View>
                    <Text style={[styles.cardAmount, { color: colors.text }]}>{formatCurrency(amount)}</Text>

                    {progressMax !== undefined && (
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: color }]} />
                        </View>
                    )}

                    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Text style={styles.headerDate}>{new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</Text>
            </View>

            <BalanceHero />

            <View style={styles.grid}>
                <SummaryCard
                    title="Ingresos"
                    amount={totalIncome}
                    subtitle="Mensuales"
                    color={colors.success}
                    icon="arrow-up-circle"
                    onPress={() => navigation.navigate('Ingresos')}
                />

                <SummaryCard
                    title="Ahorro Estimado"
                    amount={budgetSavings}
                    subtitle={`Meta anual: ${formatCurrency(budgetSavings * 12)}`}
                    color={colors.accent}
                    icon="shield-checkmark"
                    onPress={() => navigation.navigate('Configuración')}
                />

                <SummaryCard
                    title="Gastos Fijos"
                    amount={actualFixed}
                    subtitle={`Presupuesto: ${formatCurrency(budgetFixed)}`}
                    color={colors.danger}
                    icon="home"
                    progress={actualFixed}
                    progressMax={budgetFixed}
                    onPress={() => navigation.navigate('Gastos', { type: 'fijo' })}
                />

                <SummaryCard
                    title="Gastos Variables"
                    amount={actualVariable}
                    subtitle={`Disponible: ${formatCurrency(budgetVariable - actualVariable - actualHormiga)}`}
                    color={colors.warning}
                    icon="cart"
                    progress={actualVariable}
                    progressMax={budgetVariable}
                    onPress={() => navigation.navigate('Gastos', { type: 'variable' })}
                />

                <SummaryCard
                    title="Gastos Hormiga"
                    amount={actualHormiga}
                    subtitle="¡Reduce estos gastos!"
                    color={colors.danger}
                    icon="bug"
                    onPress={() => navigation.navigate('Gastos', { type: 'hormiga' })}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: Platform.OS === 'web' ? 16 : 50,
        paddingBottom: 40, // Extra padding to prevent bottom cutoff
        backgroundColor: colors.background,
        minHeight: '100%',
    },
    headerContainer: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -1,
    },
    headerDate: {
        fontSize: 14,
        color: colors.textLight,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    cardContainer: {
        marginBottom: 8,
    },
    summaryCard: {
        height: '100%',
        justifyContent: 'center',
        elevation: 2,
    },
    cardHeader: {
        marginBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 11,
        color: colors.textLight,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 11,
        color: colors.textLight,
        fontWeight: '500',
    },
    heroContainer: {
        backgroundColor: colors.surface,
        padding: 24,
        borderRadius: layout.borderRadius,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        ...layout.shadow,
    },
    heroLabel: {
        fontSize: 12,
        color: colors.textLight,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    heroAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.5,
    },
    heroIcon: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 50,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        marginVertical: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    }
});

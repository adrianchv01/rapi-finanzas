import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { colors, layout } from '../theme/colors';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { formatCurrency } from '../utils/format';
import { Card } from '../components/Card';

export const SettingsScreen = () => {
    const { distribution, updateDistribution, incomes } = useFinance();
    const { logout } = useAuth();

    const [savings, setSavings] = useState(distribution.savings.toString());
    const [fixed, setFixed] = useState(distribution.fixed.toString());
    const [variable, setVariable] = useState(distribution.variable.toString());

    // Calculate total monthly income
    const totalIncome = incomes.reduce((sum, item) => {
        const freq = item.frequency || 1;
        return sum + (parseFloat(item.amount) / freq);
    }, 0);

    const handleSave = async () => {
        const s = parseFloat(savings) || 0;
        const f = parseFloat(fixed) || 0;
        const v = parseFloat(variable) || 0;

        if (s + f + v > 100) {
            Alert.alert('Error', 'La suma de porcentajes no puede exceder 100%');
            return;
        }

        await updateDistribution({
            savings: s,
            fixed: f,
            variable: v
        });
        Alert.alert('Éxito', 'Distribución actualizada correctamente');
    };

    const calcAmount = (pctStr) => {
        const pct = parseFloat(pctStr) || 0;
        return formatCurrency(totalIncome * (pct / 100));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Configuración de Presupuesto</Text>

            <Card style={styles.card}>
                <Text style={styles.subtitle}>Distribución del Sueldo (%)</Text>
                <Text style={styles.info}>Total Ingresos: {formatCurrency(totalIncome)}</Text>

                <View style={styles.row}>
                    <View style={styles.inputWrap}>
                        <Input
                            label="Ahorros (%)"
                            value={savings}
                            onChangeText={setSavings}
                            keyboardType="numeric"
                        />
                        <Text style={styles.calcValue}>{calcAmount(savings)}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.inputWrap}>
                        <Input
                            label="Gastos Fijos (%)"
                            value={fixed}
                            onChangeText={setFixed}
                            keyboardType="numeric"
                        />
                        <Text style={styles.calcValue}>{calcAmount(fixed)}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.inputWrap}>
                        <Input
                            label="Gastos Variables (%)"
                            value={variable}
                            onChangeText={setVariable}
                            keyboardType="numeric"
                        />
                        <Text style={styles.calcValue}>{calcAmount(variable)}</Text>
                    </View>
                </View>

                <Text style={[styles.total, (parseFloat(savings) + parseFloat(fixed) + parseFloat(variable)) > 100 ? styles.error : null]}>
                    Total: {(parseFloat(savings) || 0) + (parseFloat(fixed) || 0) + (parseFloat(variable) || 0)}%
                </Text>

                <Button title="Guardar Distribución" onPress={handleSave} />
            </Card>

            <Button
                title="Cerrar Sesión"
                onPress={logout}
                variant="secondary"
                style={{ marginTop: 20 }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.background,
        minHeight: '100%',
    },
    card: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: colors.text,
    },
    info: {
        marginBottom: 20,
        color: colors.textLight,
    },
    row: {
        marginBottom: 10,
    },
    inputWrap: {
        marginBottom: 10,
    },
    calcValue: {
        textAlign: 'right',
        color: colors.primary,
        fontWeight: 'bold',
        marginTop: -10,
        marginBottom: 10,
    },
    total: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    error: {
        color: colors.danger,
    }
});

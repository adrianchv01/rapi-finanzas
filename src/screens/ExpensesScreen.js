import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors, layout } from '../theme/colors';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/format';
import { useRoute } from '@react-navigation/native';

const ExpenseForm = ({ amount, setAmount, concept, setConcept, type, setType, frequency, setFrequency, onAdd }) => {

    const TypeTab = ({ t, label }) => (
        <TouchableOpacity
            style={[styles.tab, type === t && styles.tabActive]}
            onPress={() => setType(t)}
        >
            <Text style={[styles.tabText, type === t && styles.tabTextActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.tabs}>
                <TypeTab t="fijo" label="Fijos" />
                <TypeTab t="variable" label="Variables" />
                <TypeTab t="hormiga" label="Hormiga" />
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Registrar Gasto ({type})</Text>
                <Input
                    label="Concepto"
                    value={concept}
                    onChangeText={setConcept}
                />
                <Input
                    label="Monto"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />

                {type === 'fijo' && (
                    <View style={{ marginBottom: 16 }}>
                        <Text style={styles.label}>Frecuencia de pago</Text>
                        <View style={styles.freqRow}>
                            {[1, 2, 3].map(m => (
                                <TouchableOpacity
                                    key={m}
                                    style={[styles.freqBtn, frequency === m && styles.freqBtnActive]}
                                    onPress={() => setFrequency(m)}
                                >
                                    <Text style={[styles.freqText, frequency === m && styles.textActive]}>
                                        {m} Mes{m > 1 ? 'es' : ''}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <Button
                    title="Agregar Gasto"
                    onPress={onAdd}
                    variant="danger"
                />
            </View>

            <Text style={[styles.title, { marginTop: 20 }]}>Historial ({type})</Text>
        </View>
    );
};

export const ExpensesScreen = () => {
    const { expenses, addExpense, removeExpense } = useFinance();
    const route = useRoute();

    const defaultType = route.params?.type || 'variable';

    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [type, setType] = useState(defaultType);
    const [frequency, setFrequency] = useState(1);

    useEffect(() => {
        if (route.params?.type) {
            setType(route.params.type);
        }
    }, [route.params?.type]);

    const handleAdd = () => {
        if (!amount || !concept) {
            Alert.alert('Error', 'Completa los campos');
            return;
        }
        const val = parseFloat(amount);
        if (val <= 0) {
            Alert.alert('Error', 'El monto debe ser positivo');
            return;
        }

        addExpense({
            amount: val,
            concept,
            type,
            frequency: type === 'fijo' ? frequency : 1,
        });
        setAmount('');
        setConcept('');
        setFrequency(1);
    };

    const filteredExpenses = expenses.filter(e => e.type === type);

    const renderItem = ({ item }) => (
        <Card style={styles.itemCard}>
            <View style={styles.itemRow}>
                <View>
                    <Text style={styles.itemConcept}>{item.concept}</Text>
                    <Text style={styles.itemSub}>
                        {item.type.toUpperCase()}
                        {item.type === 'fijo' && item.frequency > 1 ? ` (Cada ${item.frequency} meses)` : ''}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.itemAmount, { color: colors.danger }]}>
                        - {formatCurrency(item.amount)}
                    </Text>
                    <TouchableOpacity onPress={() => removeExpense(item.id)}>
                        <Text style={styles.deleteText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <ExpenseForm
                    amount={amount} setAmount={setAmount}
                    concept={concept} setConcept={setConcept}
                    type={type} setType={setType}
                    frequency={frequency} setFrequency={setFrequency}
                    onAdd={handleAdd}
                />

                <Text style={[styles.title, { marginTop: 20 }]}>Historial ({type})</Text>

                {filteredExpenses.length > 0 ? (
                    filteredExpenses.slice().reverse().map(item => (
                        <View key={item.id}>
                            {renderItem({ item })}
                        </View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', color: colors.textLight, marginTop: 20 }}>
                        No hay gastos registrados en esta categoría.
                    </Text>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.background,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: colors.surface,
        padding: 4,
        borderRadius: layout.borderRadius,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: layout.borderRadius - 4,
    },
    tabActive: {
        backgroundColor: colors.danger,
    },
    tabText: {
        color: colors.textLight,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#fff',
    },
    form: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: layout.borderRadius,
        ...layout.shadow,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.text,
    },
    label: {
        marginBottom: 8,
        color: colors.text,
        fontWeight: '500',
    },
    freqRow: {
        flexDirection: 'row',
        gap: 10,
    },
    freqBtn: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: layout.borderRadius,
        alignItems: 'center',
    },
    freqBtnActive: {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
    },
    freqText: {
        color: colors.text,
    },
    textActive: {
        color: '#fff',
    },
    itemCard: {
        marginVertical: 4,
        paddingVertical: 12,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemConcept: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    itemSub: {
        fontSize: 12,
        color: colors.textLight,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteText: {
        color: colors.textLight,
        fontSize: 12,
        marginTop: 4,
    }
});

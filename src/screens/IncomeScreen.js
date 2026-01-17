import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { colors, layout } from '../theme/colors';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { formatCurrency } from '../utils/format';
import { useNavigation } from '@react-navigation/native';

const IncomeForm = ({
    amount, setAmount,
    concept, setConcept,
    type, setType,
    frequency, setFrequency,
    onAdd,
    distribution
}) => {
    const navigation = useNavigation();

    const calcDist = (pct) => {
        const val = parseFloat(amount) || 0;
        return val * (pct / 100);
    };

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Registrar Ingreso</Text>
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

            <View style={styles.typeSelector}>
                <TouchableOpacity
                    style={[styles.typeBtn, type === 'fijo' && styles.typeBtnActive]}
                    onPress={() => setType('fijo')}
                >
                    <Text style={[styles.typeText, type === 'fijo' && styles.textActive]}>Fijo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeBtn, type === 'variable' && styles.typeBtnActive]}
                    onPress={() => setType('variable')}
                >
                    <Text style={[styles.typeText, type === 'variable' && styles.textActive]}>Variable</Text>
                </TouchableOpacity>
            </View>

            {type === 'fijo' && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={styles.label}>Frecuencia de cobro</Text>
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

            {/* Proyección de Distribución */}
            {amount ? (
                <View style={styles.projectionBox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={styles.projectionTitle}>Distribución estimada</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Configuración')}>
                            <Text style={{ color: colors.primary, fontSize: 12 }}>Editar %</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.distRow}>
                        <Text style={styles.distLabel}>Ahorro ({distribution.savings}%)</Text>
                        <Text style={styles.distValue}>{formatCurrency(calcDist(distribution.savings))}</Text>
                    </View>
                    <View style={styles.distRow}>
                        <Text style={styles.distLabel}>Fijos ({distribution.fixed}%)</Text>
                        <Text style={styles.distValue}>{formatCurrency(calcDist(distribution.fixed))}</Text>
                    </View>
                    <View style={styles.distRow}>
                        <Text style={styles.distLabel}>Variables ({distribution.variable}%)</Text>
                        <Text style={styles.distValue}>{formatCurrency(calcDist(distribution.variable))}</Text>
                    </View>
                </View>
            ) : null}

            <Button title="Agregar Ingreso" onPress={onAdd} />
            <Text style={[styles.title, { marginTop: 20 }]}>Historial</Text>
        </View>
    );
};

export const IncomeScreen = () => {
    const { incomes, addIncome, removeIncome, distribution } = useFinance();
    const [amount, setAmount] = useState('');
    const [concept, setConcept] = useState('');
    const [type, setType] = useState('fijo'); // fijo | variable
    const [frequency, setFrequency] = useState(1); // 1, 2, 3 months

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

        addIncome({
            amount: val,
            concept,
            type,
            frequency: type === 'fijo' ? frequency : 1,
        });
        setAmount('');
        setConcept('');
        setFrequency(1);
    };

    const renderItem = ({ item }) => (
        <Card style={styles.itemCard}>
            <View style={styles.itemRow}>
                <View>
                    <Text style={styles.itemConcept}>{item.concept}</Text>
                    <Text style={styles.itemSub}>
                        {item.type === 'fijo' ? `Cada ${item.frequency} mes(es)` : 'Variable'}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
                    <TouchableOpacity onPress={() => removeIncome(item.id)}>
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
                <IncomeForm
                    amount={amount} setAmount={setAmount}
                    concept={concept} setConcept={setConcept}
                    type={type} setType={setType}
                    frequency={frequency} setFrequency={setFrequency}
                    onAdd={handleAdd}
                    distribution={distribution}
                />

                <Text style={[styles.title, { marginTop: 20 }]}>Historial</Text>

                {incomes.slice().reverse().map(item => (
                    <View key={item.id}>
                        {renderItem({ item })}
                    </View>
                ))}
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
    typeSelector: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: colors.background,
        borderRadius: layout.borderRadius,
        padding: 4,
    },
    typeBtn: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: layout.borderRadius - 2,
    },
    typeBtnActive: {
        backgroundColor: colors.primary,
    },
    typeText: {
        color: colors.textLight,
        fontWeight: '600',
    },
    textActive: {
        color: '#fff',
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
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    freqText: {
        color: colors.text,
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
        color: colors.success,
    },
    deleteText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: 4,
    },
    projectionBox: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 16,
    },
    projectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text
    },
    distRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2
    },
    distLabel: {
        fontSize: 12,
        color: colors.textLight
    },
    distValue: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text
    }
});

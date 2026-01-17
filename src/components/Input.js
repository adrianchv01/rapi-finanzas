import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { colors, layout } from '../theme/colors';

export const Input = ({ label, style, error, ...props }) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholderTextColor={colors.textLight}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 4,
        fontWeight: '500',
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: layout.borderRadius,
        padding: 12,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 4,
    }
});

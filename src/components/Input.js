import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { colors, layout } from '../theme/colors';

export const Input = ({ label, style, error, ...props }) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper, error && styles.inputError]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={colors.placeholder}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        color: colors.textLight,
        marginBottom: 8,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase', // Fintech vibe
    },
    inputWrapper: {
        backgroundColor: colors.background, // Input sits on background color
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 14 : 4,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    input: {
        fontSize: 17,
        color: colors.text,
        fontWeight: '500',
    },
    inputError: {
        borderColor: colors.danger,
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    }
});
import { Platform } from 'react-native';

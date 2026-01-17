import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, layout } from '../theme/colors';

export const Button = ({ title, onPress, variant = 'primary', loading = false, style, textStyle }) => {
    const backgroundColor = colors[variant] || colors.primary;

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: layout.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        ...layout.shadow,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});

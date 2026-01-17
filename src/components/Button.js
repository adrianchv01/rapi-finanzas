import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, layout } from '../theme/colors';

export const Button = ({ title, onPress, variant = 'primary', loading = false, style, textStyle }) => {
    // Map variant strings to actual colors if needed, defaulting to primary black
    let backgroundColor = colors.primary;
    if (variant === 'danger') backgroundColor = colors.danger;
    if (variant === 'secondary') backgroundColor = colors.border;
    if (variant === 'success') backgroundColor = colors.success;

    // Text color logic
    const textColor = variant === 'secondary' ? colors.text : '#fff';

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 30, // Pill shape
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, layout } from '../theme/colors';

export const Card = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: layout.padding,
        ...layout.shadow,
        borderWidth: 1,
        borderColor: colors.border, // Subtle container definition
        marginBottom: 16,
    }
});

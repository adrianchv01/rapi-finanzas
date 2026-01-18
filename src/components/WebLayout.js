import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

export const WebLayout = ({ children }) => {
    const windowWidth = Dimensions.get('window').width;
    const isWebDesktop = Platform.OS === 'web' && windowWidth > 768;

    if (Platform.OS !== 'web') {
        // Para móvil nativo, retornar el layout normal
        return <View style={{ flex: 1 }}>{children}</View>;
    }

    return (
        <View style={[
            styles.mainContent,
            isWebDesktop && styles.mainContentWithSidebar
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
    },
    mainContentWithSidebar: {
        marginLeft: 250,
    },
});

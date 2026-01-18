import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

export const WebLayout = ({ children, tabBar }) => {
    const windowWidth = Dimensions.get('window').width;
    const isWebDesktop = Platform.OS === 'web' && windowWidth > 768;

    if (Platform.OS !== 'web') {
        // Para móvil nativo, retornar el layout normal
        return (
            <View style={{ flex: 1 }}>
                {children}
                {tabBar}
            </View>
        );
    }

    return (
        <View style={styles.webContainer}>
            {isWebDesktop && (
                <View style={styles.sidebar}>
                    {tabBar}
                </View>
            )}
            <View style={[
                styles.mainContent,
                isWebDesktop && styles.mainContentWithSidebar
            ]}>
                {children}
            </View>
            {!isWebDesktop && (
                <View style={styles.bottomBar}>
                    {tabBar}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    webContainer: {
        flexDirection: 'row',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    sidebar: {
        width: 250,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
    },
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
    bottomBar: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    }
});

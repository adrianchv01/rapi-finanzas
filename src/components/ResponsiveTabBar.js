import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const ResponsiveTabBar = ({ state, descriptors, navigation }) => {
    const windowWidth = Dimensions.get('window').width;
    const isWeb = Platform.OS === 'web' && windowWidth > 768; // Desktop Web breakpoint

    if (isWeb) {
        return (
            <View style={styles.sidebar}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="wallet" size={24} color="#fff" />
                    </View>
                    <Text style={styles.logoText}>Finanzas</Text>
                </View>

                <View style={styles.sidebarLinks}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        let iconName = 'ellipse';
                        if (route.name === 'Dashboard') iconName = isFocused ? 'grid' : 'grid-outline';
                        if (route.name === 'Ingresos') iconName = isFocused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
                        if (route.name === 'Gastos') iconName = isFocused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
                        if (route.name === 'Configuración') iconName = isFocused ? 'settings' : 'settings-outline';

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={[styles.sidebarLink, isFocused && styles.sidebarLinkActive]}
                            >
                                <Ionicons name={iconName} size={20} color={isFocused ? colors.primary : colors.textLight} />
                                <Text style={[styles.sidebarLinkText, isFocused && styles.sidebarLinkTextActive]}>
                                    {route.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.userContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>U</Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>Usuario</Text>
                        <Text style={styles.userEmail}>prueba@gmail.com</Text>
                    </View>
                </View>
            </View>
        );
    }

    // Mobile Bottom Tab Bar (fallback)
    return (
        <View style={styles.bottomBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                let iconName = 'ellipse';
                if (route.name === 'Dashboard') iconName = isFocused ? 'grid' : 'grid-outline';
                if (route.name === 'Ingresos') iconName = isFocused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
                if (route.name === 'Gastos') iconName = isFocused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
                if (route.name === 'Configuración') iconName = isFocused ? 'settings' : 'settings-outline';

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.bottomTab}
                    >
                        <Ionicons name={iconName} size={24} color={isFocused ? colors.primary : colors.textLight} />
                        <Text style={[styles.bottomTabText, { color: isFocused ? colors.primary : colors.textLight }]}>
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        ...Platform.select({
            web: {
                position: 'fixed',
                height: '100vh',
            },
            default: {
                position: 'absolute',
                height: '100%',
            }
        }),
        left: 0,
        top: 0,
        width: 250,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: colors.border,
        padding: 24,
        justifyContent: 'space-between',
        zIndex: 100,
    },
    logoIcon: {
        width: 32,
        height: 32,
        backgroundColor: colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
    },
    sidebarLinks: {
        flex: 1,
    },
    sidebarLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        gap: 12,
    },
    sidebarLinkActive: {
        backgroundColor: colors.background,
    },
    sidebarLinkText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textLight,
    },
    sidebarLinkTextActive: {
        color: colors.primary,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    userEmail: {
        fontSize: 11,
        color: colors.textLight,
    },

    // Mobile Bottom Bar
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        height: Platform.OS === 'ios' ? 95 : 75,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        paddingTop: 12,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    bottomTab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bottomTabText: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
    }
});

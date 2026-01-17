import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';

export const LoginScreen = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }
        setLoading(true);
        // Simulate network delay for effect
        setTimeout(async () => {
            const success = await login(email, password);
            if (!success) {
                setError('Credenciales incorrectas');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.content}>
                    <Text style={styles.title}>Finanzas Personales</Text>
                    <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Button
                        title="Ingresar"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        backgroundColor: colors.surface,
        padding: 30,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
        marginBottom: 30,
    },
    error: {
        color: colors.danger,
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
    }
});

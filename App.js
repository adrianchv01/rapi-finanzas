import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, Text } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { FinanceProvider } from './src/context/FinanceContext';
import { colors } from './src/theme/colors';

import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { IncomeScreen } from './src/screens/IncomeScreen';
import { ExpensesScreen } from './src/screens/ExpensesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: {
        backgroundColor: colors.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      },
      headerTintColor: colors.text,
      headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        height: 80, // Safe height for Web/Android/iOS PWA
        paddingBottom: 16, // Better safe area spacing
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '600',
        marginBottom: 8, // Little more space from bottom
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textLight,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'ellipse';
        // Default icon

        if (route.name === 'Dashboard') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Ingresos') {
          iconName = focused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
        } else if (route.name === 'Gastos') {
          iconName = focused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
        } else if (route.name === 'Configuración') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Ingresos" component={IncomeScreen} />
    <Tab.Screen name="Gastos" component={ExpensesScreen} />
    <Tab.Screen name="Configuración" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

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

import { ResponsiveTabBar } from './src/components/ResponsiveTabBar';
import { WebLayout } from './src/components/WebLayout';
import { Dimensions } from 'react-native';

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <WebLayout tabBar={<ResponsiveTabBar {...props} />}>
          {props.state.routes[props.state.index].name === 'Dashboard' && <DashboardScreen />}
          {props.state.routes[props.state.index].name === 'Ingresos' && <IncomeScreen />}
          {props.state.routes[props.state.index].name === 'Gastos' && <ExpensesScreen />}
          {props.state.routes[props.state.index].name === 'Configuración' && <SettingsScreen />}
        </WebLayout>
      )}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={View} />
      <Tab.Screen name="Ingresos" component={View} />
      <Tab.Screen name="Gastos" component={View} />
      <Tab.Screen name="Configuración" component={View} />
    </Tab.Navigator>
  );
};

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

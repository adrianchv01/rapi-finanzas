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
import { Dimensions } from 'react-native';

const MainTabs = () => {
  const windowWidth = Dimensions.get('window').width;
  const isWebDesktop = Platform.OS === 'web' && windowWidth > 768;

  return (
    <Tab.Navigator
      tabBar={props => <ResponsiveTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0
        },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerShown: !isWebDesktop, // Hide header on Web Desktop if we want a cleaner dashboard look, or keep it. Let's keep it for now but maybe clean it up.
      }}
      sceneContainerStyle={isWebDesktop ? { marginLeft: 250 } : {}}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Ingresos" component={IncomeScreen} />
      <Tab.Screen name="Gastos" component={ExpensesScreen} />
      <Tab.Screen name="Configuración" component={SettingsScreen} />
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

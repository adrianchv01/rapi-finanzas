import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const storage = {
    getItem: async (key) => {
        try {
            if (Platform.OS === 'web') {
                const item = localStorage.getItem(key);
                return item != null ? JSON.parse(item) : null;
            } else {
                const item = await AsyncStorage.getItem(key);
                return item != null ? JSON.parse(item) : null;
            }
        } catch (e) {
            console.error("Error reading storage:", e);
            return null;
        }
    },
    setItem: async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            if (Platform.OS === 'web') {
                localStorage.setItem(key, jsonValue);
            } else {
                await AsyncStorage.setItem(key, jsonValue);
            }
        } catch (e) {
            console.error("Error writing storage:", e);
        }
    },
    removeItem: async (key) => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(key);
            } else {
                await AsyncStorage.removeItem(key);
            }
        } catch (e) {
            console.error("Error clearing storage:", e);
        }
    }
};

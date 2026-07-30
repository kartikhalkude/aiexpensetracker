import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExpenseStore } from '../store/useExpenseStore';
import "../global.css";
const queryClient = new QueryClient();

export default function RootLayout() {
  const { darkMode, loadTransactions, loadBudgets } = useExpenseStore();

  useEffect(() => {
    loadTransactions();
    loadBudgets();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: darkMode ? '#0F172A' : '#F8FAFC' }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}

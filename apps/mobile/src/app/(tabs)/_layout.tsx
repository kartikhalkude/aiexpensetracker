import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useExpenseStore } from '../../store/useExpenseStore';

export default function TabsLayout() {
  const { darkMode } = useExpenseStore();

  const activeColor = '#6366F1';
  const inactiveColor = darkMode ? '#64748B' : '#94A3B8';
  const bgColor = darkMode ? '#1E293B' : '#FFFFFF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💳</Text>
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎯</Text>
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: 'AI Bot',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🤖</Text>
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📈</Text>
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>
        }}
      />
    </Tabs>
  );
}

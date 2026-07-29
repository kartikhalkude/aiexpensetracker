import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExpenseStore } from '../../store/useExpenseStore';

export default function LoginScreen() {
  const router = useRouter();
  const { darkMode } = useExpenseStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const bgStyle = darkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardStyle = darkMode ? 'bg-dark-card border-dark-subtle' : 'bg-white border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className={`flex-1 ${bgStyle} justify-center px-6`}>
      <View className="items-center mb-8">
        <View className="w-16 h-16 rounded-3xl bg-indigo-600 justify-center items-center mb-3 shadow-lg">
          <Text className="text-white text-3xl">💎</Text>
        </View>
        <Text className={`text-3xl font-extrabold ${textPrimary}`}>Smart Expense AI</Text>
        <Text className={`text-xs ${textSecondary} mt-1`}>AI Powered Personal Finance & Expense Tracker</Text>
      </View>

      <View className={`${cardStyle} border rounded-3xl p-6 shadow-md mb-6`}>
        <Text className={`text-xs font-semibold ${textSecondary} mb-1 uppercase`}>Email Address</Text>
        <TextInput
          placeholder="name@domain.com"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          className={`border rounded-xl p-3.5 mb-4 ${textPrimary} border-slate-700 bg-slate-800/40`}
        />

        <Text className={`text-xs font-semibold ${textSecondary} mb-1 uppercase`}>Password</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className={`border rounded-xl p-3.5 mb-6 ${textPrimary} border-slate-700 bg-slate-800/40`}
        />

        <TouchableOpacity onPress={handleLogin} className="bg-indigo-600 py-4 rounded-xl items-center shadow-md mb-3">
          <Text className="text-white font-bold text-base">Sign In with Supabase</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="border border-slate-700 py-3.5 rounded-xl items-center">
          <Text className={`${textSecondary} font-semibold text-xs`}>Continue as Guest / Demo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

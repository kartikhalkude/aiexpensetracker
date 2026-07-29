import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenseStore } from '../../store/useExpenseStore';

export default function BudgetsScreen() {
  const { darkMode, budgets } = useExpenseStore();

  const bgStyle = darkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardStyle = darkMode ? 'bg-dark-card border-dark-subtle' : 'bg-white border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';

  const defaultBudgets = [
    { category: 'Food', limit: 10000, spent: 250, icon: '🍔' },
    { category: 'Shopping', limit: 15000, spent: 1499, icon: '🛍️' },
    { category: 'Fuel', limit: 5000, spent: 450, icon: '⛽' },
    { category: 'Entertainment', limit: 3000, spent: 2800, icon: '🎬' }
  ];

  return (
    <SafeAreaView className={`flex-1 ${bgStyle}`}>
      <View className="px-4 pt-3 mb-4 flex-row justify-between items-center">
        <View>
          <Text className={`text-2xl font-bold ${textPrimary}`}>Monthly Budgets</Text>
          <Text className={`text-xs ${textSecondary}`}>Category Spending Progress</Text>
        </View>
        <TouchableOpacity className="bg-indigo-600 px-3.5 py-2 rounded-xl shadow-sm">
          <Text className="text-white font-semibold text-xs">+ Set Budget</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {defaultBudgets.map((b, idx) => {
          const percent = Math.min(Math.round((b.spent / b.limit) * 100), 100);
          const isWarning = percent >= 80;
          const isDanger = percent >= 95;

          const barColor = isDanger ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500';

          return (
            <View key={idx} className={`${cardStyle} border rounded-2xl p-4 mb-4 shadow-sm`}>
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text className="text-xl mr-2.5">{b.icon}</Text>
                  <View>
                    <Text className={`font-bold text-base ${textPrimary}`}>{b.category}</Text>
                    <Text className={`text-xs ${textSecondary}`}>Target: ₹{b.limit.toLocaleString('en-IN')}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`font-extrabold text-base ${isDanger ? 'text-rose-500' : textPrimary}`}>
                    ₹{b.spent.toLocaleString('en-IN')}
                  </Text>
                  <Text className={`text-xs font-semibold ${isDanger ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {percent}% used
                  </Text>
                </View>
              </View>

              {/* Progress Bar Container */}
              <View className="w-full bg-slate-700/30 h-2.5 rounded-full overflow-hidden my-2">
                <View className={`h-full ${barColor} rounded-full`} style={{ width: `${percent}%` }} />
              </View>

              {isWarning && (
                <View className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex-row items-center">
                  <Text className="text-amber-500 text-xs font-medium">
                    ⚠️ {isDanger ? 'Critical Overspending Alert!' : 'Warning: 80% of budget reached.'}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useExpenseStore } from '../../store/useExpenseStore';

const screenWidth = Dimensions.get('window').width - 32;

export default function AnalyticsScreen() {
  const { darkMode } = useExpenseStore();

  const bgStyle = darkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardStyle = darkMode ? 'bg-dark-card border-dark-subtle' : 'bg-white border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';

  const monthlyComparisonData = {
    labels: ['May', 'Jun', 'Jul'],
    datasets: [{ data: [18500, 22400, 21990] }]
  };

  const merchantAnalysis = [
    { merchant: 'Amazon India', amount: 1499, category: 'Shopping', percent: 68 },
    { merchant: 'Shell Petrol Pump', amount: 450, category: 'Fuel', percent: 20 },
    { merchant: 'Swiggy', amount: 250, category: 'Food', percent: 12 }
  ];

  return (
    <SafeAreaView className={`flex-1 ${bgStyle}`}>
      <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <Text className={`text-2xl font-bold ${textPrimary}`}>Financial Analytics</Text>
          <Text className={`text-xs ${textSecondary}`}>Spending Trends & Merchant Analysis</Text>
        </View>

        {/* Monthly Comparison Bar Chart */}
        <View className={`${cardStyle} border rounded-2xl p-4 mb-6 shadow-sm`}>
          <Text className={`text-base font-bold ${textPrimary} mb-3`}>Monthly Expense Comparison</Text>
          <BarChart
            data={monthlyComparisonData}
            width={screenWidth - 32}
            height={180}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
              backgroundGradientFrom: darkMode ? '#1E293B' : '#FFFFFF',
              backgroundGradientTo: darkMode ? '#1E293B' : '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => darkMode ? `rgba(226, 232, 240, ${opacity})` : `rgba(71, 85, 105, ${opacity})`
            }}
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* Merchant Analysis */}
        <View className={`${cardStyle} border rounded-2xl p-4 mb-6 shadow-sm`}>
          <Text className={`text-base font-bold ${textPrimary} mb-4`}>Top Merchants Analysis</Text>
          {merchantAnalysis.map((m, idx) => (
            <View key={idx} className="mb-3.5">
              <View className="flex-row justify-between mb-1">
                <Text className={`font-semibold text-sm ${textPrimary}`}>{m.merchant}</Text>
                <Text className={`font-bold text-sm ${textPrimary}`}>₹{m.amount.toLocaleString('en-IN')}</Text>
              </View>
              <View className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
                <View className="h-full bg-indigo-500 rounded-full" style={{ width: `${m.percent}%` }} />
              </View>
            </View>
          ))}
        </View>

        {/* Savings Trend Card */}
        <View className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 mb-8 shadow-md">
          <Text className="text-emerald-100 text-xs uppercase font-semibold tracking-wider">Savings Trend</Text>
          <Text className="text-white text-2xl font-extrabold mt-1 mb-2">₹28,010.00 Saved This Month</Text>
          <Text className="text-emerald-100 text-xs">🎉 Excellent! You are saving 56% of your monthly income target.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

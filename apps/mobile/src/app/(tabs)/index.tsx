import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useExpenseStore } from '../../store/useExpenseStore';

const screenWidth = Dimensions.get('window').width - 32;

export default function DashboardScreen() {
  const { darkMode, transactions, budgets } = useExpenseStore();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 50000);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 2199);

  const balance = totalIncome - totalExpense;
  const budgetTarget = 50000;
  const budgetRemaining = budgetTarget - totalExpense;

  const bgStyle = darkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardStyle = darkMode ? 'bg-dark-card border-dark-subtle' : 'bg-white border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';

  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [350, 1200, 450, 2100, 250, 1499, 600] }]
  };

  const pieData = [
    { name: 'Food', population: 250, color: '#FF6B6B', legendFontColor: darkMode ? '#E2E8F0' : '#334155', legendFontSize: 12 },
    { name: 'Shopping', population: 1499, color: '#4D96FF', legendFontColor: darkMode ? '#E2E8F0' : '#334155', legendFontSize: 12 },
    { name: 'Fuel', population: 450, color: '#FFD93D', legendFontColor: darkMode ? '#E2E8F0' : '#334155', legendFontSize: 12 }
  ];

  return (
    <SafeAreaView className={`flex-1 ${bgStyle}`}>
      <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <View>
            <Text className={`text-xs font-medium uppercase tracking-widest ${textSecondary}`}>Welcome back 👋</Text>
            <Text className={`text-2xl font-bold ${textPrimary}`}>Kartik Halkude</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-indigo-600 justify-center items-center">
            <Text className="text-white font-bold">KH</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 shadow-lg mb-6 border border-indigo-400/20">
          <Text className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-1">Total Balance</Text>
          <Text className="text-white text-3xl font-extrabold mb-6">₹{balance.toLocaleString('en-IN')}.00</Text>
          
          <View className="flex-row justify-between pt-3 border-t border-white/20">
            <View>
              <Text className="text-indigo-200 text-xs mb-1">↑ Income</Text>
              <Text className="text-emerald-300 font-bold text-base">₹{totalIncome.toLocaleString('en-IN')}</Text>
            </View>
            <View className="h-8 w-[1px] bg-white/20" />
            <View>
              <Text className="text-indigo-200 text-xs mb-1">↓ Expense</Text>
              <Text className="text-rose-300 font-bold text-base">₹{totalExpense.toLocaleString('en-IN')}</Text>
            </View>
            <View className="h-8 w-[1px] bg-white/20" />
            <View>
              <Text className="text-indigo-200 text-xs mb-1">🎯 Remaining</Text>
              <Text className="text-indigo-100 font-bold text-base">₹{budgetRemaining.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Quick Metrics Cards */}
        <View className="flex-row justify-between mb-6">
          <View className={`flex-1 ${cardStyle} border rounded-2xl p-4 mr-2 shadow-sm`}>
            <Text className={`text-xs ${textSecondary} mb-1`}>Today's Spent</Text>
            <Text className={`text-lg font-bold ${textPrimary}`}>₹2,199.00</Text>
          </View>
          <View className={`flex-1 ${cardStyle} border rounded-2xl p-4 ml-2 shadow-sm`}>
            <Text className={`text-xs ${textSecondary} mb-1`}>Monthly Budget</Text>
            <Text className={`text-lg font-bold ${textPrimary}`}>₹50,000.00</Text>
          </View>
        </View>

        {/* Line Chart */}
        <View className={`${cardStyle} border rounded-2xl p-4 mb-6 shadow-sm`}>
          <Text className={`text-base font-bold ${textPrimary} mb-3`}>Weekly Spending Trend</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
              backgroundGradientFrom: darkMode ? '#1E293B' : '#FFFFFF',
              backgroundGradientTo: darkMode ? '#1E293B' : '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => darkMode ? `rgba(226, 232, 240, ${opacity})` : `rgba(71, 85, 105, ${opacity})`,
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#6366F1' }
            }}
            bezier
            style={{ borderRadius: 12, paddingRight: 32 }}
          />
        </View>

        {/* Category Breakdown Pie Chart */}
        <View className={`${cardStyle} border rounded-2xl p-4 mb-6 shadow-sm`}>
          <Text className={`text-base font-bold ${textPrimary} mb-2`}>Category Breakdown</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={160}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Recent Transactions Section */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className={`text-lg font-bold ${textPrimary}`}>Recent Transactions</Text>
          <Text className="text-indigo-500 font-semibold text-sm">View All</Text>
        </View>

        {transactions.length === 0 ? (
          <View className={`${cardStyle} border rounded-2xl p-6 items-center mb-8`}>
            <Text className={`${textSecondary} text-sm mb-2`}>No transactions recorded yet.</Text>
            <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-xl">
              <Text className="text-white font-semibold text-xs">+ Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          transactions.slice(0, 5).map((t, idx) => (
            <View key={t.id || idx} className={`${cardStyle} border rounded-2xl p-4 mb-3 flex-row justify-between items-center shadow-sm`}>
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-indigo-500/10 justify-center items-center mr-3">
                  <Text className="text-base">{t.category === 'Food' ? '🍔' : t.category === 'Shopping' ? '🛍️' : '⛽'}</Text>
                </View>
                <View>
                  <Text className={`font-semibold text-base ${textPrimary}`}>{t.merchant}</Text>
                  <Text className={`text-xs ${textSecondary}`}>{t.category} • {t.payment_method}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`font-bold text-base ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                </Text>
                <Text className={`text-[10px] ${textSecondary}`}>{t.date}</Text>
              </View>
            </View>
          ))
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}

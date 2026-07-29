import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenseStore } from '../../store/useExpenseStore';
import { ApiService } from '../../services/api';

export default function TransactionsScreen() {
  const { darkMode, transactions, addTransaction } = useExpenseStore();

  const [modalType, setModalType] = useState<'none' | 'manual' | 'voice' | 'nlp' | 'sms'>('none');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [merchant, setMerchant] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [nlpText, setNlpText] = useState('');
  const [smsText, setSmsText] = useState('');

  const bgStyle = darkMode ? 'bg-dark-bg' : 'bg-slate-50';
  const cardStyle = darkMode ? 'bg-dark-card border-dark-subtle' : 'bg-white border-slate-200';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';

  const handleManualAdd = async () => {
    if (!amount || !merchant) {
      Alert.alert('Error', 'Please enter amount and merchant');
      return;
    }
    setLoading(true);
    await addTransaction({
      amount: parseFloat(amount),
      type,
      category,
      merchant,
      payment_method: 'UPI',
      date: new Date().toISOString().split('T')[0]
    });
    setLoading(false);
    setModalType('none');
    setAmount('');
    setMerchant('');
  };

  const handleNLPParse = async () => {
    if (!nlpText) return;
    setLoading(true);
    try {
      const res = await ApiService.parseNaturalLanguage(nlpText);
      await addTransaction({
        amount: res.amount,
        type: res.type,
        category: res.category,
        merchant: res.merchant,
        payment_method: res.payment_method,
        date: res.date,
        description: res.description
      });
      Alert.alert('Success', `Parsed: ₹${res.amount} for ${res.merchant} (${res.category})`);
      setNlpText('');
      setModalType('none');
    } catch (err) {
      Alert.alert('Error', 'Failed to parse prompt');
    }
    setLoading(false);
  };

  const handleSMSParse = async () => {
    if (!smsText) return;
    setLoading(true);
    try {
      const res = await ApiService.parseSMS(smsText);
      await addTransaction({
        amount: res.amount,
        type: res.type,
        category: res.category,
        merchant: res.merchant,
        payment_method: res.payment_method,
        date: res.date,
        account_last4: res.account_last4
      });
      Alert.alert('Success', `Bank SMS Parsed: ₹${res.amount} to ${res.merchant}`);
      setSmsText('');
      setModalType('none');
    } catch (err) {
      Alert.alert('Error', 'Failed to parse SMS');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${bgStyle}`}>
      <View className="px-4 pt-3 mb-3 flex-row justify-between items-center">
        <Text className={`text-2xl font-bold ${textPrimary}`}>Transactions</Text>
        <Text className={`text-xs ${textSecondary}`}>{transactions.length} Total</Text>
      </View>

      {/* Quick Action Buttons */}
      <View className="flex-row px-4 mb-4 justify-between">
        <TouchableOpacity 
          onPress={() => setModalType('manual')}
          className="flex-1 bg-indigo-600 rounded-xl py-2.5 mr-1 items-center justify-center shadow-sm"
        >
          <Text className="text-white font-semibold text-xs">+ Manual</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setModalType('nlp')}
          className="flex-1 bg-purple-600 rounded-xl py-2.5 mx-1 items-center justify-center shadow-sm"
        >
          <Text className="text-white font-semibold text-xs">✨ AI Prompt</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setModalType('sms')}
          className="flex-1 bg-emerald-600 rounded-xl py-2.5 ml-1 items-center justify-center shadow-sm"
        >
          <Text className="text-white font-semibold text-xs">📱 SMS Parse</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {transactions.map((t, idx) => (
          <View key={t.id || idx} className={`${cardStyle} border rounded-2xl p-4 mb-3 flex-row justify-between items-center shadow-sm`}>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-indigo-500/10 justify-center items-center mr-3">
                <Text className="text-base">{t.type === 'income' ? '💰' : '💳'}</Text>
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
        ))}
        <View className="h-10" />
      </ScrollView>

      {/* Modal - Entry Modals */}
      <Modal visible={modalType !== 'none'} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/60">
          <View className={`${cardStyle} rounded-t-3xl p-6 border-t`}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-lg font-bold ${textPrimary}`}>
                {modalType === 'manual' && 'Add Transaction'}
                {modalType === 'nlp' && '✨ AI Natural Language / Voice Prompt'}
                {modalType === 'sms' && '📱 Bank SMS Auto Parser'}
              </Text>
              <TouchableOpacity onPress={() => setModalType('none')}>
                <Text className="text-slate-400 font-bold text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {modalType === 'manual' && (
              <View>
                <TextInput
                  placeholder="Amount (e.g. 500)"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  className={`border rounded-xl p-3 mb-3 ${textPrimary} border-slate-700 bg-slate-800/50`}
                />
                <TextInput
                  placeholder="Merchant / Title (e.g. Swiggy)"
                  placeholderTextColor="#94A3B8"
                  value={merchant}
                  onChangeText={setMerchant}
                  className={`border rounded-xl p-3 mb-3 ${textPrimary} border-slate-700 bg-slate-800/50`}
                />
                <TouchableOpacity 
                  onPress={handleManualAdd}
                  disabled={loading}
                  className="bg-indigo-600 py-3 rounded-xl items-center mt-2"
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Save Transaction</Text>}
                </TouchableOpacity>
              </View>
            )}

            {modalType === 'nlp' && (
              <View>
                <TextInput
                  placeholder="e.g. Spent 250 on lunch or I spent ₹500 on groceries yesterday"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  value={nlpText}
                  onChangeText={setNlpText}
                  className={`border rounded-xl p-3 mb-3 ${textPrimary} border-slate-700 bg-slate-800/50`}
                />
                <TouchableOpacity 
                  onPress={handleNLPParse}
                  disabled={loading}
                  className="bg-purple-600 py-3 rounded-xl items-center mt-2"
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Extract & Save via AI</Text>}
                </TouchableOpacity>
              </View>
            )}

            {modalType === 'sms' && (
              <View>
                <TextInput
                  placeholder="Paste Bank SMS (e.g. Rs 250.00 debited from A/C XX1234 to Swiggy)"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  value={smsText}
                  onChangeText={setSmsText}
                  className={`border rounded-xl p-3 mb-3 ${textPrimary} border-slate-700 bg-slate-800/50`}
                />
                <TouchableOpacity 
                  onPress={handleSMSParse}
                  disabled={loading}
                  className="bg-emerald-600 py-3 rounded-xl items-center mt-2"
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Parse SMS & Save</Text>}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
